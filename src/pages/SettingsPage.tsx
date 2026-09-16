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
} from 'lucide-react';
import { ByteMascot } from '../components/common/ByteMascot';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

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
  const [major, setMajor] = useState(user.major);

  const [mfaReminders, setMfaReminders] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [drillDifficulty, setDrillDifficulty] = useState('Adaptive');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name,
      email,
      institution,
      major,
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto text-[#243047] dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-black text-[#4F7CFF] dark:text-blue-400 uppercase tracking-wider">
            <Settings className="w-4 h-4" />
            <span>PREFERENCES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#243047] dark:text-slate-100">
            Account & App Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Customize your learning pace, Byte tips, and appearance.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Preferences saved!</span>
          </div>
        )}
      </div>

      {/* 1. Theme & Appearance Section */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-black text-[#243047] dark:text-slate-100 flex items-center gap-2">
              {isDark ? (
                <Moon className="w-5 h-5 text-blue-400 fill-blue-400/20" />
              ) : (
                <Sun className="w-5 h-5 text-amber-500 fill-amber-500/20" />
              )}
              <span>Appearance & Theme</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Toggle between Light, Dark, or System mode to match your environment.
            </p>
          </div>

          <ThemeToggle variant="segmented" id="settings-theme-segmented" />
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
            <div>
              <span className="font-bold text-xs text-[#243047] dark:text-slate-100 block">
                Quick Toggle
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Currently running in <strong className="capitalize text-[#4F7CFF] dark:text-blue-400">{theme}</strong> mode ({isDark ? 'Dark visual canvas' : 'Bright daylight canvas'})
              </span>
            </div>
          </div>
          <ThemeToggle variant="pill" id="settings-quick-pill" />
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Details */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
          <h2 className="text-base font-black text-[#243047] dark:text-slate-100 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#4F7CFF] dark:text-blue-400" />
            <span>Student Profile Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Student Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[#243047] dark:text-slate-100 font-medium focus:outline-none focus:border-[#4F7CFF] focus:bg-white dark:focus:bg-slate-800 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                School Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[#243047] dark:text-slate-100 font-medium focus:outline-none focus:border-[#4F7CFF] focus:bg-white dark:focus:bg-slate-800 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                School or Organization
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[#243047] dark:text-slate-100 font-medium focus:outline-none focus:border-[#4F7CFF] focus:bg-white dark:focus:bg-slate-800 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Grade / Cyber Club
              </label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[#243047] dark:text-slate-100 font-medium focus:outline-none focus:border-[#4F7CFF] focus:bg-white dark:focus:bg-slate-800 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Learning Preferences */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
          <h2 className="text-base font-black text-[#243047] dark:text-slate-100 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#8B6CFF]" />
            <span>Learning Mode & Hints</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div>
                <span className="font-bold text-[#243047] dark:text-slate-100 block">Mission Difficulty</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs">
                  Automatically adjusts trickiness based on your Cyber Smart Score.
                </span>
              </div>
              <select
                value={drillDifficulty}
                onChange={(e) => setDrillDifficulty(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[#243047] dark:text-slate-100 font-bold text-xs shadow-2xs"
              >
                <option value="Adaptive">Smart Adaptive (Recommended)</option>
                <option value="Beginner">Beginner (Extra Hints)</option>
                <option value="Advanced">Advanced (Tricky Scenarios)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div>
                <span className="font-bold text-[#243047] dark:text-slate-100 block">Instant Byte Debrief</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs">
                  Show Byte's celebratory breakdown immediately after making a decision.
                </span>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 accent-[#4F7CFF] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
          <h2 className="text-base font-black text-[#243047] dark:text-slate-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <span>Reminders & Streaks</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div>
                <span className="font-bold text-[#243047] dark:text-slate-100 block">Weekly Cyber Report</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs">
                  Get a weekly recap of your Cyber Smart Score and newly earned trophies.
                </span>
              </div>
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
                className="w-4 h-4 accent-[#4F7CFF] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div>
                <span className="font-bold text-[#243047] dark:text-slate-100 block">Daily Cyber Streak Reminder</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs">
                  Friendly ping from Byte to keep your daily streak alive.
                </span>
              </div>
              <input
                type="checkbox"
                checked={mfaReminders}
                onChange={(e) => setMfaReminders(e.target.checked)}
                className="w-4 h-4 accent-[#4F7CFF] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-[#4F7CFF] hover:bg-[#3D6CE6] text-white font-black text-xs transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* Danger Zone: Reset Data */}
      <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-3 transition-colors">
        <h3 className="text-sm font-black text-rose-800 dark:text-rose-300">Reset Progress</h3>
        <p className="text-xs text-rose-700 dark:text-rose-400">
          Want to start fresh from the beginning? This resets your completed missions and score to the initial baseline.
        </p>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset your student progress to the beginning?')) {
              onResetData();
            }
          }}
          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset My Student Progress</span>
        </button>
      </div>
    </div>
  );
};

