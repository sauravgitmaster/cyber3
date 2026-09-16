import React, { useState } from 'react';
import { ActivePage, SkillCheckResult } from '../types';
import { initialSkillCheckQuestions } from '../data/mockData';
import { getLearnerLevel } from '../utils/levelSystem';
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Compass,
  Zap,
  CheckCircle2,
  Shield,
  Lock,
} from 'lucide-react';
import { ByteMascot } from '../components/common/ByteMascot';
import confetti from 'canvas-confetti';

interface SkillCheckPageProps {
  onNavigate: (page: ActivePage, params?: { pathId?: string }) => void;
  onCompleteSkillCheck: (result: SkillCheckResult) => void;
  lastResult?: SkillCheckResult;
}

export const SkillCheckPage: React.FC<SkillCheckPageProps> = ({
  onNavigate,
  onCompleteSkillCheck,
  lastResult,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(Boolean(lastResult));
  const [result, setResult] = useState<SkillCheckResult | null>(lastResult || null);

  const questions = initialSkillCheckQuestions;
  const currentQ = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      let totalWeight = 0;
      questions.forEach((q) => {
        const chosenId = selectedAnswers[q.id];
        const opt = q.options.find((o) => o.id === chosenId);
        totalWeight += opt ? opt.trustScoreWeight : 50;
      });

      const calculatedScore = Math.round(totalWeight / questions.length);

      const newResult: SkillCheckResult = {
        completedAt: 'Just now',
        digitalTrustScore: calculatedScore,
        strengths: ['Password Safety', 'Privacy Habits'],
        needsImprovement: ['Scam Spotting', 'Social Engineering'],
        recommendedPathId: 'cyber-safety-fundamentals',
        recommendedPathTitle: 'Cyber Safety Fundamentals',
        categoryScores: {
          'Password Security': 86,
          'Privacy Awareness': 74,
          'Phishing Detection': 62,
          'Social Engineering': 56,
          'Safe Browsing': 78,
        },
      };

      setResult(newResult);
      setIsFinished(true);
      onCompleteSkillCheck(newResult);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsFinished(false);
    setResult(null);
  };

  const levelInfo = result ? getLearnerLevel(result.digitalTrustScore) : null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center text-[#243047] font-sans">
      <div className="w-full max-w-2xl space-y-6">
        {!isFinished ? (
          /* Active 5-Challenge Flow */
          <div className="space-y-6">
            {/* Header & Byte Mascot */}
            <div className="text-center space-y-2">
              <div className="inline-flex justify-center mb-1">
                <ByteMascot mood="happy" size="md" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-black text-[#4F7CFF]">
                <Zap className="w-3.5 h-3.5" />
                <span>QUICK CYBER CHECK</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#243047]">
                Let's see what you already know!
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                5 quick challenges so Byte can find the best missions for you.
              </p>
            </div>

            {/* Friendly Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span className="text-[#4F7CFF]">Challenge {currentIndex + 1} of {questions.length}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-3 bg-slate-200/80 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#4F7CFF] to-[#8B6CFF] transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Situation Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#4F7CFF] border border-blue-100">
                  {currentQ.category}
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  Challenge #{currentIndex + 1}
                </span>
              </div>

              {/* Realistic situation box */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 text-sm sm:text-base text-[#243047] leading-relaxed font-semibold">
                "{currentQ.scenario}"
              </div>

              <p className="text-xs font-bold text-slate-600">
                What's the safe choice to make?
              </p>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedAnswers[currentQ.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full text-left p-4 rounded-2xl border-2 text-xs sm:text-sm transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-blue-50 border-[#4F7CFF] text-[#243047] font-bold shadow-2xs scale-[1.01]'
                          : 'bg-white border-slate-200 hover:border-blue-200 hover:bg-slate-50 text-slate-700 font-medium'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'border-[#4F7CFF] bg-[#4F7CFF] text-white'
                            : 'border-slate-300 text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="flex-1 leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  onClick={handleNext}
                  disabled={!selectedAnswers[currentQ.id]}
                  className="px-6 py-2.5 rounded-xl bg-[#4F7CFF] hover:bg-[#3D6CE6] disabled:opacity-40 text-white font-black text-xs transition-all flex items-center gap-2 shadow-sm"
                >
                  <span>
                    {currentIndex === questions.length - 1
                      ? 'Finish & See Profile'
                      : 'Next Challenge'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Profile Created Results Screen */
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <ByteMascot mood="proud" size="lg" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-black text-emerald-600">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CHECK COMPLETE</span>
              </div>
              <h1 className="text-3xl font-black text-[#243047]">
                🎉 Nice work!
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Here is your personalized Cyber Profile. Byte has selected your first mission!
              </p>
            </div>

            {/* Profile Overview Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                    Your Cyber Profile
                  </span>
                  <h3 className="text-lg font-black text-[#243047]">
                    Level: {levelInfo?.levelBadge || '⚡ Cyber Scout'}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 block">
                    Cyber Smart Score
                  </span>
                  <div className="text-3xl font-black text-[#4F7CFF]">
                    {result?.digitalTrustScore || 72} ⭐
                  </div>
                </div>
              </div>

              {/* Strengths & Practice Focus */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-800 text-xs font-black">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>🔐 Strong at:</span>
                  </div>
                  <p className="text-xs text-emerald-950 font-bold">
                    {result?.strengths[0] || 'Password Safety'}
                  </p>
                  <span className="text-[11px] text-emerald-800 font-medium">
                    You made great instincts protecting your credentials!
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-800 text-xs font-black">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>🎣 Practice more:</span>
                  </div>
                  <p className="text-xs text-amber-950 font-bold">
                    {result?.needsImprovement[0] || 'Scam Spotting'}
                  </p>
                  <span className="text-[11px] text-amber-800 font-medium">
                    Byte will find fun missions to help you spot sneaky tricks!
                  </span>
                </div>
              </div>

              {/* Byte Callout */}
              <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-center gap-3 text-left">
                <span className="text-2xl shrink-0">🤖</span>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  <strong className="text-[#243047]">Byte says:</strong> "I picked your first adaptive mission based on your check results! Let's get started!"
                </p>
              </div>

              {/* Primary CTA: Start Today's Mission */}
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full py-4 rounded-2xl bg-[#4F7CFF] hover:bg-[#3D6CE6] text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
              >
                <span>Let's Go to Today's Mission 🚀</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-1 text-center">
                <button
                  onClick={handleRetake}
                  className="text-xs text-slate-400 hover:text-slate-600 font-semibold transition-colors"
                >
                  Retake Quick Check
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
