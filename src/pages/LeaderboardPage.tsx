import React, { useState } from 'react';
import { ActivePage, LeaderboardUser, UserProfile } from '../types';
import { initialLeaderboard } from '../data/mockData';
import {
  Trophy,
  Medal,
  Award,
  Star,
  Shield,
  Zap,
} from 'lucide-react';
import { ByteMascot } from '../components/common/ByteMascot';

interface LeaderboardPageProps {
  user: UserProfile;
  onNavigate: (page: ActivePage) => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  user,
  onNavigate,
}) => {
  const [filterScope, setFilterScope] = useState<'campus' | 'department' | 'class'>('department');
  const [sortBy, setSortBy] = useState<'trustScore' | 'xp'>('trustScore');

  const entries: LeaderboardUser[] = initialLeaderboard.map((entry) => {
    if (entry.isCurrentUser) {
      return {
        ...entry,
        name: `${user.name} (You)`,
        trustScore: user.digitalTrustScore,
        xp: user.currentXP,
      };
    }
    return entry;
  });

  const sortedEntries = [...entries].sort((a, b) => {
    if (sortBy === 'trustScore') return b.trustScore - a.trustScore;
    return b.xp - a.xp;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-zinc-400" />
            <span>Class & Friends Standings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold -tracking-[0.03em] text-zinc-900 dark:text-zinc-100">
            Cyber Champions
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            See how your cyber smarts stack up with friends and classmates!
          </p>
        </div>

        {/* User Standing Quick Pill */}
        <div className="px-4 py-2 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
          <ByteMascot mood="happy" size="xs" animate={false} />
          <div className="text-xs font-mono">
            <span className="text-zinc-400">Your Rank:</span>{' '}
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold">#4 in Cyber Club</span>
          </div>
        </div>
      </div>

      {/* Filter and Scope Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Scope Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setFilterScope('campus')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
              filterScope === 'campus'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            All Students
          </button>
          <button
            onClick={() => setFilterScope('department')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
              filterScope === 'department'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            Grade 7-8
          </button>
          <button
            onClick={() => setFilterScope('class')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
              filterScope === 'class'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            My Cyber Club
          </button>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <span>Sort by:</span>
          <button
            onClick={() => setSortBy('trustScore')}
            className={`px-3 py-1 rounded-full border transition-colors cursor-pointer ${
              sortBy === 'trustScore'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 border-zinc-900 dark:border-zinc-100 font-semibold'
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            Smart Score
          </button>
          <button
            onClick={() => setSortBy('xp')}
            className={`px-3 py-1 rounded-full border transition-colors cursor-pointer ${
              sortBy === 'xp'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 border-zinc-900 dark:border-zinc-100 font-semibold'
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            Total XP
          </button>
        </div>
      </div>

      {/* Leaderboard Table Card */}
      <div className="rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Rank</th>
                <th className="py-3.5 px-5">Student</th>
                <th className="py-3.5 px-5">Club / Class</th>
                <th className="py-3.5 px-5 text-right">Smart Score</th>
                <th className="py-3.5 px-5 text-right">XP</th>
                <th className="py-3.5 px-5 text-right">Level</th>
                <th className="py-3.5 px-5 text-center">Badges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {sortedEntries.map((student, idx) => {
                const rank = idx + 1;
                const isUser = student.isCurrentUser;

                return (
                  <tr
                    key={student.studentIdMasked || idx}
                    className={`transition-colors ${
                      isUser
                        ? 'bg-zinc-100/80 dark:bg-zinc-900/80 font-medium'
                        : 'hover:bg-zinc-50/60 dark:hover:bg-zinc-900/40'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-5 font-mono">
                      {rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-mono text-[11px] shadow-2xs">
                          1
                        </span>
                      ) : rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono text-[11px]">
                          2
                        </span>
                      ) : rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[11px]">
                          3
                        </span>
                      ) : (
                        <span className="text-zinc-400 pl-2">#{rank}</span>
                      )}
                    </td>

                    {/* Student Name */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-semibold ${
                            isUser
                              ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                          }`}
                        >
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <span
                            className={`font-medium ${
                              isUser ? 'text-zinc-900 dark:text-zinc-100 font-semibold' : 'text-zinc-800 dark:text-zinc-200'
                            }`}
                          >
                            {student.name}
                          </span>
                          {isUser && (
                            <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                              You
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Cohort */}
                    <td className="py-3.5 px-5 text-zinc-500 dark:text-zinc-400 font-normal">
                      {student.cohort}
                    </td>

                    {/* Digital Trust Score */}
                    <td className="py-3.5 px-5 text-right font-mono">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {student.trustScore}
                      </span>
                      <span className="text-zinc-400">/100</span>
                    </td>

                    {/* Total XP */}
                    <td className="py-3.5 px-5 text-right font-mono text-zinc-700 dark:text-zinc-300">
                      {student.xp.toLocaleString()} XP
                    </td>

                    {/* Level */}
                    <td className="py-3.5 px-5 text-right font-mono text-zinc-500 dark:text-zinc-400">
                      Lv. {student.level}
                    </td>

                    {/* Badges count */}
                    <td className="py-3.5 px-5 text-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-xs">
                        {student.badgeCount} badges
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
