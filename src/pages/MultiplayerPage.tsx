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
import { Users, PlusCircle, LogIn, ArrowLeft, Sparkles, Shield } from 'lucide-react';

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
      <div className="min-h-screen bg-[#F7F9FC] py-8 px-4 font-sans text-[#243047]">
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
      <div className="min-h-screen bg-[#F7F9FC] py-8 px-4 font-sans text-[#243047] flex flex-col justify-center items-center">
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
      <div className="min-h-screen bg-[#F7F9FC] py-6 sm:py-8 px-4 font-sans text-[#243047] flex flex-col justify-between items-center">
        {/* Top Score Bar */}
        <MultiplayerScoreBar room={room} currentUserId={playerId} />

        {/* Starting Countdown Overlay */}
        {room.status === 'starting' ? (
          <div className="my-auto text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <ByteMascot mood="happy" size="lg" />
            <div className="text-3xl sm:text-4xl font-black text-[#243047]">
              Get ready! 🚀
            </div>
            <p className="text-sm font-semibold text-[#4F7CFF]">
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
            className="text-xs text-slate-400 hover:text-slate-600 font-bold transition-colors"
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
      <div className="min-h-screen bg-[#F7F9FC] py-8 px-4 font-sans text-[#243047] flex flex-col justify-center items-center">
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
      <div className="min-h-screen bg-[#F7F9FC] py-8 px-4 font-sans text-[#243047] flex flex-col justify-center items-center">
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
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center font-sans text-[#243047]">
      <div className="w-full max-w-xl space-y-6">
        {/* Back navigation */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#4F7CFF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Hero Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex justify-center mb-1">
            <ByteMascot mood="happy" size="lg" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-black text-[#4F7CFF]">
            <Users className="w-3.5 h-3.5" />
            <span>PLAY WITH A FRIEND</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#243047]">
            Race your friend to spot the trick!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
            Answer 8 fast cyber challenges side-by-side in real-time. Who can identify the safe action first?
          </p>
        </div>

        {/* Auto-detected room code banner if present */}
        {prefilledCode && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-[#4F7CFF]/30 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎮</span>
              <div className="text-left">
                <div className="text-[10px] font-black uppercase text-[#4F7CFF] tracking-wider">
                  Detected Game Code
                </div>
                <div className="text-base font-black font-mono text-[#243047]">
                  {prefilledCode}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setLobbyView('join');
                handleJoinGame(prefilledCode);
              }}
              className="px-4 py-2 rounded-xl bg-[#4F7CFF] hover:bg-[#3D6CE6] text-white font-black text-xs shadow-sm transition-all"
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
            className="p-6 rounded-3xl bg-white border-2 border-slate-200 hover:border-[#4F7CFF] shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#4F7CFF] flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlusCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#243047]">Create a Game</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Get a 6-letter room code and invite your friend to challenge you.
              </p>
            </div>

            <button className="w-full py-2.5 rounded-xl bg-[#4F7CFF] text-white font-black text-xs shadow-2xs group-hover:bg-[#3D6CE6] transition-colors">
              Create Game
            </button>
          </div>

          {/* Join a Game */}
          <div
            onClick={() => setLobbyView('join')}
            className="p-6 rounded-3xl bg-white border-2 border-slate-200 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <LogIn className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#243047]">Join a Game</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Have a code from a friend? Enter it here and jump straight into the match.
              </p>
            </div>

            <button className="w-full py-2.5 rounded-xl bg-white border-2 border-emerald-400 text-emerald-700 font-black text-xs hover:bg-emerald-50 transition-colors">
              Enter Code
            </button>
          </div>
        </div>

        {/* Byte Tip */}
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 font-medium flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <span>
            <strong className="text-[#243047]">Byte says:</strong> Remember, correct and fastest wins the most XP, but wrong answers never take points away! Have fun!
          </span>
        </div>
      </div>
    </div>
  );
};
