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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto text-[#243047] font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1 text-[11px] font-black text-[#4F7CFF] uppercase tracking-wider">
            <User className="w-3.5 h-3.5" />
            <span>MY CYBER PASSPORT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#243047]">
            My Profile
          </h1>
        </div>

        <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-black text-[#4F7CFF]">
          {levelInfo.levelBadge}
        </span>
      </div>

      {/* Main Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Avatar Uploader */}
          <div className="shrink-0 flex justify-center sm:justify-start">
            <AvatarUploader
              currentAvatar={user.avatar || '🤖'}
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
                    className="px-3 py-1.5 rounded-xl border border-[#4F7CFF] font-black text-xl text-[#243047] bg-white focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-2 rounded-xl bg-[#4F7CFF] text-white hover:bg-[#3D6CE6]"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h2 className="text-2xl font-black text-[#243047]">{user.name}</h2>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    title="Edit Name"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <p className="text-xs font-semibold text-slate-500">
                {user.email || 'cyberlearner@cybermentor.app'}
              </p>
            </div>

            {/* Badges in level */}
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-black">
                {levelInfo.emoji} {levelInfo.levelTitle}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                {user.streakDays} Day Streak 🔥
              </span>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-center space-y-1">
            <span className="text-[11px] font-black text-slate-500 uppercase block">
              Smart Score
            </span>
            <div className="text-2xl font-black text-[#4F7CFF]">
              {user.digitalTrustScore} ⭐
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 text-center space-y-1">
            <span className="text-[11px] font-black text-slate-500 uppercase block">
              Total XP
            </span>
            <div className="text-2xl font-black text-[#8B6CFF]">
              {user.currentXP}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 text-center space-y-1">
            <span className="text-[11px] font-black text-slate-500 uppercase block">
              Badges
            </span>
            <div className="text-2xl font-black text-amber-600">
              {unlockedBadges.length}
            </div>
          </div>
        </div>
      </div>

      {/* Badges Earned */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-[#243047]">My Trophies</h3>
          <button
            onClick={() => onNavigate('badges')}
            className="text-xs font-black text-[#4F7CFF] hover:underline"
          >
            See All Badges →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {unlockedBadges.slice(0, 4).map((b) => (
            <div
              key={b.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Award className="w-5 h-5" />
              </div>
              <div className="truncate">
                <div className="text-xs font-black text-[#243047] truncate">{b.title}</div>
                <div className="text-[10px] font-bold text-slate-500">Unlocked</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
