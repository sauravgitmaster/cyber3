import React, { useState } from 'react';
import { ActivePage, UserProfile } from '../types';
import {
  Settings,
  Shield,
  Bell,
  Sliders,
  RotateCcw,
  Check,
  Save,
  Sparkles,
  Sun,
  Moon,
  Compass,
  AlertCircle,
  BarChart3,
} from 'lucide-react';
import { ByteMascot } from '../components/common/ByteMascot';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import {
  getAudienceType,
  validateAge,
  DEFAULT_AGE_BOUNDARY,
  getAudienceLabel,
  getAudienceDescription,
} from '../utils/audienceConstants';

interface SettingsPageProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onResetData: () => void;
  onNavigate: (page: ActivePage) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  user,
  setUser,
  onResetData,
  onNavigate,
}) => {
  const { theme, isDark } = useTheme();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [institution, setInstitution] = useState(user.institution);
  const [major, setMajor] = useState((user as any).major || '');

  const [age, setAge] = useState<string>(user.age !== undefined && user.age !== null ? String(user.age) : '');
  const [ageError, setAgeError] = useState<string | null>(null);

  const [mfaReminders, setMfaReminders] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [drillDifficulty, setDrillDifficulty] = useState('Adaptive');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setAgeError(null);

    let userAge = user.age;
    let userAudience = user.audienceType;

    if (age.trim()) {
      const check = validateAge(age);
      if (!check.valid || check.age === undefined) {
        setAgeError(check.error || 'Please enter a valid age.');
        return;
      }
      userAge = check.age;
      userAudience = getAudienceType(userAge, DEFAULT_AGE_BOUNDARY);
    }

    setUser((prev) => ({
      ...prev,
      name,
      email,
      institution,
      major,
      ...(userAge !== undefined ? { age: userAge } : {}),
      ...(userAudience ? { audienceType: userAudience } : {}),
    }));

    fetch('/api/auth/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        name,
        age: userAge,
        audienceType: userAudience,
      }),
    }).catch(() => {});

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            <Settings className="w-3.5 h-3.5 text-zinc-400" />
            <span>Preferences</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold -tracking-[0.03em] text-zinc-900 dark:text-zinc-100">
            Account & App Settings
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Customize your learning pace, Byte tips, and appearance.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-mono flex items-center gap-2 animate-in fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span>Preferences saved!</span>
          </div>
        )}
      </div>

      {/* 1. Theme & Appearance Section */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              {isDark ? (
                <Moon className="w-4 h-4 text-zinc-300" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <span>Appearance & Theme</span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Toggle between Light, Dark, or System mode to match your environment.
            </p>
          </div>

          <ThemeToggle variant="segmented" id="settings-theme-segmented" />
        </div>

        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center">
              {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
            <div>
              <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 block">
                Quick Toggle
              </span>
              <span className="text-[11px] font-mono text-zinc-500">
                Currently in <strong className="capitalize text-zinc-900 dark:text-zinc-100">{theme}</strong> mode ({isDark ? 'Dark visual canvas' : 'Bright daylight canvas'})
              </span>
            </div>
          </div>
          <ThemeToggle variant="pill" id="settings-quick-pill" />
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Details */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5 transition-colors">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Shield className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            <span>Student Profile Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
                Student Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
                School Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
                School or Organization
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
                Grade / Cyber Club
              </label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
                Learner Age
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="4"
                  max="120"
                  step="1"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    if (ageError) setAgeError(null);
                  }}
                  placeholder="e.g. 12 or 24"
                  className="w-full px-3.5 pr-20 py-2 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
                />
                <span className="absolute right-3 top-2 text-[11px] font-mono text-zinc-400">
                  years old
                </span>
              </div>
              {ageError && (
                <div className="mt-1 text-rose-500 text-[11px] flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" />
                  <span>{ageError}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
                Active Experience Mode
              </label>
              <div className="px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-750 text-xs font-mono flex items-center justify-between">
                <span>
                  {age && validateAge(age).valid
                    ? getAudienceLabel(getAudienceType(Number(age), DEFAULT_AGE_BOUNDARY))
                    : getAudienceLabel(user.audienceType || 'kids')}
                </span>
                <span className="text-[10px] text-zinc-400">
                  {age && Number(age) >= DEFAULT_AGE_BOUNDARY ? 'Ages 13+' : 'Ages ≤12'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Preferences */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5 transition-colors">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            <span>Learning Mode & Hints</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">Mission Difficulty</span>
                <span className="text-zinc-500 dark:text-zinc-400 text-xs">
                  Automatically adjusts trickiness based on your Cyber Smart Score.
                </span>
              </div>
              <select
                value={drillDifficulty}
                onChange={(e) => setDrillDifficulty(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 font-mono text-xs shadow-2xs"
              >
                <option value="Adaptive">Smart Adaptive (Recommended)</option>
                <option value="Beginner">Beginner (Extra Hints)</option>
                <option value="Advanced">Advanced (Tricky Scenarios)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">Instant Byte Debrief</span>
                <span className="text-zinc-500 dark:text-zinc-400 text-xs">
                  Show Byte's celebratory breakdown immediately after making a decision.
                </span>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 accent-zinc-900 dark:accent-zinc-100 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5 transition-colors">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Bell className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            <span>Reminders & Streaks</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">Weekly Cyber Report</span>
                <span className="text-zinc-500 dark:text-zinc-400 text-xs">
                  Get a weekly recap of your Cyber Smart Score and newly earned trophies.
                </span>
              </div>
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
                className="w-4 h-4 accent-zinc-900 dark:accent-zinc-100 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">Daily Cyber Streak Reminder</span>
                <span className="text-zinc-500 dark:text-zinc-400 text-xs">
                  Friendly ping from Byte to keep your daily streak alive.
                </span>
              </div>
              <input
                type="checkbox"
                checked={mfaReminders}
                onChange={(e) => setMfaReminders(e.target.checked)}
                className="w-4 h-4 accent-zinc-900 dark:accent-zinc-100 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-mono text-xs transition-colors flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* Admin & Visitor Analytics Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 space-y-3 transition-colors shadow-xs">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Visitor & Learning Platform Analytics</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Access the administrative dashboard to view visitor metrics, device distribution, Kids vs Adult breakdown, and export CSV reports.
            </p>
          </div>
          <button
            onClick={() => onNavigate('admin-analytics')}
            className="px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-semibold transition-all shadow-xs cursor-pointer shrink-0"
          >
            Open Admin Dashboard
          </button>
        </div>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3 transition-colors">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Reset Progress</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Want to start fresh from the beginning? This resets your completed missions and score to the initial baseline.
        </p>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset your student progress to the beginning?')) {
              onResetData();
            }
          }}
          className="px-4 py-2 rounded-full bg-white dark:bg-zinc-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-zinc-300 dark:border-zinc-700 hover:border-rose-400 dark:hover:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset My Student Progress</span>
        </button>
      </div>
    </div>
  );
};

