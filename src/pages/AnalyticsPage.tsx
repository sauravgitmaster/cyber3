import React from 'react';
import { ActivePage, SkillCategoryScore, UserProfile } from '../types';
import { TrustScoreGauge } from '../components/common/TrustScoreGauge';
import {
  BarChart3,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { ByteMascot } from '../components/common/ByteMascot';

interface AnalyticsPageProps {
  user: UserProfile;
  skills: SkillCategoryScore[];
  onNavigate: (page: ActivePage, params?: { pathId?: string; moduleId?: string }) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  user,
  skills,
  onNavigate,
}) => {
  const timelineData = [
    { period: 'Week 1', score: 58, label: 'First Check' },
    { period: 'Week 2', score: 62, label: 'Password Mission' },
    { period: 'Week 3', score: 66, label: 'Privacy Mission' },
    { period: 'Week 4', score: 68, label: '2FA Mission' },
    { period: 'Current', score: user.digitalTrustScore, label: '+6 This Week!' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            <BarChart3 className="w-3.5 h-3.5 text-zinc-400" />
            <span>Growth & Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold -tracking-[0.03em] text-zinc-900 dark:text-zinc-100">
            Progress & Skill Growth
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            See how your cyber smarts grow with every completed adventure and mission.
          </p>
        </div>

        <div className="px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300">
          {user.scenariosCompletedCount} missions completed so far
        </div>
      </div>

      {/* Top Cards: Cyber Smart Score + Strengths + Focus Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Score */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 dark:text-zinc-500 block">
              Overall Rating
            </span>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Cyber Smart Score</h3>
            <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
              +{user.trustScoreDelta} this week
            </span>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Top tier in your Cyber Club</p>
          </div>
          <TrustScoreGauge score={user.digitalTrustScore} delta={user.trustScoreDelta} size="sm" showLabel={false} />
        </div>

        {/* Card 2: Strongest Skill */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Top Strength
            </span>
            <span className="text-xs font-mono text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded-full">
              86% Mastered
            </span>
          </div>
          <div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
              <span>Password Security</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Unbreakable passphrases, never sharing passwords, and enabling 2FA!
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-500">Pro Defender Tier</span>
        </div>

        {/* Card 3: Next Skill to Level Up */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Focus Area
            </span>
            <span className="text-xs font-mono text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded-full">
              54% Progress
            </span>
          </div>
          <div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Social Engineering</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Practice spotting tricky callers, fake prize messages, and imposters.
            </p>
          </div>
          <button
            onClick={() =>
              onNavigate('learning-paths', {
                pathId: 'cyber-safety-fundamentals',
                moduleId: 'mod-soc-eng-basics',
              })
            }
            className="text-xs font-mono text-zinc-900 dark:text-zinc-100 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Play Social Engineering Mission</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Skill Categories Breakdown */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div>
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
              Skill Radar
            </span>
            <h2 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100">Cyber Skills Mastery</h2>
          </div>
          <span className="text-xs font-mono text-zinc-500">Goal: 80%+ on all skills</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill) => {
            const isStrength = skill.score >= 80;
            const isDeveloping = skill.score < 65;

            return (
              <div
                key={skill.id}
                className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400 font-mono">+{skill.change}%</span>
                    <span
                      className="font-mono text-xs px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold"
                    >
                      {skill.score}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-zinc-900 dark:bg-white"
                    style={{ width: `${skill.score}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="truncate pr-2">{skill.description}</span>
                  <span className="font-mono text-zinc-700 dark:text-zinc-300 shrink-0 text-[11px]">{skill.level}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Over Time Cards */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
              Weekly Tracker
            </span>
            <h2 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100">Score Timeline</h2>
          </div>
          <span className="text-xs font-mono text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800">
            Total Gain: +14 Points
          </span>
        </div>

        {/* Timeline visualization */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {timelineData.map((item, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl border text-center flex flex-col justify-between space-y-2 transition-all ${
                i === timelineData.length - 1
                  ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-600 shadow-2xs'
                  : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <span className="text-[10px] font-mono text-zinc-400 uppercase">
                {item.period}
              </span>
              <div className="text-2xl font-semibold font-mono text-zinc-900 dark:text-zinc-100">
                {item.score}
              </div>
              <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono truncate">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
