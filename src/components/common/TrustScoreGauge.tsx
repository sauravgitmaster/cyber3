import React, { useState } from 'react';
import { Shield, Sparkles, HelpCircle, ChevronDown, ChevronUp, Star } from 'lucide-react';

interface TrustScoreGaugeProps {
  score: number;
  delta?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showWhyDetail?: boolean;
  categoryBreakdown?: { name: string; score: number; icon?: string }[];
}

export const TrustScoreGauge: React.FC<TrustScoreGaugeProps> = ({
  score,
  delta,
  size = 'md',
  showLabel = true,
  showWhyDetail = false,
  categoryBreakdown = [
    { name: 'Passwords', score: 86, icon: '🔐' },
    { name: 'Scam Spotting', score: 74, icon: '🎣' },
    { name: 'Privacy', score: 68, icon: '👀' },
    { name: 'Smart Sharing', score: 78, icon: '📱' },
    { name: 'Safe Browsing', score: 82, icon: '🌐' },
  ],
}) => {
  const [isWhyOpen, setIsWhyOpen] = useState(false);

  // Friendly status tier & encouraging copy
  let statusBadge = { label: 'Getting Better', color: 'bg-blue-100 text-blue-700 border-blue-200' };
  let encouragement = 'You’re learning how to be super smart online!';
  let barColor = 'bg-[#4F7CFF]';

  if (score === 0) {
    statusBadge = { label: 'Ready to Start', color: 'bg-slate-100 text-slate-700 border-slate-200' };
    encouragement = 'Take a starter mission to earn your first Cyber Smart stars!';
    barColor = 'bg-slate-300';
  } else if (score >= 85) {
    statusBadge = { label: 'Cyber Hero 🌟', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    encouragement = 'Incredible job! You have champion cyber instincts.';
    barColor = 'bg-[#40C98A]';
  } else if (score >= 70) {
    statusBadge = { label: 'Doing Great ⭐', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    encouragement = 'You’re getting really good at spotting online tricks!';
    barColor = 'bg-[#4F7CFF]';
  } else if (score >= 50) {
    statusBadge = { label: 'Getting Better 🌱', color: 'bg-purple-100 text-purple-700 border-purple-200' };
    encouragement = 'Keep exploring missions to build your cyber superpower!';
    barColor = 'bg-[#8B6CFF]';
  } else {
    statusBadge = { label: 'Just Starting 🚀', color: 'bg-amber-100 text-amber-700 border-amber-200' };
    encouragement = 'Every mission you try helps you become safer online!';
    barColor = 'bg-[#FFC857]';
  }

  // Compact variant for inline navbar / small cards
  if (size === 'sm') {
    return (
      <div className="flex items-center gap-2 font-sans">
        <div className="flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-[#4F7CFF]" />
          <span className="text-xs font-bold text-[#243047]">{score}</span>
          <span className="text-[11px] text-amber-500">⭐</span>
        </div>
        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${Math.max(6, Math.min(100, score))}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full select-none text-[#243047] font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-[#4F7CFF]" />
          <span className="text-xs font-bold tracking-wide text-slate-700 uppercase">
            Cyber Smart Score
          </span>
        </div>

        {showWhyDetail && (
          <button
            type="button"
            onClick={() => setIsWhyOpen(!isWhyOpen)}
            className="inline-flex items-center gap-1 text-xs font-medium text-[#4F7CFF] hover:text-[#3B65E0] transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How it works</span>
            {isWhyOpen ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Primary Score & Status */}
      <div className="mt-2.5 flex items-baseline justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl sm:text-4xl font-black tracking-tight text-[#243047]">
            {score}
          </span>
          <span className="text-lg font-bold text-amber-500">⭐</span>
          <span className="text-xs font-medium text-slate-600">/ 100</span>

          {delta !== undefined && delta !== 0 && (
            <span
              className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${
                delta > 0
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-100 text-amber-700 border border-amber-200'
              }`}
            >
              {delta > 0 ? `+${delta}` : delta} this week
            </span>
          )}
        </div>

        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusBadge.color}`}
        >
          {statusBadge.label}
        </span>
      </div>

      <p className="text-xs text-slate-600 mt-1 font-medium">
        {encouragement}
      </p>

      {/* Main Score Bar */}
      <div className="mt-3">
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${Math.max(4, Math.min(100, score))}%` }}
          />
        </div>
      </div>

      {/* Category Breakdown preview */}
      {categoryBreakdown && categoryBreakdown.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
            Skills You’re Building
          </span>
          <div className="space-y-1.5">
            {categoryBreakdown.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                  <span>{cat.icon || '🛡️'}</span>
                  <span>{cat.name}</span>
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-20 sm:w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#4F7CFF] rounded-full"
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 w-7 text-right">
                    {cat.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Why Explanation Dialog/Dropdown */}
      {isWhyOpen && (
        <div className="mt-3 p-3.5 rounded-xl bg-blue-50/80 border border-blue-100 text-xs text-slate-700 space-y-1.5 animate-in fade-in duration-150">
          <div className="font-bold text-[#4F7CFF] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>How your Cyber Smart Score grows:</span>
          </div>
          <p className="leading-relaxed">
            Your score increases as you complete <strong>Cyber Missions</strong>, spot tricky messages, and make smart safety choices.
            There is never any penalty for learning — making mistakes helps you discover what to look out for next time!
          </p>
        </div>
      )}
    </div>
  );
};
