import React from 'react';
import { RoundResultSummary } from '../../types/multiplayer';
import { ArrowLeft, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';
import { ByteMascot } from '../common/ByteMascot';

interface MultiplayerReviewProps {
  history: RoundResultSummary[];
  onBack: () => void;
}

export const MultiplayerReview: React.FC<MultiplayerReviewProps> = ({
  history,
  onBack,
}) => {
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Results</span>
        </button>

        <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
          Game Review
        </span>
      </div>

      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-[#243047]">Review Your Answers</h2>
        <p className="text-xs text-slate-500 font-medium">
          Here is why each safe choice kept you and your friend secure!
        </p>
      </div>

      {/* List of Questions */}
      <div className="space-y-4">
        {history.map((round, idx) => (
          <div
            key={round.questionId || idx}
            className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-[#4F7CFF] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Round {round.roundNumber || idx + 1}
              </span>
              <span className="font-bold text-slate-400">{round.title}</span>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-[#243047]">
              {round.situation}
            </p>

            <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-emerald-900 block">Safe Choice:</span>
                <span className="text-emerald-800 font-medium">{round.correctOptionText}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-[#243047] block">Byte’s Lesson:</span>
                <span className="text-slate-600 font-medium leading-relaxed">
                  {round.whySafe}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 text-center">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-2xl bg-[#4F7CFF] hover:bg-[#3D6CE6] text-white font-black text-xs shadow-sm transition-all"
        >
          Done Reviewing
        </button>
      </div>
    </div>
  );
};
