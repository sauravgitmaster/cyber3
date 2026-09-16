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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto text-[#243047] font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-black text-[#FFC857] uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-amber-800">CLASS & FRIENDS STANDINGS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#243047]">
            Cyber Champions
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            See how your cyber smarts stack up with friends and classmates!
          </p>
        </div>

        {/* User Standing Quick Pill */}
        <div className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-center gap-3">
          <ByteMascot mood="happy" size="xs" />
          <div className="text-xs font-bold">
            <span className="text-slate-500">Your Rank:</span>{' '}
            <span className="text-[#4F7CFF] font-black">#4 in Cyber Club</span>
          </div>
        </div>
      </div>

      {/* Filter and Scope Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Scope Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <button
            onClick={() => setFilterScope('campus')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterScope === 'campus'
                ? 'bg-[#4F7CFF] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Students
          </button>
          <button
            onClick={() => setFilterScope('department')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterScope === 'department'
                ? 'bg-[#4F7CFF] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Grade 7-8
          </button>
          <button
            onClick={() => setFilterScope('class')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterScope === 'class'
                ? 'bg-[#4F7CFF] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Cyber Club
          </button>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <span>Sort by:</span>
          <button
            onClick={() => setSortBy('trustScore')}
            className={`px-3 py-1 rounded-xl border transition-colors ${
              sortBy === 'trustScore'
                ? 'bg-blue-50 border-[#4F7CFF] text-[#4F7CFF]'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            Smart Score ⭐
          </button>
          <button
            onClick={() => setSortBy('xp')}
            className={`px-3 py-1 rounded-xl border transition-colors ${
              sortBy === 'xp'
                ? 'bg-purple-50 border-purple-400 text-purple-700'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            Total XP ⚡
          </button>
        </div>
      </div>

      {/* Leaderboard Table Card */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-black text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-5">Rank</th>
                <th className="py-4 px-5">Student</th>
                <th className="py-4 px-5">Club / Class</th>
                <th className="py-4 px-5 text-right">Cyber Smart Score</th>
                <th className="py-4 px-5 text-right">XP</th>
                <th className="py-4 px-5 text-right">Level</th>
                <th className="py-4 px-5 text-center">Badges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedEntries.map((student, idx) => {
                const rank = idx + 1;
                const isUser = student.isCurrentUser;

                return (
                  <tr
                    key={student.studentIdMasked || idx}
                    className={`transition-colors ${
                      isUser
                        ? 'bg-blue-50/70 font-bold'
                        : 'hover:bg-slate-50/60'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-5 font-black">
                      {rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs">
                          🥇 1
                        </span>
                      ) : rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                          🥈 2
                        </span>
                      ) : rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange-100 text-orange-800 border border-orange-300">
                          🥉 3
                        </span>
                      ) : (
                        <span className="text-slate-500 pl-2">#{rank}</span>
                      )}
                    </td>

                    {/* Student Name */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${
                            isUser
                              ? 'bg-[#4F7CFF] text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <span
                            className={`font-black ${
                              isUser ? 'text-[#4F7CFF]' : 'text-[#243047]'
                            }`}
                          >
                            {student.name}
                          </span>
                          {isUser && (
                            <span className="ml-2 text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-[#4F7CFF]">
                              You
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Cohort */}
                    <td className="py-4 px-5 text-slate-500 font-medium">
                      {student.cohort}
                    </td>

                    {/* Digital Trust Score */}
                    <td className="py-4 px-5 text-right">
                      <span className="font-black text-sm text-[#4F7CFF]">
                        {student.trustScore}
                      </span>
                      <span className="text-xs text-slate-400">/100</span>
                    </td>

                    {/* Total XP */}
                    <td className="py-4 px-5 text-right font-black text-purple-700">
                      {student.xp.toLocaleString()} XP
                    </td>

                    {/* Level */}
                    <td className="py-4 px-5 text-right font-bold text-slate-600">
                      Lv. {student.level}
                    </td>

                    {/* Badges count */}
                    <td className="py-4 px-5 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-black text-xs">
                        🏅 {student.badgeCount}
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
