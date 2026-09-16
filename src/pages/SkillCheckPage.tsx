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
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200">
      <div className="w-full max-w-2xl space-y-6">
        {!isFinished ? (
          /* Active 5-Challenge Flow */
          <div className="space-y-6">
            {/* Header & Byte Mascot */}
            <div className="text-center space-y-2">
              <div className="inline-flex justify-center mb-1">
                <ByteMascot mood="happy" size="md" animate={false} />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                <Zap className="w-3.5 h-3.5" />
                <span>Quick Cyber Check</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold -tracking-[0.03em] text-zinc-900 dark:text-zinc-100">
                Let's see what you already know
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                5 quick challenges so Byte can find the best missions for you.
              </p>
            </div>

            {/* Friendly Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>Challenge {currentIndex + 1} of {questions.length}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-900 dark:bg-white transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Situation Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-850 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                  {currentQ.category}
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  #{currentIndex + 1}
                </span>
              </div>

              {/* Realistic situation box */}
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm sm:text-base text-zinc-900 dark:text-zinc-100 leading-relaxed font-medium">
                "{currentQ.scenario}"
              </div>

              <p className="text-xs font-mono uppercase tracking-wider text-zinc-500">
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
                      className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all flex items-start gap-3.5 cursor-pointer ${
                        isSelected
                          ? 'bg-zinc-100 dark:bg-zinc-850 border-zinc-900 dark:border-white text-zinc-950 dark:text-white font-medium shadow-2xs'
                          : 'bg-white dark:bg-[#080808] border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'border-zinc-900 dark:border-white bg-zinc-900 dark:bg-white text-white dark:text-zinc-950'
                            : 'border-zinc-300 dark:border-zinc-700 text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      <span className="flex-1 leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-850">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-850 disabled:opacity-30 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  onClick={handleNext}
                  disabled={!selectedAnswers[currentQ.id]}
                  className="px-6 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 disabled:opacity-40 text-white dark:text-zinc-950 font-mono text-xs transition-all flex items-center gap-2 shadow-2xs cursor-pointer"
                >
                  <span>
                    {currentIndex === questions.length - 1
                      ? 'Finish & See Profile'
                      : 'Next Challenge'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Profile Created Results Screen */
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <ByteMascot mood="proud" size="lg" animate={false} />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Check Complete</span>
              </div>
              <h1 className="text-3xl font-semibold -tracking-[0.03em] text-zinc-900 dark:text-zinc-100">
                Nice work!
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                Here is your personalized Cyber Profile. Byte has selected your first mission!
              </p>
            </div>

            {/* Profile Overview Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-850 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                    Your Cyber Profile
                  </span>
                  <h3 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Level: {levelInfo?.levelBadge || 'Cyber Scout'}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-zinc-400 block uppercase">
                    Cyber Smart Score
                  </span>
                  <div className="text-2xl sm:text-3xl font-semibold font-mono text-zinc-900 dark:text-zinc-100">
                    {result?.digitalTrustScore || 72} <span className="text-xs font-normal text-zinc-400">pts</span>
                  </div>
                </div>
              </div>

              {/* Strengths & Practice Focus */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Strong at:</span>
                  </div>
                  <p className="text-xs text-zinc-900 dark:text-zinc-100 font-mono font-medium">
                    {result?.strengths[0] || 'Password Safety'}
                  </p>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    You have great instincts protecting your credentials!
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 text-xs font-semibold">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Practice more:</span>
                  </div>
                  <p className="text-xs text-zinc-900 dark:text-zinc-100 font-mono font-medium">
                    {result?.needsImprovement[0] || 'Scam Spotting'}
                  </p>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Byte will find fun missions to help you spot sneaky tricks!
                  </span>
                </div>
              </div>

              {/* Byte Callout */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3 text-left">
                <ByteMascot mood="talking" size="xs" animate={false} />
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  <strong className="text-zinc-900 dark:text-zinc-100 font-mono text-[11px]">Byte says:</strong> "I picked your first adaptive mission based on your check results! Let's get started!"
                </p>
              </div>

              {/* Primary CTA: Start Today's Mission */}
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-mono text-xs flex items-center justify-center gap-2 transition-all shadow-2xs active:scale-98 cursor-pointer"
              >
                <span>Let's Go to Today's Mission</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="pt-1 text-center">
                <button
                  onClick={handleRetake}
                  className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 font-mono transition-colors cursor-pointer"
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
