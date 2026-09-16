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
  Search,
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200">
      {/* Celebration / Encouragement Hero Card */}
      <div className="rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#080808] shadow-xs relative overflow-hidden transition-all">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <ByteMascot mood={isOptimal ? 'excited' : (isPartial ? 'cheering' : 'thinking')} size="lg" animate={false} />

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
              {isOptimal ? (
                <span>Mission Accomplished</span>
              ) : isPartial ? (
                <span>Nice Instincts</span>
              ) : (
                <span>Learning Opportunity</span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold -tracking-[0.03em] text-zinc-900 dark:text-zinc-100">
              {isOptimal
                ? 'Great catch! You spotted the trick.'
                : isPartial
                ? "Nice thinking! You're almost there."
                : 'Not quite! But mistakes help us learn.'}
            </h1>

            <p className="text-sm sm:text-base font-serif-editorial italic text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {feedback.summary}
            </p>

            {/* Score & XP Rewards Banner */}
            <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <div className="px-3.5 py-1.5 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-900 dark:text-zinc-100 shadow-2xs flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-zinc-500" />
                <span>Smart Score:</span>
                <span className="font-semibold text-amber-500">
                  +{scoreReward} pts
                </span>
                {!isOptimal && !isPartial && (
                  <span className="text-zinc-400 font-normal text-[11px] ml-1">
                    (No score drop)
                  </span>
                )}
              </div>

              <div className="px-3.5 py-1.5 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-900 dark:text-zinc-100 shadow-2xs flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>+{scoreImpacts.xpDelta || 30} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Breakdown Section */}
      <div className="bg-white dark:bg-[#080808] rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Your Chosen Action Card */}
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
            Your Decision
          </span>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            "{option.text}"
          </p>
        </div>

        {/* Section: Here's what gave it away */}
        <div className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold -tracking-[0.02em] text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Search className="w-4 h-4 text-zinc-500" />
            <span>Here's what gave it away</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <strong className="text-zinc-900 dark:text-zinc-100 font-mono block text-xs uppercase tracking-wide">
                Why this mattered
              </strong>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-xs font-sans">
                {feedback.whyItMatters}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <strong className="text-zinc-900 dark:text-zinc-100 font-mono block text-xs uppercase tracking-wide">
                What to do next time
              </strong>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-xs font-sans">
                {feedback.nextStepRecommendation || feedback.whatYouDidWell}
              </p>
            </div>
          </div>
        </div>

        {/* Live AI Coaching Card from Gemini Server */}
        {aiCoaching && (
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Byte's Live Cyber Coaching</span>
            </div>
            <p className="text-xs sm:text-sm font-serif-editorial italic text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {aiCoaching.coaching}
            </p>
            {aiCoaching.detectiveTip && (
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 font-mono flex items-center gap-1.5">
                <span>Clue:</span>
                <span>{aiCoaching.detectiveTip}</span>
              </div>
            )}
          </div>
        )}

        {/* Section: Byte's Golden Rule */}
        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Byte's Golden Takeaway</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {scenario.educationalTakeaway ||
              'Scammers love to create urgency or offer free rewards. Whenever a message asks you to act fast or give away passwords, pause and verify with an official source!'}
          </p>
        </div>

        {/* Expandable Technical Details for curious students */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-850">
          <button
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Want to see deeper cybersecurity clues?</span>
            {showTechnicalDetails ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showTechnicalDetails && (
            <div className="mt-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs space-y-3 font-mono animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-[11px] text-zinc-500">
                <span className="font-mono flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                  Mission Telemetry
                </span>
                <span>Category: {scenario.category}</span>
              </div>
              <p className="font-sans text-xs text-zinc-600 dark:text-zinc-400 leading-normal">
                {feedback.watchOutFor}
              </p>
              {scenario.threatActor && (
                <div className="p-3 rounded-xl bg-zinc-900 dark:bg-black text-zinc-200 border border-zinc-800 text-[11px] leading-relaxed">
                  <div>Simulated Threat: {scenario.threatActor}</div>
                  <div>Difficulty Scaffold: Level {scenario.scaffoldLevel} of 5</div>
                  <div>Environment: {scenario.environmentType}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Row */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-mono text-xs transition-colors cursor-pointer"
          >
            Return to Home
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onOpenMentor}
              className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-xs border border-zinc-200 dark:border-zinc-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ByteMascot mood="thinking" size="xs" animate={false} />
              <span>Ask Byte</span>
            </button>

            <button
              onClick={handleNextMission}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-medium text-xs shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Next Mission</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
