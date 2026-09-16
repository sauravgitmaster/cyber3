import { useState, useEffect, useRef, useCallback } from 'react';
import { RoomStateClient, MultiplayerQuestionClient, RoundResultSummary, PlayerProfileState } from '../types/multiplayer';
import { multiplayerApi, PlayerInput } from '../utils/multiplayerApi';
import { multiplayerQuestionsPool, getEightRandomQuestions } from '../data/multiplayerQuestions';
import { cloudRelay } from '../utils/cloudRelay';
import { p2pRelay, P2PHostSession, P2PGuestSession } from '../utils/p2pRelay';

function getSessionPlayerId(baseUserId?: string): string {
  try {
    const key = 'cybermentor_multiplayer_tab_player_id';
    let id = sessionStorage.getItem(key);
    if (!id) {
      const suffix = Math.random().toString(36).substring(2, 7);
      id = baseUserId ? `${baseUserId}_${suffix}` : `p_${Date.now().toString(36)}_${suffix}`;
      sessionStorage.setItem(key, id);
    }
    return id;
  } catch {
    return `p_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
  }
}

// Function to validate whether incoming state should replace current room state
// CRITICAL: A game in progress ('starting', 'in_round', 'round_locked', 'game_over')
// must NEVER regress back to 'waiting'.
function shouldAcceptStateUpdate(
  current: RoomStateClient | null,
  incoming: RoomStateClient
): boolean {
  if (!current) return true;

  const statusPriority: Record<RoomStateClient['status'], number> = {
    waiting: 0,
    starting: 1,
    in_round: 2,
    round_locked: 3,
    game_over: 4,
    expired: -1,
  };

  const curRank = statusPriority[current.status] ?? 0;
  const incRank = statusPriority[incoming.status] ?? 0;

  // Never revert an active match back to 'waiting'
  if (curRank >= 1 && incRank === 0) {
    return false;
  }

  // If incoming has advanced in rounds
  if (incoming.currentRound > current.currentRound) {
    return true;
  }

  // If incoming has advanced in phase/status
  if (incRank > curRank) {
    return true;
  }

  // If current was missing guest and incoming attached one
  if (!current.guest && incoming.guest) {
    return true;
  }

  // If incoming timestamp is newer or equal
  if (incoming.updatedAt >= current.updatedAt) {
    return true;
  }

  return false;
}

export function useMultiplayerRoom(currentUser: { id?: string; name: string; avatar: string }) {
  const [room, setRoom] = useState<RoomStateClient | null>(null);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Player identity (persisted per browser tab so host and guest never collide in multi-tab testing)
  const playerIdRef = useRef<string>(getSessionPlayerId(currentUser.id));
  const activeRoomCodeRef = useRef<string | null>(null);
  const roomRef = useRef<RoomStateClient | null>(null);
  const storedQuestionsRef = useRef<any[]>([]);

  useEffect(() => {
    roomRef.current = room;
  }, [room]);

  useEffect(() => {
    activeRoomCodeRef.current = roomCode;
  }, [roomCode]);

  const eventSourceRef = useRef<EventSource | null>(null);
  const cloudRelayUnsubRef = useRef<(() => void) | null>(null);
  const pollIntervalRef = useRef<number | null>(null);
  const heartbeatIntervalRef = useRef<number | null>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const storageListenerRef = useRef<((e: StorageEvent) => void) | null>(null);
  const p2pHostRef = useRef<P2PHostSession | null>(null);
  const p2pGuestRef = useRef<P2PGuestSession | null>(null);

  const playerInput: PlayerInput = {
    id: playerIdRef.current,
    name: currentUser.name || 'Explorer',
    avatar: currentUser.avatar || '',
  };

  // Helper to publish state to local storage, broadcast channel, cloud relay, and P2P
  const broadcastRoomState = useCallback((state: RoomStateClient) => {
    try {
      localStorage.setItem(`cybermentor_room_${state.code}`, JSON.stringify(state));
    } catch {
      // ignore
    }
    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({ type: 'ROOM_UPDATE', room: state });
      } catch {
        // ignore
      }
    }
    // WebRTC P2P direct broadcast to connected peer
    if (p2pHostRef.current) {
      p2pHostRef.current.broadcastState(state);
    }
    // Cloud Relay for cross-network and cross-device sync
    cloudRelay.publishRoomState(state.code, state);
  }, []);

  // Stop all active subscriptions
  const cleanupSubscriptions = useCallback(() => {
    if (p2pHostRef.current) {
      p2pHostRef.current.close();
      p2pHostRef.current = null;
    }
    if (p2pGuestRef.current) {
      p2pGuestRef.current.close();
      p2pGuestRef.current = null;
    }
    if (cloudRelayUnsubRef.current) {
      cloudRelayUnsubRef.current();
      cloudRelayUnsubRef.current = null;
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.close();
      broadcastChannelRef.current = null;
    }
    if (storageListenerRef.current) {
      window.removeEventListener('storage', storageListenerRef.current);
      storageListenerRef.current = null;
    }
  }, []);

  // Connect to SSE stream, BroadcastChannel, and sync polling backup
  const connectToRoom = useCallback(
    (code: string) => {
      cleanupSubscriptions();
      setRoomCode(code);

      // Try reading pre-cached questions for this room
      try {
        const savedQ = localStorage.getItem(`cybermentor_questions_${code}`);
        if (savedQ) {
          storedQuestionsRef.current = JSON.parse(savedQ);
        }
      } catch {
        // ignore
      }

      // 0. Setup Cloud Relay real-time event listener (across devices & Vercel)
      try {
        cloudRelayUnsubRef.current = cloudRelay.subscribe(code, {
          onRoomState: (incoming) => {
            setRoom((prev) => {
              if (shouldAcceptStateUpdate(prev, incoming)) {
                setIsHost(incoming.host.id === playerIdRef.current);
                return incoming;
              }
              return prev;
            });
            setError(null);
          },
          onAction: (action) => {
            if (!action || !action.type) return;

            if (action.type === 'GUEST_JOINED' && action.room) {
              setRoom((prev) => {
                if (shouldAcceptStateUpdate(prev, action.room)) {
                  setIsHost(action.room.host.id === playerIdRef.current);
                  return action.room;
                }
                return prev;
              });
            } else if (action.type === 'GAME_STARTED' && action.room) {
              if (action.questions && Array.isArray(action.questions)) {
                storedQuestionsRef.current = action.questions;
                try {
                  localStorage.setItem(`cybermentor_questions_${code}`, JSON.stringify(action.questions));
                } catch {
                  // ignore
                }
              }
              setRoom((prev) => {
                if (shouldAcceptStateUpdate(prev, action.room)) {
                  setIsHost(action.room.host.id === playerIdRef.current);
                  return action.room;
                }
                return prev;
              });
            } else if (action.type === 'PLAYER_ANSWER' && action.playerId !== playerIdRef.current) {
              // Remote player answered! Update local room state
              setRoom((prev) => {
                if (!prev || prev.status !== 'in_round' || !prev.currentQuestion) return prev;
                const alreadyAnswered = prev.answeredPlayerIds?.includes(action.playerId);
                if (alreadyAnswered) return prev;

                const q = multiplayerQuestionsPool.find((item) => item.id === action.questionId);
                const isCorrect = q ? q.correctOptionId === action.optionId : false;
                const isHostAnswer = prev.host.id === action.playerId;
                const updatedHost = { ...prev.host };
                const updatedGuest = prev.guest ? { ...prev.guest } : null;
                const activePlayer = isHostAnswer ? updatedHost : updatedGuest;

                if (isCorrect && activePlayer) {
                  const existingAnswers = (prev.lastRoundResult?.playerAnswers || {}) as Record<string, { isCorrect?: boolean }>;
                  const otherAlreadyCorrect = Object.values(existingAnswers).some((ans) => Boolean(ans?.isCorrect));
                  const pts = otherAlreadyCorrect ? 60 : 100;
                  activePlayer.score += pts;
                  activePlayer.correctCount += 1;
                }

                const updatedAnswered = Array.from(new Set([...(prev.answeredPlayerIds || []), action.playerId]));
                const expectedPlayersCount = prev.guest && prev.guest.isConnected ? 2 : 1;
                const bothPicked = updatedAnswered.length >= expectedPlayersCount;

                const existingAnswers = prev.lastRoundResult?.playerAnswers || {};
                const newPlayerAnswers = {
                  ...existingAnswers,
                  [action.playerId]: {
                    optionId: action.optionId,
                    isCorrect,
                    pointsAwarded: isCorrect ? 100 : 0,
                    responseTimeMs: action.clientTime && prev.roundStartTime ? Math.max(100, action.clientTime - prev.roundStartTime) : 1200,
                  },
                };

                let winnerId = prev.lastRoundResult?.winnerPlayerId || null;
                let winnerName = prev.lastRoundResult?.winnerPlayerName || null;
                if (isCorrect && !winnerId) {
                  winnerId = action.playerId;
                  winnerName = activePlayer?.name || 'Player';
                }

                const summary: RoundResultSummary = {
                  questionId: action.questionId,
                  roundNumber: prev.currentRound,
                  title: q?.title || 'Cyber Challenge',
                  situation: q?.situation || prev.currentQuestion.situation,
                  correctOptionId: q?.correctOptionId || action.optionId,
                  correctOptionText: q?.options.find((o) => o.id === (q?.correctOptionId || action.optionId))?.text || '',
                  winnerPlayerId: winnerId,
                  winnerPlayerName: winnerName,
                  secondPlayerId: null,
                  secondPlayerName: null,
                  whySafe: q?.whySafe || 'Great choice!',
                  playerAnswers: newPlayerAnswers,
                };

                if (bothPicked) {
                  return {
                    ...prev,
                    status: 'round_locked',
                    host: updatedHost,
                    guest: updatedGuest,
                    answeredPlayerIds: updatedAnswered,
                    lastRoundResult: summary,
                    roundHistory: [...prev.roundHistory, summary],
                    updatedAt: Date.now(),
                  };
                } else {
                  return {
                    ...prev,
                    host: updatedHost,
                    guest: updatedGuest,
                    answeredPlayerIds: updatedAnswered,
                    lastRoundResult: summary,
                    updatedAt: Date.now(),
                  };
                }
              });
            }
          },
        });
      } catch {
        // ignore
      }

      // 1. Setup cross-tab BroadcastChannel for instant sync across windows/tabs
      try {
        if (typeof BroadcastChannel !== 'undefined') {
          const bc = new BroadcastChannel(`cybermentor_room_${code}`);
          bc.onmessage = (event) => {
            if (event.data) {
              if (event.data.questions && Array.isArray(event.data.questions)) {
                storedQuestionsRef.current = event.data.questions;
                try {
                  localStorage.setItem(`cybermentor_questions_${code}`, JSON.stringify(event.data.questions));
                } catch {
                  // ignore
                }
              }

              if (event.data.room) {
                const incoming: RoomStateClient = event.data.room;
                setRoom((prev) => {
                  if (shouldAcceptStateUpdate(prev, incoming)) {
                    setIsHost(incoming.host.id === playerIdRef.current);
                    return incoming;
                  }
                  return prev;
                });
              }
            }
          };
          broadcastChannelRef.current = bc;
        }
      } catch {
        // BroadcastChannel unavailable
      }

      // 2. Setup storage event listener for cross-tab sync
      const handleStorage = (e: StorageEvent) => {
        if (e.key === `cybermentor_action_${code}` && e.newValue) {
          try {
            const action = JSON.parse(e.newValue);
            if (action.questions && Array.isArray(action.questions)) {
              storedQuestionsRef.current = action.questions;
            }
            if (action.room) {
              setRoom((prev) => {
                if (shouldAcceptStateUpdate(prev, action.room)) {
                  setIsHost(action.room.host.id === playerIdRef.current);
                  return action.room;
                }
                return prev;
              });
            }
          } catch {
            // ignore
          }
        } else if (e.key === `cybermentor_room_${code}` && e.newValue) {
          try {
            const parsed: RoomStateClient = JSON.parse(e.newValue);
            setRoom((prev) => {
              if (shouldAcceptStateUpdate(prev, parsed)) {
                setIsHost(parsed.host.id === playerIdRef.current);
                return parsed;
              }
              return prev;
            });
          } catch {
            // ignore JSON error
          }
        }
      };
      window.addEventListener('storage', handleStorage);
      storageListenerRef.current = handleStorage;

      // 3. Initial immediate state fetch from server, cloud relay, or localStorage
      multiplayerApi
        .getRoomState(code, playerIdRef.current)
        .then((state) => {
          setRoom((prev) => {
            if (shouldAcceptStateUpdate(prev, state)) {
              setIsHost(state.host.id === playerIdRef.current);
              return state;
            }
            return prev;
          });
        })
        .catch(async () => {
          // Check Cloud Relay first
          try {
            const cloudState = await cloudRelay.fetchRoomState(code);
            if (cloudState) {
              setRoom((prev) => {
                if (shouldAcceptStateUpdate(prev, cloudState)) {
                  setIsHost(cloudState.host.id === playerIdRef.current);
                  return cloudState;
                }
                return prev;
              });
              return;
            }
          } catch {
            // ignore
          }

          // Check localStorage if server & cloud are unreachable
          try {
            const local = localStorage.getItem(`cybermentor_room_${code}`);
            if (local) {
              const parsed: RoomStateClient = JSON.parse(local);
              setRoom((prev) => {
                if (shouldAcceptStateUpdate(prev, parsed)) {
                  setIsHost(parsed.host.id === playerIdRef.current);
                  return parsed;
                }
                return prev;
              });
            }
          } catch {
            // ignore
          }
        });

      // 4. Setup Server-Sent Events (SSE)
      try {
        const sseUrl = `/api/rooms/${encodeURIComponent(code)}/events?playerId=${encodeURIComponent(playerIdRef.current)}`;
        const es = new EventSource(sseUrl);

        es.onmessage = (event) => {
          try {
            const data: RoomStateClient = JSON.parse(event.data);
            setRoom((prev) => {
              if (shouldAcceptStateUpdate(prev, data)) {
                setIsHost(data.host.id === playerIdRef.current);
                return data;
              }
              return prev;
            });
            setError(null);
          } catch {
            // ignore JSON parse error
          }
        };

        es.onerror = () => {
          if (es.readyState === EventSource.CLOSED) {
            es.close();
          }
        };

        eventSourceRef.current = es;
      } catch {
        // SSE not supported, rely on polling
      }

      // 5. Active sync intervals:
      // LocalStorage for instant cross-tab sync every 400ms
      let pollCount = 0;
      pollIntervalRef.current = window.setInterval(async () => {
        pollCount++;

        // A. Check localStorage for instant cross-tab sync
        try {
          const local = localStorage.getItem(`cybermentor_room_${code}`);
          if (local) {
            const parsed: RoomStateClient = JSON.parse(local);
            setRoom((prev) => {
              if (shouldAcceptStateUpdate(prev, parsed)) {
                setIsHost(parsed.host.id === playerIdRef.current);
                return parsed;
              }
              return prev;
            });
          }
        } catch {
          // ignore
        }

        // B. Check server state every 2 seconds (every 5 ticks)
        if (pollCount % 5 === 0) {
          try {
            const freshServer = await multiplayerApi.getRoomState(code, playerIdRef.current);
            if (freshServer) {
              setRoom((prev) => {
                if (shouldAcceptStateUpdate(prev, freshServer)) {
                  setIsHost(freshServer.host.id === playerIdRef.current);
                  return freshServer;
                }
                return prev;
              });
            }
          } catch {
            // C. If server is unreachable/serverless, check Cloud Relay gently every 6 seconds (every 15 ticks)
            if (pollCount % 15 === 0) {
              try {
                const cloudState = await cloudRelay.fetchRoomState(code);
                if (cloudState) {
                  setRoom((prev) => {
                    if (shouldAcceptStateUpdate(prev, cloudState)) {
                      setIsHost(cloudState.host.id === playerIdRef.current);
                      return cloudState;
                    }
                    return prev;
                  });
                }
              } catch {
                // ignore
              }
            }
          }
        }
      }, 400);

      // 6. Heartbeat every 3s
      heartbeatIntervalRef.current = window.setInterval(() => {
        multiplayerApi.heartbeat(code, playerIdRef.current);
      }, 3000);
    },
    [cleanupSubscriptions]
  );

  // Clean up ONLY on unmount (NOT when roomCode changes!)
  useEffect(() => {
    return () => {
      cleanupSubscriptions();
      if (activeRoomCodeRef.current) {
        multiplayerApi.leaveRoom(activeRoomCodeRef.current, playerIdRef.current);
      }
    };
  }, [cleanupSubscriptions]);

  // Actions
  const createRoom = async () => {
    setLoading(true);
    setError(null);
    let newRoom: RoomStateClient | null = null;
    try {
      newRoom = await multiplayerApi.createRoom(playerInput);
    } catch {
      // Resilient local fallback if network/serverless route is delayed or offline
      const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
      let fallbackCode = '';
      for (let i = 0; i < 6; i++) {
        fallbackCode += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      newRoom = {
        code: fallbackCode,
        status: 'waiting',
        host: {
          id: playerIdRef.current,
          name: playerInput.name,
          avatar: playerInput.avatar,
          score: 0,
          correctCount: 0,
          fastestResponseMs: null,
          isConnected: true,
          lastSeen: Date.now(),
        },
        guest: null,
        currentRound: 1,
        totalRounds: 8,
        currentQuestion: null,
        roundStartTime: null,
        roundDurationSec: 10,
        timeRemainingMs: 0,
        answeredPlayerIds: [],
        lastRoundResult: null,
        roundHistory: [],
        updatedAt: Date.now(),
      };
    }

    setRoom(newRoom);
    setRoomCode(newRoom.code);
    setIsHost(true);

    try {
      localStorage.setItem('cybermentor_recent_room_code', newRoom.code);
      localStorage.setItem(`cybermentor_room_${newRoom.code}`, JSON.stringify(newRoom));
    } catch {
      // ignore
    }

    // Publish to cloud relay so friend can discover and join from any device
    cloudRelay.publishRoomState(newRoom.code, newRoom);

    // Start P2P Host Session
    try {
      if (p2pHostRef.current) {
        p2pHostRef.current.close();
      }
      const hostSession = p2pRelay.startHost(newRoom.code, {
        onGuestJoin: (guest) => {
          setRoom((prev) => {
            if (!prev) return prev;
            const updated: RoomStateClient = {
              ...prev,
              guest,
              updatedAt: Date.now(),
            };
            hostSession.broadcastState(updated);
            broadcastRoomState(updated);
            return updated;
          });
        },
        onGuestAction: (action) => {
          cloudRelay.publishAction(newRoom.code, action);
        },
      });
      p2pHostRef.current = hostSession;
    } catch {
      // ignore
    }

    connectToRoom(newRoom.code);
    setLoading(false);
    return newRoom;
  };

  const joinRoom = async (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    setLoading(true);
    setError(null);
    try {
      localStorage.setItem('cybermentor_recent_room_code', cleanCode);
    } catch {
      // ignore
    }

    let joinedRoom: RoomStateClient | null = null;

    // 1. Check localStorage first for instant same-browser / multi-tab sync
    try {
      const localData = localStorage.getItem(`cybermentor_room_${cleanCode}`);
      if (localData) {
        const parsed: RoomStateClient = JSON.parse(localData);
        if (parsed.status === 'waiting' || !parsed.guest || parsed.guest.id === playerIdRef.current) {
          joinedRoom = parsed;
        }
      }
    } catch {
      // ignore
    }

    // 2. Try server API
    if (!joinedRoom) {
      try {
        const serverRoom = await multiplayerApi.joinRoom(cleanCode, playerInput);
        if (serverRoom && serverRoom.guest) {
          joinedRoom = serverRoom;
        }
      } catch {
        // Server might be serverless, Vercel SPA, or room in another container
      }
    }

    // 3. Try P2P WebRTC connection to Host
    if (!joinedRoom) {
      try {
        const guestSession = await p2pRelay.connectAsGuest(
          cleanCode,
          {
            id: playerIdRef.current,
            name: playerInput.name,
            avatar: playerInput.avatar,
            score: 0,
            correctCount: 0,
            fastestResponseMs: null,
            isConnected: true,
            lastSeen: Date.now(),
          },
          {
            onRoomState: (incoming) => {
              setRoom((prev) => {
                if (shouldAcceptStateUpdate(prev, incoming)) {
                  setIsHost(incoming.host.id === playerIdRef.current);
                  return incoming;
                }
                return prev;
              });
            },
            onHostAction: (action) => {
              cloudRelay.publishAction(cleanCode, action);
            },
          },
          3000
        );
        p2pGuestRef.current = guestSession;
      } catch {
        // P2P not reached or timed out
      }
    }

    // 4. Try Cloud Relay (works seamlessly across separate computers, networks, and Vercel)
    if (!joinedRoom) {
      try {
        const relayRoom = await cloudRelay.fetchRoomState(cleanCode);
        if (relayRoom && (relayRoom.status === 'waiting' || !relayRoom.guest || relayRoom.guest.id === playerIdRef.current)) {
          joinedRoom = relayRoom;
        }
      } catch {
        // ignore
      }
    }

    if (!joinedRoom) {
      const msg = `Hmm… I can’t find game room "${cleanCode}". Ask your friend to confirm the code or keep their room screen open!`;
      setError(msg);
      setLoading(false);
      throw new Error(msg);
    }

    // Attach guest profile
    const guestProfile: PlayerProfileState = {
      id: playerIdRef.current,
      name: playerInput.name,
      avatar: playerInput.avatar,
      score: 0,
      correctCount: 0,
      fastestResponseMs: null,
      isConnected: true,
      lastSeen: Date.now(),
    };
    joinedRoom.guest = guestProfile;
    joinedRoom.updatedAt = Date.now();

    setRoom(joinedRoom);
    setRoomCode(cleanCode);
    setIsHost(false);

    try {
      localStorage.setItem(`cybermentor_room_${cleanCode}`, JSON.stringify(joinedRoom));
    } catch {
      // ignore
    }

    // Broadcast across all tiers so Host detects guest immediately
    broadcastRoomState(joinedRoom);
    cloudRelay.publishRoomState(cleanCode, joinedRoom);
    cloudRelay.publishAction(cleanCode, {
      type: 'GUEST_JOINED',
      guest: guestProfile,
      room: joinedRoom,
    });

    connectToRoom(cleanCode);

    // Cross-tab BroadcastChannel notification
    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({ type: 'ROOM_UPDATE', room: joinedRoom });
      } catch {
        // ignore
      }
    }

    setLoading(false);
    return joinedRoom;
  };

  const startGame = async () => {
    if (!roomCode) return;
    setError(null);

    // 1. Prepare synchronized questions
    let questions = storedQuestionsRef.current;
    if (!questions || questions.length < 8) {
      questions = getEightRandomQuestions();
      storedQuestionsRef.current = questions;
    }
    try {
      localStorage.setItem(`cybermentor_questions_${roomCode}`, JSON.stringify(questions));
    } catch {
      // ignore
    }

    const firstQ = questions[0];
    const clientFirstQ: MultiplayerQuestionClient = {
      id: firstQ.id,
      roundNumber: 1,
      totalRounds: 8,
      category: firstQ.category,
      difficulty: firstQ.difficulty,
      situation: firstQ.situation,
      prompt: firstQ.prompt,
      options: firstQ.options,
    };

    const cur = roomRef.current;
    const startingState: RoomStateClient = {
      code: roomCode,
      status: 'starting',
      currentRound: 1,
      totalRounds: 8,
      currentQuestion: clientFirstQ,
      roundDurationSec: 10,
      roundStartTime: null,
      timeRemainingMs: 10000,
      answeredPlayerIds: [],
      lastRoundResult: null,
      roundHistory: [],
      updatedAt: Date.now(),
      host: cur
        ? { ...cur.host, score: 0, correctCount: 0 }
        : {
            id: playerIdRef.current,
            name: playerInput.name,
            avatar: playerInput.avatar,
            score: 0,
            correctCount: 0,
            fastestResponseMs: null,
            isConnected: true,
            lastSeen: Date.now(),
          },
      guest: cur?.guest
        ? { ...cur.guest, score: 0, correctCount: 0 }
        : {
            id: 'guest_player',
            name: 'Friend',
            avatar: '',
            score: 0,
            correctCount: 0,
            fastestResponseMs: null,
            isConnected: true,
            lastSeen: Date.now(),
          },
    };

    // 2. Set local host state immediately
    setRoom(startingState);

    // 3. Publish to cross-tab channels & cloud relay synchronously so Guest transitions instantly
    broadcastRoomState(startingState);
    cloudRelay.publishRoomState(roomCode, startingState);
    cloudRelay.publishAction(roomCode, {
      type: 'GAME_STARTED',
      room: startingState,
      questions,
    });

    p2pHostRef.current?.broadcastAction({
      type: 'GAME_STARTED',
      room: startingState,
      questions,
    });

    try {
      localStorage.setItem(`cybermentor_room_${roomCode}`, JSON.stringify(startingState));
      localStorage.setItem(
        `cybermentor_action_${roomCode}`,
        JSON.stringify({ type: 'START', timestamp: Date.now(), room: startingState, questions })
      );
    } catch {
      // ignore
    }

    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({
          type: 'GAME_STARTED',
          room: startingState,
          questions,
        });
      } catch {
        // ignore
      }
    }

    // 4. Inform server API
    try {
      const serverRoom = await multiplayerApi.startGame(roomCode, playerIdRef.current);
      if (serverRoom && shouldAcceptStateUpdate(startingState, serverRoom)) {
        setRoom(serverRoom);
      }
    } catch {
      // Serverless or offline fallback handled locally
    }
  };

  const submitAnswer = async (questionId: string, optionId: string) => {
    if (!roomCode || isSubmitting) return;
    setIsSubmitting(true);

    // Broadcast player answer action immediately via Cloud Relay & BroadcastChannel & P2P
    cloudRelay.publishAction(roomCode, {
      type: 'PLAYER_ANSWER',
      playerId: playerIdRef.current,
      questionId,
      optionId,
      clientTime: Date.now(),
    });

    p2pHostRef.current?.broadcastAction({
      type: 'PLAYER_ANSWER',
      playerId: playerIdRef.current,
      questionId,
      optionId,
      clientTime: Date.now(),
    });
    p2pGuestRef.current?.sendAction({
      type: 'PLAYER_ANSWER',
      playerId: playerIdRef.current,
      questionId,
      optionId,
      clientTime: Date.now(),
    });

    // 1. Send to backend if available
    try {
      const serverState = await multiplayerApi.submitAnswer(roomCode, playerIdRef.current, questionId, optionId);
      if (serverState) {
        setRoom((prev) => {
          if (shouldAcceptStateUpdate(prev, serverState)) {
            return serverState;
          }
          return prev;
        });
        broadcastRoomState(serverState);
      }
    } catch {
      // ignore
    }

    // 2. Update local state and broadcast
    setRoom((prev) => {
      if (!prev || prev.status !== 'in_round' || !prev.currentQuestion || prev.currentQuestion.id !== questionId) {
        return prev;
      }

      const q = multiplayerQuestionsPool.find((item) => item.id === questionId);
      const isCorrect = q ? q.correctOptionId === optionId : false;
      const isHostPlayer = prev.host.id === playerIdRef.current;

      const updatedHost = { ...prev.host };
      const updatedGuest = prev.guest ? { ...prev.guest } : null;
      const activePlayer = isHostPlayer ? updatedHost : updatedGuest;

      const updatedAnswered = Array.from(new Set([...(prev.answeredPlayerIds || []), playerIdRef.current]));

      // Determine points: 100 if first correct, 60 if second correct
      let pointsAwarded = 0;
      let isFirstCorrect = false;
      if (isCorrect) {
        // Check existing round answer records from prior submissions in round
        const existingAnswers = (prev.lastRoundResult?.playerAnswers || {}) as Record<string, { isCorrect?: boolean }>;
        const otherAlreadyCorrect = Object.values(existingAnswers).some((ans) => Boolean(ans?.isCorrect));
        if (!otherAlreadyCorrect) {
          isFirstCorrect = true;
          pointsAwarded = 100;
        } else {
          pointsAwarded = 60;
        }
        if (activePlayer) {
          activePlayer.score += pointsAwarded;
          activePlayer.correctCount += 1;
        }
      }

      const existingPlayerAnswers = prev.lastRoundResult?.playerAnswers || {};
      const newPlayerAnswers = {
        ...existingPlayerAnswers,
        [playerIdRef.current]: {
          optionId,
          isCorrect,
          pointsAwarded,
          responseTimeMs: prev.roundStartTime ? Math.max(100, Date.now() - prev.roundStartTime) : 1000,
        },
      };

      // Both players active check
      const expectedPlayersCount = prev.guest && prev.guest.isConnected ? 2 : 1;
      const bothPicked = updatedAnswered.length >= expectedPlayersCount;

      let winnerPlayerId = prev.lastRoundResult?.winnerPlayerId || null;
      let winnerPlayerName = prev.lastRoundResult?.winnerPlayerName || null;
      if (isCorrect && !winnerPlayerId) {
        winnerPlayerId = playerIdRef.current;
        winnerPlayerName = activePlayer?.name || 'Player';
      }

      const summary: RoundResultSummary = {
        questionId,
        roundNumber: prev.currentRound,
        title: q?.title || 'Cyber Challenge',
        situation: q?.situation || prev.currentQuestion.situation,
        correctOptionId: q?.correctOptionId || optionId,
        correctOptionText: q?.options.find((o) => o.id === (q?.correctOptionId || optionId))?.text || '',
        winnerPlayerId,
        winnerPlayerName,
        secondPlayerId: null,
        secondPlayerName: null,
        whySafe: q?.whySafe || 'Great job making the secure choice!',
        playerAnswers: newPlayerAnswers,
      };

      // If both picked, lock round now! Otherwise stay in_round until second picks or timer expires.
      if (bothPicked) {
        const lockedState: RoomStateClient = {
          ...prev,
          status: 'round_locked',
          host: updatedHost,
          guest: updatedGuest,
          answeredPlayerIds: updatedAnswered,
          lastRoundResult: summary,
          roundHistory: [...prev.roundHistory, summary],
          updatedAt: Date.now(),
        };
        broadcastRoomState(lockedState);
        return lockedState;
      } else {
        const waitingForFriendState: RoomStateClient = {
          ...prev,
          host: updatedHost,
          guest: updatedGuest,
          answeredPlayerIds: updatedAnswered,
          lastRoundResult: summary,
          updatedAt: Date.now(),
        };
        broadcastRoomState(waitingForFriendState);
        return waitingForFriendState;
      }
    });

    setIsSubmitting(false);
  };

  const restartGame = async () => {
    if (!roomCode) return;
    try {
      await multiplayerApi.restartGame(roomCode, playerIdRef.current);
    } catch {
      // ignore
    }
    startGame();
  };

  const leaveRoom = async () => {
    if (roomCode) {
      await multiplayerApi.leaveRoom(roomCode, playerIdRef.current);
    }
    cleanupSubscriptions();
    setRoom(null);
    setRoomCode(null);
    setError(null);
  };

  // Local Game Lifecycle Ticker for offline / serverless / cross-tab play
  useEffect(() => {
    if (!room) return;

    // Retrieve synchronized questions
    let questions = storedQuestionsRef.current;
    if (!questions || questions.length < 8) {
      try {
        const saved = localStorage.getItem(`cybermentor_questions_${room.code}`);
        if (saved) {
          questions = JSON.parse(saved);
          storedQuestionsRef.current = questions;
        }
      } catch {
        // ignore
      }
    }
    if (!questions || questions.length < 8) {
      questions = getEightRandomQuestions();
      storedQuestionsRef.current = questions;
    }

    // 1. Starting countdown -> in_round
    if (room.status === 'starting') {
      const timer = setTimeout(() => {
        setRoom((prev) => {
          if (!prev || prev.status !== 'starting') return prev;
          const firstQ = questions[0];
          const activeState: RoomStateClient = {
            ...prev,
            status: 'in_round',
            currentRound: 1,
            totalRounds: 8,
            currentQuestion: {
              id: firstQ.id,
              roundNumber: 1,
              totalRounds: 8,
              category: firstQ.category,
              difficulty: firstQ.difficulty,
              situation: firstQ.situation,
              prompt: firstQ.prompt,
              options: firstQ.options,
            },
            roundStartTime: Date.now(),
            roundDurationSec: 10,
            timeRemainingMs: 10000,
            answeredPlayerIds: [],
            lastRoundResult: null,
            updatedAt: Date.now(),
          };
          broadcastRoomState(activeState);
          return activeState;
        });
      }, 2500);

      return () => clearTimeout(timer);
    }

    // 2. Active round timer: Decrement timer, and when 10s timer runs out, lock the round!
    if (room.status === 'in_round') {
      const interval = setInterval(() => {
        setRoom((prev) => {
          if (!prev || prev.status !== 'in_round' || !prev.roundStartTime) return prev;
          const elapsed = Date.now() - prev.roundStartTime;
          const remainingMs = Math.max(0, (prev.roundDurationSec || 10) * 1000 - elapsed);

          // If 10s timer expires, lock the round and display results!
          if (remainingMs <= 0) {
            const currentQ = prev.currentQuestion;
            const q = currentQ ? multiplayerQuestionsPool.find((item) => item.id === currentQ.id) : null;
            const existingSummary = prev.lastRoundResult;
            const summary: RoundResultSummary = existingSummary || {
              questionId: currentQ?.id || '',
              roundNumber: prev.currentRound,
              title: q?.title || 'Cyber Challenge',
              situation: currentQ?.situation || '',
              correctOptionId: q?.correctOptionId || '',
              correctOptionText: q?.options.find((o) => o.id === q?.correctOptionId)?.text || 'Safe choice',
              winnerPlayerId: null,
              winnerPlayerName: null,
              secondPlayerId: null,
              secondPlayerName: null,
              whySafe: q?.whySafe || 'Great job thinking about cybersecurity!',
              playerAnswers: {},
            };

            const lockedState: RoomStateClient = {
              ...prev,
              status: 'round_locked',
              timeRemainingMs: 0,
              lastRoundResult: summary,
              roundHistory: prev.roundHistory.some((h) => h.roundNumber === prev.currentRound)
                ? prev.roundHistory
                : [...prev.roundHistory, summary],
              updatedAt: Date.now(),
            };
            broadcastRoomState(lockedState);
            return lockedState;
          }

          // Otherwise update smooth timeRemainingMs
          if (Math.abs(prev.timeRemainingMs - remainingMs) > 100) {
            return {
              ...prev,
              timeRemainingMs: remainingMs,
            };
          }
          return prev;
        });
      }, 200);

      return () => clearInterval(interval);
    }

    // 3. Round locked -> Next round or game_over after 3 seconds of viewing result
    if (room.status === 'round_locked') {
      const timer = setTimeout(() => {
        setRoom((prev) => {
          if (!prev || prev.status !== 'round_locked') return prev;
          if (prev.currentRound < prev.totalRounds) {
            const nextRound = prev.currentRound + 1;
            const nextQ = questions[nextRound - 1] || multiplayerQuestionsPool[nextRound % multiplayerQuestionsPool.length];
            const nextState: RoomStateClient = {
              ...prev,
              status: 'in_round',
              currentRound: nextRound,
              currentQuestion: {
                id: nextQ.id,
                roundNumber: nextRound,
                totalRounds: prev.totalRounds,
                category: nextQ.category,
                difficulty: nextQ.difficulty,
                situation: nextQ.situation,
                prompt: nextQ.prompt,
                options: nextQ.options,
              },
              roundStartTime: Date.now(),
              roundDurationSec: 10,
              timeRemainingMs: 10000,
              answeredPlayerIds: [],
              lastRoundResult: null,
              updatedAt: Date.now(),
            };
            broadcastRoomState(nextState);
            return nextState;
          } else {
            const overState: RoomStateClient = {
              ...prev,
              status: 'game_over',
              lastRoundResult: null,
              updatedAt: Date.now(),
            };
            broadcastRoomState(overState);
            return overState;
          }
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [room?.status, room?.currentRound, room?.code, broadcastRoomState]);

  return {
    room,
    roomCode,
    loading,
    error,
    isHost,
    playerId: playerIdRef.current,
    createRoom,
    joinRoom,
    startGame,
    submitAnswer,
    restartGame,
    leaveRoom,
  };
}
