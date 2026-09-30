import React, { useEffect } from 'react';
import { RoomStateClient } from '../../types/multiplayer';
import { Trophy, RefreshCw, Home, BookOpen, Zap, Sparkles, CheckCircle2 } from 'lucide-react';
import { ByteMascot } from '../common/ByteMascot';
import confetti from 'canvas-confetti';

interface MultiplayerResultsProps {
  room: RoomStateClient;
  currentUserId: string;
  onPlayAgain: () => void;
  onBackHome: () => void;
  onReviewAnswers: () => void;
}

export const MultiplayerResults: React.FC<MultiplayerResultsProps> = ({
  room,
  currentUserId,
  onPlayAgain,
  onBackHome,
  onReviewAnswers,
}) => {
  const isHost = room.host.id === currentUserId;
  const me = isHost ? room.host : room.guest;
  const friend = isHost ? room.guest : room.host;

  const myScore = me?.score || 0;
  const friendScore = friend?.score || 0;

  const myFastest = me?.fastestResponseMs
    ? `${(me.fastestResponseMs / 1000).toFixed(1)}s`
    : 'Quick';

  useEffect(() => {
    // Gentle celebration confetti
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  // Positive Byte messages only! No shaming!
  const getByteTakeaway = () => {
    if (myScore >= 500 && friendScore >= 500) {
      return "You both were lightning-fast at spotting online tricks! That's true cyber teamwork!";
    }
    if (myScore > friendScore) {
      return `Awesome job spotting tricky messages! And ${friend?.name || 'your friend'} had some great saves too!`;
    }
    return `Super close game! You spotted ${me?.correctCount || 0} tricky situations and built sharp cyber reflexes!`;
  };

  return (
    <div className="max-w-lg mx-auto p-6 sm:p-8 bg-white dark:bg-[#080808] rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm text-center space-y-6 text-zinc-900 dark:text-zinc-100">
      {/* Trophy & Mascot */}
      <div className="space-y-2">
        <div className="inline-flex justify-center mb-1">
          <ByteMascot mood="proud" size="lg" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs font-black text-amber-600 dark:text-amber-400">
          <Trophy className="w-3.5 h-3.5" />
          <span>GAME COMPLETE!</span>
        </div>
        <h2 className="text-3xl font-black text-[#243047] dark:text-zinc-100">Great Game!</h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
          You both exercised your digital reflexes together.
        </p>
      </div>

      {/* Score Comparison Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* You */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-2 border-blue-200 dark:border-blue-900/60 text-center space-y-1">
          <span className="text-3xl block">{me?.avatar || ''}</span>
          <span className="text-xs font-black text-[#243047] dark:text-zinc-100 block truncate">
            {me?.name || 'You'} (You)
          </span>
          <div className="text-2xl font-black text-[#4F7CFF] dark:text-blue-400">{myScore} pts</div>
          <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400">
            {me?.correctCount || 0} of {room.totalRounds} correct
          </span>
        </div>

        {/* Friend */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border-2 border-amber-200 dark:border-amber-900/60 text-center space-y-1">
          <span className="text-3xl block">{friend?.avatar || ''}</span>
          <span className="text-xs font-black text-[#243047] dark:text-zinc-100 block truncate">
            {friend?.name || 'Friend'}
          </span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{friendScore} pts</div>
          <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400">
            {friend?.correctCount || 0} of {room.totalRounds} correct
          </span>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 grid grid-cols-2 gap-3 text-left">
        <div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase block">
            Fastest Catch
          </span>
          <span className="text-xs font-black text-[#243047] dark:text-zinc-100 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>{myFastest}</span>
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase block">
            Topics Faced
          </span>
          <span className="text-xs font-black text-[#243047] dark:text-zinc-100 truncate block">
            Phishing, Passwords, Privacy
          </span>
        </div>
      </div>

      {/* Byte's Encouraging Takeaway */}
      <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 text-left flex items-start gap-3">
        <ByteMascot mood="happy" size="xs" animate={false} />
        <div className="space-y-0.5">
          <span className="text-xs font-black text-[#243047] dark:text-zinc-100 block">Byte’s Takeaway</span>
          <p className="text-xs text-slate-600 dark:text-zinc-300 font-medium leading-relaxed">
            {getByteTakeaway()}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-1">
        <button
          onClick={onPlayAgain}
          className="w-full py-3.5 rounded-2xl bg-[#4F7CFF] hover:bg-[#3D6CE6] text-white font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-98 shadow-md cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Play Again</span>
        </button>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onReviewAnswers}
            className="py-3 px-4 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#4F7CFF]" />
            <span>Review Answers</span>
          </button>

          <button
            onClick={onBackHome}
            className="py-3 px-4 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 text-slate-500" />
            <span>Back Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
