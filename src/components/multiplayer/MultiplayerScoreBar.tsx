import React from 'react';
import { RoomStateClient } from '../../types/multiplayer';
import { WifiOff, AlertTriangle } from 'lucide-react';

interface MultiplayerScoreBarProps {
  room: RoomStateClient;
  currentUserId: string;
}

export const MultiplayerScoreBar: React.FC<MultiplayerScoreBarProps> = ({
  room,
  currentUserId,
}) => {
  const isHost = room.host.id === currentUserId;
  const me = isHost ? room.host : room.guest;
  const friend = isHost ? room.guest : room.host;

  const totalSec = room.roundDurationSec || 10;
  const remainingSec = Math.max(0, Math.ceil(room.timeRemainingMs / 1000));
  const progressRatio = Math.max(0, Math.min(1, room.timeRemainingMs / (totalSec * 1000)));

  const friendDisconnected = friend && !friend.isConnected;

  return (
    <div className="w-full max-w-xl mx-auto space-y-2">
      {/* Disconnect Alert if friend drops */}
      {friendDisconnected && (
        <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-center gap-2 animate-pulse">
          <WifiOff className="w-4 h-4 text-amber-600" />
          <span>Waiting for {friend?.name || 'friend'} to reconnect…</span>
        </div>
      )}

      <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-3">
        {/* You */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-2xl shrink-0">{me?.avatar || '🤖'}</span>
          <div className="truncate">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-[#243047] block truncate">
                {me?.name || 'You'} (You)
              </span>
              {room.status === 'in_round' && (
                me && room.answeredPlayerIds?.includes(me.id) ? (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700">
                    Picked ✓
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
                    Choosing…
                  </span>
                )
              )}
            </div>
            <span className="text-xs font-black text-[#4F7CFF]">{me?.score || 0} ⭐</span>
          </div>
        </div>

        {/* Center: Round & 10s Timer */}
        <div className="flex flex-col items-center shrink-0">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Round {room.currentRound} of {room.totalRounds}
          </div>

          {/* 10s Countdown Timer */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  remainingSec <= 3
                    ? 'bg-rose-500'
                    : remainingSec <= 5
                    ? 'bg-amber-500'
                    : 'bg-gradient-to-r from-blue-400 to-indigo-500'
                }`}
                style={{ width: `${progressRatio * 100}%` }}
              />
            </div>
            <span
              className={`text-xs font-mono font-black w-5 text-right ${
                remainingSec <= 3
                  ? 'text-rose-600 animate-pulse'
                  : 'text-slate-700'
              }`}
            >
              {remainingSec}s
            </span>
          </div>
        </div>

        {/* Friend */}
        <div className="flex items-center gap-2 text-right min-w-0 justify-end">
          <div className="truncate">
            <div className="flex items-center justify-end gap-1.5">
              {room.status === 'in_round' && (
                friend && room.answeredPlayerIds?.includes(friend.id) ? (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700">
                    Picked ✓
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
                    Choosing…
                  </span>
                )
              )}
              <span className="text-xs font-black text-[#243047] block truncate">
                {friend?.name || 'Friend'}
              </span>
            </div>
            <span className="text-xs font-black text-amber-500">{friend?.score || 0} ⭐</span>
          </div>
          <span className="text-2xl shrink-0">{friend?.avatar || '🦊'}</span>
        </div>
      </div>
    </div>
  );
};
