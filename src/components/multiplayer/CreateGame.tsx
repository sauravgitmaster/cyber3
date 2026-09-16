import React, { useState } from 'react';
import { Copy, Check, Users, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { ByteMascot } from '../common/ByteMascot';
import { RoomStateClient } from '../../types/multiplayer';

interface CreateGameProps {
  room: RoomStateClient | null;
  roomCode?: string;
  loading: boolean;
  onStartGame: () => void;
  onBack: () => void;
}

export const CreateGame: React.FC<CreateGameProps> = ({
  room,
  roomCode,
  loading,
  onStartGame,
  onBack,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Automatically show the code from room, roomCode prop, or localStorage
  const code =
    room?.code ||
    roomCode ||
    (typeof window !== 'undefined'
      ? localStorage.getItem('cybermentor_recent_room_code') || ''
      : '');

  const handleCopyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    if (!code) return;
    const url = `${window.location.origin}?join=${code}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const isGuestConnected = Boolean(room?.guest && room.guest.isConnected !== false);

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
          Create Game
        </span>
        <div className="w-9" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex justify-center mb-1">
          <ByteMascot mood="happy" size="md" />
        </div>
        <h2 className="text-2xl font-black text-[#243047]">Your Game Code</h2>
        <p className="text-xs text-slate-500 font-medium">
          Share this code with your friend so they can join!
        </p>
      </div>

      {/* Big Display of Code */}
      <div className="p-5 rounded-2xl bg-gradient-to-tr from-blue-50 to-indigo-50 border-2 border-blue-200 space-y-3">
        <div className="text-4xl sm:text-5xl font-mono font-black text-[#243047] tracking-widest selection:bg-blue-200">
          {code || (loading ? 'CREATING...' : '••••••')}
        </div>

        <div className="flex items-center justify-center gap-2 pt-1">
          <button
            onClick={handleCopyCode}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-blue-300 text-[#243047] font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs"
          >
            {copiedCode ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600">Copied Code!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#4F7CFF]" />
                <span>Copy Code</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyLink}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-blue-300 text-[#243047] font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600">Copied Link!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Copy Invite Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Players in Room */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="text-xs font-bold text-slate-500 text-left">Players in Room</div>
        <div className="grid grid-cols-2 gap-3">
          {/* Host */}
          <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-2.5">
            <span className="text-2xl">{room?.host.avatar || ''}</span>
            <div className="text-left overflow-hidden">
              <span className="text-xs font-black text-[#243047] truncate block">
                {room?.host.name || 'You'}
              </span>
              <span className="text-[10px] font-bold text-emerald-600">Host (Ready)</span>
            </div>
          </div>

          {/* Guest */}
          <div
            className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
              isGuestConnected
                ? 'bg-white border-emerald-300 shadow-2xs'
                : 'bg-slate-100/70 border-dashed border-slate-300'
            }`}
          >
            {isGuestConnected ? (
              <>
                <span className="text-2xl">{room?.guest?.avatar || ''}</span>
                <div className="text-left overflow-hidden">
                  <span className="text-xs font-black text-[#243047] truncate block">
                    {room?.guest?.name || 'Friend'}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600">Joined!</span>
                </div>
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse flex items-center justify-center text-slate-400">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-400 block">Waiting...</span>
                  <span className="text-[10px] text-slate-400">Friend</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Byte Status Guidance */}
      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-3 text-left">
        <ByteMascot mood="happy" size="xs" animate={false} />
        <span>
          {isGuestConnected
            ? `Your friend ${room?.guest?.name} is in! Hit Start Game when ready!`
            : "Your friend hasn't joined yet. Send them the code!"}
        </span>
      </div>

      {/* Primary CTA */}
      <button
        onClick={onStartGame}
        disabled={!isGuestConnected || loading}
        className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
          isGuestConnected && !loading
            ? 'bg-[#4F7CFF] hover:bg-[#3D6CE6] text-white shadow-md active:scale-98'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        <span>Start Game</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
