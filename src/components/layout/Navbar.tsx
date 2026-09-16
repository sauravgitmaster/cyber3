import React from 'react';
import { ActivePage, UserProfile } from '../../types';
import { Menu, Shield, Sparkles, Trophy, Users } from 'lucide-react';
import { ByteMascot } from '../common/ByteMascot';
import { ThemeToggle } from '../common/ThemeToggle';

interface NavbarProps {
  currentPage?: ActivePage;
  activePage?: ActivePage;
  onNavigate: (page: ActivePage) => void;
  user?: UserProfile;
  onOpenMentor?: () => void;
  onToggleMobileNav?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  activePage,
  onNavigate,
  user,
  onOpenMentor,
  onToggleMobileNav,
}) => {
  const current = activePage || currentPage || 'dashboard';
  const safeUser = user || {
    name: 'Saurav',
    avatar: '🤖',
    level: 1,
    currentXP: 100,
    digitalTrustScore: 72,
    trustScoreDelta: 0,
    streakDays: 1,
  };

  const getPageTitle = () => {
    switch (current) {
      case 'dashboard':
        return { label: 'Adventure Home', icon: '🏠' };
      case 'learning-paths':
        return { label: 'Learn', icon: '📖' };
      case 'module-detail':
        return { label: 'Learning Zone', icon: '📖' };
      case 'interactive-scenario':
        return { label: 'Cyber Missions', icon: '🎯' };
      case 'multiplayer':
        return { label: 'Play With a Friend', icon: '👥' };
      case 'ai-feedback':
        return { label: 'Mission Results', icon: '✨' };
      case 'skill-check':
        return { label: 'Quick Cyber Check', icon: '⚡' };
      case 'badges':
        return { label: 'Rewards & Trophies', icon: '🏆' };
      case 'profile':
        return { label: 'Your Profile', icon: '👤' };
      default:
        return { label: 'CyberMentor', icon: '🛡️' };
    }
  };

  const currentInfo = getPageTitle();
  const isImageAvatar =
    safeUser.avatar?.startsWith('http') || safeUser.avatar?.startsWith('data:image/');

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none text-[#243047] dark:text-slate-100 shadow-xs transition-colors duration-200">
      {/* Left: Mobile Toggle & Page Location */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggleMobileNav?.()}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Current Area Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl" role="img" aria-label="icon">
            {currentInfo.icon}
          </span>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-[#243047] dark:text-slate-100 leading-tight">
              {currentInfo.label}
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Cyber adventure & safety skills
            </p>
          </div>
        </div>
      </div>

      {/* Right Utility Bar: Dark/Light Mode toggle, Byte Buddy & Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Dark & Light Mode Toggle */}
        <ThemeToggle id="navbar-theme-toggle" />

        {/* Ask Byte Companion CTA Button */}
        <button
          onClick={onOpenMentor}
          className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-[#4F7CFF] to-[#8B6CFF] hover:from-[#3D6CE6] hover:to-[#7957E6] text-white font-bold text-xs shadow-sm hover:shadow transition-all duration-150 active:scale-95"
          title="Chat with Byte, your cyber buddy"
        >
          <ByteMascot size="xs" animate={false} />
          <span className="hidden sm:inline">Ask Byte</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </button>

        {/* User Avatar with Level Ring */}
        <button
          onClick={() => onNavigate('profile')}
          className="relative w-8 h-8 rounded-full border-2 border-[#4F7CFF] hover:scale-105 transition-transform flex items-center justify-center bg-blue-50 dark:bg-slate-800 overflow-hidden"
          title={`View profile (${safeUser.name})`}
        >
          {isImageAvatar ? (
            <img
              src={safeUser.avatar}
              alt={safeUser.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="text-lg leading-none">{safeUser.avatar || '🤖'}</span>
          )}
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#8B6CFF] text-white text-[8px] font-black flex items-center justify-center border border-white dark:border-slate-900">
            {safeUser.level || 1}
          </span>
        </button>
      </div>
    </header>
  );
};

