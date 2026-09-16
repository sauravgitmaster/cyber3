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
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 text-[#243047] dark:text-slate-100 font-sans transition-colors duration-200">
      {/* TODAY'S MISSION CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-blue-200/90 dark:border-blue-900/60 p-6 sm:p-7 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-xs font-black uppercase tracking-wider">
              🎯 TODAY’S MISSION
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
              Chosen especially for you
            </span>
          </div>

          <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>~{mission.estimatedMinutes || 3} min</span>
          </span>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-black text-[#243047] dark:text-slate-100">
            {mission.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            {mission.context}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
            Reward: +60 XP & up to +8 ⭐
          </span>

          <button
            onClick={() =>
              onNavigate('interactive-scenario', { scenarioId: mission.id })
            }
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#4F7CFF] hover:bg-[#3D6CE6] text-white font-black text-xs sm:text-sm transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Target className="w-4 h-4" />
            <span>START MISSION</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* REWARDS & PROGRESS ROW */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {/* Cyber Smart Score */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Smart Score
            </span>
            <Shield className="w-4 h-4 text-[#4F7CFF]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#243047] dark:text-slate-100 flex items-baseline gap-1">
            <span>{user.digitalTrustScore}</span>
            <span className="text-amber-500 text-lg">⭐</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">
            {user.digitalTrustScore >= 75 ? 'Sharp instincts!' : 'Building habits!'}
          </p>
        </div>

        {/* Streak */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Daily Streak
            </span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#243047] dark:text-slate-100">
            {user.streakDays}{' '}
            <span className="text-xs text-slate-400 font-medium">days</span>
          </div>
          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-0.5">
            Keep it burning!
          </p>
        </div>

        {/* Badges / Next Trophy */}
        <div
          onClick={() => onNavigate('badges')}
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Next Badge
            </span>
            <Trophy className="w-4 h-4 text-[#8B6CFF]" />
          </div>
          <div className="text-base sm:text-lg font-black text-[#243047] dark:text-slate-100 truncate">
            {user.completedModulesCount >= 2 ? 'Master Detective' : 'Rookie Scout'}
          </div>
          <p className="text-[10px] text-purple-600 dark:text-purple-400 font-bold mt-0.5 group-hover:underline">
            View Trophies →
          </p>
        </div>
      </div>

      {/* BYTE SAYS (ONE SHORT TIP) */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50/70 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-3xl border border-blue-200 dark:border-blue-900/60 p-5 shadow-2xs flex items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3.5">
          <ByteMascot mood="thinking" size="md" />
          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-[11px] font-black text-[#4F7CFF] dark:text-blue-400 uppercase tracking-wider">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Byte says...</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              "{mentorInsight?.observation ||
                'Scammers often try to make you act in a hurry. When in doubt, take a deep breath and verify with a trusted adult or check the real app directly!'}"
            </p>
          </div>
        </div>

        <button
          onClick={onOpenMentor}
          className="shrink-0 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-blue-200 dark:border-slate-700 text-xs font-bold text-[#4F7CFF] dark:text-blue-400 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Ask Byte</span>
        </button>
      </div>

      {/* 5. LARGE SECONDARY ACTION: PLAY WITH A FRIEND */}
      <div className="bg-gradient-to-r from-[#243047] to-[#1a2333] text-white rounded-3xl p-6 sm:p-7 shadow-md flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-white flex items-center justify-center text-3xl shrink-0">
            👥
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-[11px] font-black text-blue-300 uppercase tracking-wider">
              <span>MULTIPLAYER MODE</span>
            </div>
            <h3 className="text-xl font-black text-white">
              Play With a Friend
            </h3>
            <p className="text-xs text-slate-300 font-medium max-w-md">
              Race side-by-side to spot online tricks in 8 quick rounds. Can you find the safe answer fastest?
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('multiplayer')}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#4F7CFF] hover:bg-[#3D6CE6] text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 shrink-0"
        >
          <Users className="w-4 h-4" />
          <span>PLAY WITH A FRIEND</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
