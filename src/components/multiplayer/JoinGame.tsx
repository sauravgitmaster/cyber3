import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, AlertCircle, Sparkles, ClipboardPaste } from 'lucide-react';
import { ByteMascot } from '../common/ByteMascot';
import { RoomStateClient } from '../../types/multiplayer';

interface JoinGameProps {
  room: RoomStateClient | null;
  loading: boolean;
  error: string | null;
  initialCode?: string;
  onJoin: (code: string) => void;
  onBack: () => void;
}

export const JoinGame: React.FC<JoinGameProps> = ({
  room,
  loading,
  error,
  initialCode,
  onJoin,
  onBack,
}) => {
  const [code, setCode] = useState<string>(() => {
    if (initialCode) return initialCode.trim().toUpperCase();
    try {
      const params = new URLSearchParams(window.location.search);
      const urlCode = params.get('join') || params.get('code');
      if (urlCode) return urlCode.trim().toUpperCase();
      return (localStorage.getItem('cybermentor_recent_room_code') || '').trim().toUpperCase();
    } catch {
      return '';
    }
  });

  const recentSavedCode = typeof window !== 'undefined'
    ? localStorage.getItem('cybermentor_recent_room_code')
    : null;

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode.trim().toUpperCase());
    }
  }, [initialCode]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        let extracted = text.trim();
        if (extracted.includes('join=')) {
          const match = extracted.match(/join=([A-Za-z0-9]{4,8})/);
          if (match) extracted = match[1];
        }
        setCode(extracted.toUpperCase().slice(0, 8));
      }
    } catch {
      // clipboard permission denied
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    if (clean.length >= 4) {
      onJoin(clean);
    }
  };

  const isJoined = Boolean(room && room.guest);

  return (
    <div className="max-w-md mx-auto p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-sm text-center space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
          Join Game
        </span>
        <div className="w-9" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex justify-center mb-1">
          <ByteMascot mood="happy" size="md" />
        </div>
        <h2 className="text-2xl font-black text-[#243047]">Enter Game Code</h2>
        <p className="text-xs text-slate-500 font-medium">
          Ask your friend for their 6-letter room code!
        </p>
      </div>

      {!isJoined ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <input
              type="text"
              maxLength={8}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. 7KQ4M2"
              className="w-full text-center text-3xl sm:text-4xl font-mono font-black tracking-widest py-4 px-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-[#243047] placeholder:text-slate-300 focus:outline-none focus:border-[#4F7CFF] focus:bg-white transition-all uppercase"
              autoFocus
            />

            {/* Quick helper controls: Paste from clipboard or use recent code */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={handlePaste}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <ClipboardPaste className="w-3.5 h-3.5 text-[#4F7CFF]" />
                <span>Paste Code</span>
              </button>

              {recentSavedCode && recentSavedCode !== code && (
                <button
                  type="button"
                  onClick={() => setCode(recentSavedCode.toUpperCase())}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#4F7CFF] text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Use Recent: {recentSavedCode}</span>
                </button>
              )}
            </div>

            {code && (
              <div className="text-[11px] font-bold text-emerald-600">
                ✨ Ready to join with code: {code}
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={code.trim().length < 4 || loading}
            className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
              code.trim().length >= 4 && !loading
                ? 'bg-[#4F7CFF] hover:bg-[#3D6CE6] text-white shadow-md active:scale-98'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>{loading ? 'Finding Game...' : 'Join Game'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        /* Joined and Waiting for Host to Start */
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            🎉 Connected to {room?.host.name}’s game!
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-2.5">
              <span className="text-2xl">{room?.host.avatar || '🤖'}</span>
              <div className="text-left overflow-hidden">
                <span className="text-xs font-black text-[#243047] truncate block">
                  {room?.host.name}
                </span>
                <span className="text-[10px] font-bold text-slate-400">Host</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-emerald-300 shadow-2xs flex items-center gap-2.5">
              <span className="text-2xl">{room?.guest?.avatar || '🦊'}</span>
              <div className="text-left overflow-hidden">
                <span className="text-xs font-black text-[#243047] truncate block">
                  {room?.guest?.name || 'You'}
                </span>
                <span className="text-[10px] font-bold text-emerald-600">You (Ready!)</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center gap-2 text-xs font-black text-slate-600">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Waiting for {room?.host.name} to start the game...</span>
          </div>
        </div>
      )}
    </div>
  );
};
