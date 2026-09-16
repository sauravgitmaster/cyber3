import React from 'react';
import { ActivePage } from '../types';
import { Shield, Sparkles, ArrowRight, LogIn } from 'lucide-react';
import { ByteMascot } from '../components/common/ByteMascot';
import { ThemeToggle } from '../components/common/ThemeToggle';

interface LandingPageProps {
  onNavigate: (page: ActivePage) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#F7F9FC] dark:bg-slate-950 text-[#243047] dark:text-slate-100 flex flex-col justify-center items-center px-4 py-8 font-sans selection:bg-blue-200 dark:selection:bg-blue-900 relative transition-colors duration-200">
      {/* Top Bar with Dark/Light Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle id="landing-theme-toggle" />
      </div>

      <div className="w-full max-w-md text-center space-y-8">
        {/* Friendly Byte Mascot Banner */}
        <div className="inline-flex justify-center animate-bounce-subtle">
          <ByteMascot mood="happy" size="lg" />
        </div>

        {/* Brand & Heading */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-black text-[#4F7CFF] dark:text-blue-400">
            <Shield className="w-4 h-4 text-[#4F7CFF] dark:text-blue-400" />
            <span>CYBERMENTOR 🛡️</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#243047] dark:text-white tracking-tight leading-tight">
            Learn to be smarter and safer online.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-sm mx-auto">
            Play fun cyber missions, learn how to spot online tricks, and build smart digital habits.
          </p>
        </div>

        {/* Primary Actions */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => onNavigate('auth')}
            className="w-full py-4 rounded-2xl bg-[#4F7CFF] hover:bg-[#3D6CE6] text-white font-black text-sm sm:text-base shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('auth')}
            className="w-full py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Log In</span>
          </button>
        </div>

        {/* Friendly Footer Link */}
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('auth')}
            className="text-[#4F7CFF] dark:text-blue-400 hover:underline font-black cursor-pointer"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

