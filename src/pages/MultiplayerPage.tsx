import React, { useState, useEffect } from 'react';
import { ActivePage, UserProfile } from '../types';
import { useMultiplayerRoom } from '../hooks/useMultiplayerRoom';
import { CreateGame } from '../components/multiplayer/CreateGame';
import { JoinGame } from '../components/multiplayer/JoinGame';
import { MultiplayerScoreBar } from '../components/multiplayer/MultiplayerScoreBar';
import { MultiplayerQuestion } from '../components/multiplayer/MultiplayerQuestion';
import { MultiplayerResults } from '../components/multiplayer/MultiplayerResults';
import { MultiplayerReview } from '../components/multiplayer/MultiplayerReview';
import { ByteMascot } from '../components/common/ByteMascot';
import { Users, PlusCircle, LogIn, ArrowLeft, Sparkles, Shield, Gamepad2 } from 'lucide-react';

interface MultiplayerPageProps {
  onNavigate: (page: ActivePage) => void;
  user: UserProfile;
}

type LobbyView = 'menu' | 'create' | 'join';

export const MultiplayerPage: React.FC<MultiplayerPageProps> = ({
  onNavigate,
  user,
}) => {
  const [lobbyView, setLobbyView] = useState<LobbyView>('menu');
  const [isReviewing, setIsReviewing] = useState(false);
  const [prefilledCode, setPrefilledCode] = useState<string>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlCode = params.get('join') || params.get('code');
      if (urlCode) return urlCode.trim().toUpperCase();
      return (localStorage.getItem('cybermentor_recent_room_code') || '').trim().toUpperCase();
    } catch {
      return '';
    }
  });

  const {
    room,
    roomCode,
    loading,
    error,
    isHost,
    playerId,
    createRoom,
    joinRoom,
    startGame,
    submitAnswer,
    restartGame,
    leaveRoom,
  } = useMultiplayerRoom({
    id: user.studentId || user.email,
    name: user.name,
    avatar: user.avatar,
  });

  // Check URL params for invite link e.g. ?join=7KQ4M2
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const joinCode = params.get('join') || params.get('code');
    if (joinCode) {
      const upper = joinCode.trim().toUpperCase();
      setPrefilledCode(upper);
      if (!room) {
        setLobbyView('join');
      }
    }
  }, [room]);

  // Automatically ensure a room code is generated when entering create view
  useEffect(() => {
    if (lobbyView === 'create' && !room && !loading) {
      createRoom();
    }
  }, [lobbyView, room, loading, createRoom]);

  const handleCreateGame = async () => {
    try {
      setLobbyView('create');
      if (!room) {
        await createRoom();
      }
    } catch {
      // handled in hook
    }
  };

  const handleJoinGame = async (code: string) => {
    try {
      await joinRoom(code);
    } catch {
      // handled in hook
    }
  };

  const handleBackToMenu = () => {
    leaveRoom();
    setLobbyView('menu');
    setIsReviewing(false);
  };

  const isGameActive =
    room &&
    (room.status === 'starting' ||
      room.status === 'in_round' ||
      room.status === 'round_locked');

  const isGameOver = room && room.status === 'game_over';

  // 1. Review Answers View
  if (isGameOver && isReviewing) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] py-8 px-4 font-sans text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
        <MultiplayerReview
          history={room.roundHistory}
          onBack={() => setIsReviewing(false)}
        />
      </div>
    );
  }

  // 2. Final Results View
  if (isGameOver) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] py-8 px-4 font-sans text-zinc-900 dark:text-zinc-100 flex flex-col justify-center items-center transition-colors duration-200">
        <MultiplayerResults
          room={room}
          currentUserId={playerId}
          onPlayAgain={restartGame}
          onBackHome={() => {
            leaveRoom();
            onNavigate('dashboard');
          }}
          onReviewAnswers={() => setIsReviewing(true)}
        />
      </div>
    );
  }

  // 3. Active Game View (Question + Score Bar)
  if (isGameActive) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] py-6 sm:py-8 px-4 font-sans text-zinc-900 dark:text-zinc-100 flex flex-col justify-between items-center transition-colors duration-200">
        {/* Top Score Bar */}
        <MultiplayerScoreBar room={room} currentUserId={playerId} />

        {/* Starting Countdown Overlay */}
        {room.status === 'starting' ? (
          <div className="my-auto text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <ByteMascot mood="happy" size="lg" animate={false} />
            <div className="text-3xl sm:text-4xl font-semibold -tracking-[0.03em] text-zinc-900 dark:text-zinc-100">
              Get ready!
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Race your friend to spot the safe choice!
            </p>
          </div>
        ) : (
          /* Active Question */
          <div className="w-full my-auto py-4">
            <MultiplayerQuestion
              room={room}
              currentUserId={playerId}
              onSelectOption={submitAnswer}
            />
          </div>
        )}

        {/* Footer Leave */}
        <div className="pt-4 text-center">
          <button
            onClick={handleBackToMenu}
            className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 font-mono transition-colors cursor-pointer"
          >
            Leave Game
          </button>
        </div>
      </div>
    );
  }

  // 4. Create Room Waiting Lobby View
  if (lobbyView === 'create') {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] py-8 px-4 font-sans text-zinc-900 dark:text-zinc-100 flex flex-col justify-center items-center transition-colors duration-200">
        <CreateGame
          room={room}
          roomCode={roomCode || room?.code || undefined}
          loading={loading}
          onStartGame={startGame}
          onBack={handleBackToMenu}
        />
      </div>
    );
  }

  // 5. Join Room Form View
  if (lobbyView === 'join') {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] py-8 px-4 font-sans text-zinc-900 dark:text-zinc-100 flex flex-col justify-center items-center transition-colors duration-200">
        <JoinGame
          room={room}
          loading={loading}
          error={error}
          initialCode={prefilledCode}
          onJoin={handleJoinGame}
          onBack={handleBackToMenu}
        />
      </div>
    );
  }

  // 6. Main Play Lobby Menu
  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center font-sans text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <div className="w-full max-w-xl space-y-6">
        {/* Back navigation */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        {/* Hero Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex justify-center mb-1">
            <ByteMascot mood="happy" size="lg" animate={false} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            <Users className="w-3.5 h-3.5" />
            <span>Multiplayer Lobby</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold -tracking-[0.03em] text-zinc-900 dark:text-zinc-100">
            Race your friend to spot the trick
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            Answer 8 fast cyber challenges side-by-side in real-time. Who can identify the safe action first?
          </p>
        </div>

        {/* Auto-detected room code banner if present */}
        {prefilledCode && (
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <Gamepad2 className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
              <div className="text-left">
                <div className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                  Detected Game Code
                </div>
                <div className="text-base font-semibold font-mono text-zinc-900 dark:text-zinc-100">
                  {prefilledCode}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setLobbyView('join');
                handleJoinGame(prefilledCode);
              }}
              className="px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-mono text-xs shadow-2xs transition-all cursor-pointer"
            >
              Join Now
            </button>
          </div>
        )}

        {/* Game Mode Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Create a Game */}
          <div
            onClick={handleCreateGame}
            className="p-6 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 shadow-xs transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center">
                <PlusCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Create a Game</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Get a 6-letter room code and invite your friend to challenge you.
              </p>
            </div>

            <button className="w-full py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-mono text-xs shadow-2xs transition-colors cursor-pointer">
              Create Game
            </button>
          </div>

          {/* Join a Game */}
          <div
            onClick={() => setLobbyView('join')}
            className="p-6 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 shadow-xs transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center">
                <LogIn className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Join a Game</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Have a code from a friend? Enter it here and jump straight into the match.
              </p>
            </div>

            <button className="w-full py-2.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-mono text-xs shadow-2xs transition-colors cursor-pointer">
              Enter Code
            </button>
          </div>
        </div>

        {/* Byte Tip */}
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-3">
          <ByteMascot mood="thinking" size="xs" animate={false} />
          <span>
            <strong className="text-zinc-900 dark:text-zinc-100 font-mono text-[11px]">Byte says:</strong> Remember, correct and fastest wins the most XP, but wrong answers never take points away! Have fun!
          </span>
        </div>
      </div>
    </div>
  );
};
