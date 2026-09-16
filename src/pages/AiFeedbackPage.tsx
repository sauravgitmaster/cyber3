import React, { useState } from 'react';
import { ActivePage, ScenarioItem, ScenarioOption } from '../types';
import { allMissions } from '../data/missionsData';
import {
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  HelpCircle,
  Shield,
  ChevronDown,
  ChevronUp,
  Terminal,
} from 'lucide-react';
import { ByteMascot } from '../components/common/ByteMascot';

interface AiFeedbackPageProps {
  decisionData: {
    scenario: ScenarioItem;
    option: ScenarioOption;
    previousScore: number;
    newScore: number;
    hintsUsed?: number;
  } | null;
  onNavigate: (page: ActivePage, params?: { scenarioId?: string }) => void;
  onRequestNextMission?: () => void;
  onOpenMentor: () => void;
}

export const AiFeedbackPage: React.FC<AiFeedbackPageProps> = ({
  decisionData,
  onNavigate,
  onRequestNextMission,
  onOpenMentor,
}) => {
  const scenario = decisionData?.scenario || allMissions[0];
  const option = decisionData?.option || scenario.options[1];
  const previousScore = decisionData?.previousScore ?? 74;
  const newScore = decisionData?.newScore ?? (option.isOptimal ? 82 : 74);

  const { feedback, scoreImpacts } = option;
  const isOptimal = option.isOptimal;
  const isPartial = !isOptimal && (feedback.decisionQuality === 'Fair' || option.riskLevel === 'Moderate');

  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [aiCoaching, setAiCoaching] = useState<{ coaching: string; detectiveTip: string } | null>(null);

  // Fetch live AI coaching from backend
  React.useEffect(() => {
    let isMounted = true;
    fetch('/api/scenario/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        missionTitle: scenario.title,
        userChoice: option.text,
        isOptimal,
        scenarioContext: scenario.description,
      }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.coaching) {
          setAiCoaching(data);
        }
      })
      .catch(() => {
        // silent fallback
      });
    return () => {
      isMounted = false;
    };
  }, [scenario.title, option.text, isOptimal, scenario.description]);

  // Score reward text
  const scoreReward = isOptimal ? 8 : (isPartial ? 2 : 0);

  const handleNextMission = () => {
    if (onRequestNextMission) {
      onRequestNextMission();
    }
    onNavigate('interactive-scenario');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto text-[#243047] font-sans">
      {/* Celebration / Encouragement Hero Card */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border-2 shadow-sm relative overflow-hidden transition-all ${
          isOptimal
            ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-emerald-300'
            : isPartial
            ? 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-300'
            : 'bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border-amber-300'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <ByteMascot mood={isOptimal ? 'excited' : (isPartial ? 'cheering' : 'thinking')} size="lg" />

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/80 border border-slate-200">
              {isOptimal ? (
                <span className="text-emerald-700">🎯 MISSION ACCOMPLISHED</span>
              ) : isPartial ? (
                <span className="text-blue-700">👍 NICE THINKING</span>
              ) : (
                <span className="text-amber-800">💡 LEARNING OPPORTUNITY</span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#243047]">
              {isOptimal
                ? '🎉 Great catch! You spotted the trick.'
                : isPartial
                ? "👍 Nice thinking! You're almost there."
                : '💡 Not quite! But mistakes help us learn.'}
            </h1>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
              {feedback.summary}
            </p>

            {/* Score & XP Rewards Banner */}
            <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <div className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-[#243047] shadow-2xs flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#4F7CFF]" />
                <span>Cyber Smart Score:</span>
                <span className="text-emerald-700 font-black">
                  +{scoreReward} ⭐
                </span>
                {!isOptimal && !isPartial && (
                  <span className="text-slate-500 font-normal text-[11px] ml-1">
                    (No score drop!)
                  </span>
                )}
              </div>

              <div className="px-3.5 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-xs font-bold text-purple-800 shadow-2xs flex items-center gap-1.5">
                <Zap className="w-4 h-4 fill-purple-600 text-purple-600" />
                <span>+{scoreImpacts.xpDelta || 30} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Breakdown Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Your Chosen Action Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
            YOUR DECISION
          </span>
          <p className="text-sm font-bold text-[#243047]">
            "{option.text}"
          </p>
        </div>

        {/* Section: Here's what gave it away */}
        <div className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-[#243047] flex items-center gap-2">
            <span>🔍</span>
            <span>Here's what gave it away...</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1">
              <strong className="text-blue-900 font-bold block text-xs uppercase tracking-wide">
                Why this mattered
              </strong>
              <p className="text-slate-700 leading-relaxed text-xs">
                {feedback.whyItMatters}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
              <strong className="text-emerald-900 font-bold block text-xs uppercase tracking-wide">
                What to do next time
              </strong>
              <p className="text-slate-700 leading-relaxed text-xs">
                {feedback.nextStepRecommendation || feedback.whatYouDidWell}
              </p>
            </div>
          </div>
        </div>

        {/* Live AI Coaching Card from Gemini Server */}
        {aiCoaching && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 text-xs font-black text-blue-900 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#4F7CFF]" />
              <span>BYTE'S LIVE CYBER COACHING</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              {aiCoaching.coaching}
            </p>
            {aiCoaching.detectiveTip && (
              <div className="pt-2 border-t border-blue-200/60 text-xs text-blue-950 font-bold flex items-center gap-1.5">
                <span>🕵️ Clue:</span>
                <span>{aiCoaching.detectiveTip}</span>
              </div>
            )}
          </div>
        )}

        {/* Section: Byte's Golden Rule */}
        <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-black text-amber-900 uppercase tracking-wider">
            <span>🌟</span>
            <span>BYTE’S GOLDEN TAKEAWAY</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
            {scenario.educationalTakeaway ||
              'Scammers love to create urgency or offer free rewards. Whenever a message asks you to act fast or give away passwords, pause and verify with an official source!'}
          </p>
        </div>

        {/* Expandable Technical Details for curious students */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#4F7CFF] hover:text-[#3862D9] transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Want to see deeper cybersecurity clues?</span>
            {showTechnicalDetails ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showTechnicalDetails && (
            <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3 font-mono animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#4F7CFF]" />
                  MISSION TELEMETRY
                </span>
                <span>Category: {scenario.category}</span>
              </div>
              <p className="font-sans text-xs text-slate-700 leading-normal">
                {feedback.watchOutFor}
              </p>
              {scenario.threatActor && (
                <div className="p-3 rounded-xl bg-[#0a0f1d] text-slate-200 text-[11px] leading-relaxed">
                  <div>Simulated Threat: {scenario.threatActor}</div>
                  <div>Difficulty Scaffold: Level {scenario.scaffoldLevel} of 5</div>
                  <div>Environment: {scenario.environmentType}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Row */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors"
          >
            Return to Home
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onOpenMentor}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#4F7CFF] font-bold text-xs border border-blue-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <ByteMascot mood="thinking" size="xs" />
              <span>Ask Byte</span>
            </button>

            <button
              onClick={handleNextMission}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#4F7CFF] hover:bg-[#3D6CE6] text-white font-bold text-xs shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <span>Next Mission 🚀</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
