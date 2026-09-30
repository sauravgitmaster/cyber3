import React, { useState } from 'react';
import { ActivePage, BadgeItem, LearningPath, UserProfile } from '../types';
import { AvatarUploader } from '../components/common/AvatarUploader';
import { getLearnerLevel } from '../utils/levelSystem';
import {
  getAudienceType,
  validateAge,
  DEFAULT_AGE_BOUNDARY,
  getAudienceLabel,
  getAudienceDescription,
} from '../utils/audienceConstants';
import {
  User,
  Award,
  CheckCircle2,
  Calendar,
  Sparkles,
  Zap,
  Shield,
  Compass,
  Edit2,
  Save,
  AlertCircle,
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

  const [isEditingAge, setIsEditingAge] = useState(false);
  const [ageInput, setAgeInput] = useState(user.age ? String(user.age) : '');
  const [ageError, setAgeError] = useState<string | null>(null);

  const unlockedBadges = badges.filter((b) => b.unlocked);
  const completedPaths = paths.filter((p) => p.progress >= 100);
  const levelInfo = getLearnerLevel(user.digitalTrustScore);

  const currentAudience = user.audienceType || (user.age ? getAudienceType(user.age) : 'kids');

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

  const handleSaveAge = () => {
    const check = validateAge(ageInput);
    if (!check.valid || check.age === undefined) {
      setAgeError(check.error || 'Please enter a valid whole number age.');
      return;
    }
    const newAudience = getAudienceType(check.age, DEFAULT_AGE_BOUNDARY);
    if (setUser) {
      setUser((prev) => ({
        ...prev,
        age: check.age,
        audienceType: newAudience,
      }));
    }
    fetch('/api/auth/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, age: check.age, audienceType: newAudience }),
    }).catch(() => {});
    setIsEditingAge(false);
    setAgeError(null);
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
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
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

      {/* Tailored Experience & Age Settings Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100">
              {currentAudience === 'kids' ? (
                <Compass className="w-4 h-4 text-amber-500" />
              ) : (
                <Shield className="w-4 h-4 text-blue-500" />
              )}
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Tailored Learning Experience
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Your missions, quiz questions, and Byte AI mentor responses adapt to your age.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-medium border ${
                currentAudience === 'kids'
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-900/60'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-900/60'
              }`}
            >
              {getAudienceLabel(currentAudience)}
            </span>
          </div>
        </div>

        {isEditingAge ? (
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              How old are you?
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="4"
                max="120"
                step="1"
                value={ageInput}
                onChange={(e) => {
                  setAgeInput(e.target.value);
                  if (ageError) setAgeError(null);
                }}
                placeholder="e.g. 12 or 25"
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 w-32"
                autoFocus
              />
              <span className="text-xs font-mono text-zinc-500">years old</span>

              <button
                onClick={handleSaveAge}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-medium cursor-pointer transition-colors shadow-2xs"
              >
                Save Age
              </button>

              <button
                onClick={() => {
                  setIsEditingAge(false);
                  setAgeError(null);
                  setAgeInput(user.age ? String(user.age) : '');
                }}
                className="px-3 py-2 text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {ageError && (
              <div className="text-rose-600 dark:text-rose-400 text-xs flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{ageError}</span>
              </div>
            )}

            <p className="text-[11px] text-zinc-500 font-mono">
              Boundary: Ages 12 and below → Kids Experience • Ages 13 and above → Adult Experience
            </p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">
                  Current Age:
                </span>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {user.age !== undefined && user.age !== null ? `${user.age} years old` : 'Not specified yet'}
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {getAudienceDescription(currentAudience)}
              </p>
            </div>

            <button
              onClick={() => {
                setAgeInput(user.age ? String(user.age) : '');
                setIsEditingAge(true);
              }}
              className="px-3.5 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-xs font-mono text-zinc-800 dark:text-zinc-200 transition-colors flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Change Age</span>
            </button>
          </div>
        )}
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
