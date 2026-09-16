import React from 'react';
import { ActivePage, UserProfile, LearningPath, MentorInsight, ScenarioItem } from '../types';
import { ByteMascot } from '../components/common/ByteMascot';
import {
  ArrowRight,
  Flame,
  Zap,
  Trophy,
  Target,
  Sparkles,
  Clock,
  ChevronRight,
  Lightbulb,
  Shield,
  Users,
} from 'lucide-react';

interface DashboardPageProps {
  user: UserProfile;
  onNavigate: (page: ActivePage, params?: { pathId?: string; moduleId?: string; scenarioId?: string }) => void;
  paths: LearningPath[];
  mentorInsight: MentorInsight;
  onOpenMentor: () => void;
  currentMission?: ScenarioItem;
  missionsCompletedCount: number;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  onNavigate,
  paths,
  mentorInsight,
  onOpenMentor,
  currentMission,
  missionsCompletedCount,
}) => {
  // Active mission fallback
  const mission = currentMission || {
    id: 'mission-free-robux',
    title: 'The Free Robux Giveaway Link',
    category: 'Scam & Phishing',
    difficulty: 'Beginner' as const,
    scaffoldLevel: 1 as const,
    estimatedMinutes: 3,
    context: 'A direct message arrives from GamerPrize99 claiming you won 10,000 free Robux.',
    simulatedArtifact: { body: '' },
    prompt: '',
    options: [],
    tags: [],
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200">
      {/* TODAY'S MISSION CARD */}
      <div className="bg-white dark:bg-[#080808] rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-7 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-800 text-[10px] font-mono uppercase tracking-wider">
              Today's Mission
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Chosen especially for you
            </span>
          </div>

          <span className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400 dark:text-zinc-500">
            <Clock className="w-3.5 h-3.5" />
            <span>~{mission.estimatedMinutes || 3} min</span>
          </span>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-semibold -tracking-[0.03em] text-zinc-900 dark:text-zinc-100">
            {mission.title}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {mission.context}
          </p>
        </div>

        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-100 dark:border-zinc-850">
          <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
            Reward: +60 XP & up to +8 pts
          </span>

          <button
            onClick={() =>
              onNavigate('interactive-scenario', { scenarioId: mission.id })
            }
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-medium text-xs sm:text-sm transition-all shadow-2xs active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Target className="w-4 h-4" />
            <span>Start Mission</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* REWARDS & PROGRESS ROW */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {/* Cyber Smart Score */}
        <div className="bg-white dark:bg-[#080808] p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Smart Score
            </span>
            <Shield className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-semibold -tracking-[0.03em] text-zinc-900 dark:text-zinc-100 flex items-baseline gap-1">
            <span>{user.digitalTrustScore}</span>
            <span className="text-xs font-mono text-zinc-400 font-normal">pts</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            {user.digitalTrustScore >= 75 ? 'Sharp instincts' : 'Building habits'}
          </p>
        </div>

        {/* Streak */}
        <div className="bg-white dark:bg-[#080808] p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Daily Streak
            </span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-semibold -tracking-[0.03em] text-zinc-900 dark:text-zinc-100">
            {user.streakDays}{' '}
            <span className="text-xs font-mono text-zinc-400 font-normal">days</span>
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5">
            Keep it burning
          </p>
        </div>

        {/* Badges / Next Trophy */}
        <div
          onClick={() => onNavigate('badges')}
          className="bg-white dark:bg-[#080808] p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Next Badge
            </span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-sm sm:text-base font-semibold -tracking-[0.02em] text-zinc-900 dark:text-zinc-100 truncate">
            {user.completedModulesCount >= 2 ? 'Master Detective' : 'Rookie Scout'}
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
            View Trophies →
          </p>
        </div>
      </div>

      {/* BYTE SAYS (ONE SHORT TIP) */}
      <div className="bg-zinc-50/80 dark:bg-zinc-950/80 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-2xs flex items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3.5">
          <ByteMascot mood="thinking" size="md" />
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Byte says</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              "{mentorInsight?.observation ||
                'Scammers often try to make you act in a hurry. When in doubt, take a deep breath and verify with a trusted adult or check the real app directly!'}"
            </p>
          </div>
        </div>

        <button
          onClick={onOpenMentor}
          className="shrink-0 px-3.5 py-1.5 rounded-full bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-900 dark:text-zinc-100 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Ask Byte</span>
        </button>
      </div>

      {/* 5. LARGE SECONDARY ACTION: PLAY WITH A FRIEND */}
      <div className="bg-zinc-900 dark:bg-zinc-950 text-white rounded-3xl border border-zinc-800 p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              <span>Multiplayer Duel</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold -tracking-[0.02em] text-white">
              Play With a Friend
            </h3>
            <p className="text-xs text-zinc-400 max-w-md">
              Race side-by-side to spot online tricks in 8 quick rounds. Can you find the safe answer fastest?
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('multiplayer')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white text-zinc-950 hover:bg-zinc-200 font-medium text-xs sm:text-sm shadow-xs transition-all active:scale-98 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Users className="w-4 h-4" />
          <span>Play With a Friend</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
