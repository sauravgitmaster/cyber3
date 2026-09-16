import React, { useState } from 'react';
import { ActivePage, BadgeItem, LearningPath, UserProfile } from '../types';
import { AvatarUploader } from '../components/common/AvatarUploader';
import { getLearnerLevel } from '../utils/levelSystem';
import {
  User,
  Award,
  CheckCircle2,
  Calendar,
  Sparkles,
  Zap,
  Shield,
  Edit2,
  Save,
} from 'lucide-react';

interface ProfilePageProps {
  user: UserProfile;
  badges: BadgeItem[];
  paths: LearningPath[];
  onNavigate: (page: ActivePage) => void;
  setUser?: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  badges,
  paths,
  onNavigate,
  setUser,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);

  const unlockedBadges = badges.filter((b) => b.unlocked);
  const completedPaths = paths.filter((p) => p.progress >= 100);
  const levelInfo = getLearnerLevel(user.digitalTrustScore);

  const handleAvatarChange = (newAvatar: string) => {
    if (setUser) {
      setUser((prev) => ({ ...prev, avatar: newAvatar }));
    }
  };

  const handleSaveName = () => {
    if (nameInput.trim() && setUser) {
      setUser((prev) => ({ ...prev, name: nameInput.trim() }));
    }
    setIsEditingName(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            <User className="w-3.5 h-3.5 text-zinc-400" />
            <span>My Cyber Passport</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold -tracking-[0.03em] text-zinc-900 dark:text-zinc-100">
            My Profile
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            View your rank, stats, avatar, and completed achievements.
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-900 dark:text-zinc-100 self-start sm:self-center">
          {levelInfo.levelBadge}
        </span>
      </div>

      {/* Main Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Avatar Uploader */}
          <div className="shrink-0 flex justify-center sm:justify-start">
            <AvatarUploader
              currentAvatar={user.avatar || ''}
              onAvatarChange={handleAvatarChange}
              size="lg"
            />
          </div>

          {/* Name & Quick Stats */}
          <div className="space-y-3 flex-1 text-center sm:text-left">
            <div className="space-y-1">
              {isEditingName ? (
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-zinc-400 dark:border-zinc-600 font-semibold text-xl text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-900 focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 cursor-pointer shadow-2xs"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h2 className="text-2xl font-semibold -tracking-[0.02em] text-zinc-900 dark:text-zinc-100">{user.name}</h2>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                    title="Edit Name"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                {user.email || 'cyberlearner@cybermentor.app'}
              </p>
            </div>

            {/* Badges in level */}
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <span className="px-3 py-1 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-mono">
                {levelInfo.levelTitle}
              </span>
              <span className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-mono">
                {user.streakDays} Day Streak
              </span>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-850">
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center space-y-1">
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
              Smart Score
            </span>
            <div className="text-2xl font-semibold font-mono text-zinc-900 dark:text-zinc-100">
              {user.digitalTrustScore} <span className="text-xs font-normal text-zinc-400">pts</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center space-y-1">
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
              Total XP
            </span>
            <div className="text-2xl font-semibold font-mono text-zinc-900 dark:text-zinc-100">
              {user.currentXP}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center space-y-1">
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
              Badges
            </span>
            <div className="text-2xl font-semibold font-mono text-zinc-900 dark:text-zinc-100">
              {unlockedBadges.length}
            </div>
          </div>
        </div>
      </div>

      {/* Badges Earned */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">My Trophies</h3>
          <button
            onClick={() => onNavigate('badges')}
            className="text-xs font-mono text-zinc-900 dark:text-zinc-100 hover:underline cursor-pointer"
          >
            See All Badges →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {unlockedBadges.slice(0, 4).map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center shrink-0 shadow-2xs">
                <Award className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">{b.title}</div>
                <div className="text-[10px] font-mono text-zinc-400">Unlocked</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
