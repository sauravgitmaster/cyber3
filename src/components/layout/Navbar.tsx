import React from 'react';
import { ActivePage, UserProfile } from '../../types';
import {
  Menu,
  Shield,
  Sparkles,
  Trophy,
  Users,
  Home,
  BookOpen,
  Target,
  CheckCircle2,
  Zap,
  Award,
  User,
} from 'lucide-react';
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
    avatar: '',
    level: 1,
    currentXP: 100,
    digitalTrustScore: 72,
    trustScoreDelta: 0,
    streakDays: 1,
  };

  const getPageTitle = () => {
    switch (current) {
      case 'dashboard':
        return { label: 'Adventure Home', icon: Home };
      case 'learning-paths':
        return { label: 'Learn', icon: BookOpen };
      case 'module-detail':
        return { label: 'Learning Zone', icon: BookOpen };
      case 'interactive-scenario':
        return { label: 'Cyber Missions', icon: Target };
      case 'multiplayer':
        return { label: 'Play With a Friend', icon: Users };
      case 'ai-feedback':
        return { label: 'Mission Results', icon: CheckCircle2 };
      case 'skill-check':
        return { label: 'Quick Cyber Check', icon: Zap };
      case 'badges':
        return { label: 'Rewards & Trophies', icon: Award };
      case 'profile':
        return { label: 'Your Profile', icon: User };
      default:
        return { label: 'CyberMentor', icon: Shield };
    }
  };

  const currentInfo = getPageTitle();
  const IconComponent = currentInfo.icon;
  const isImageAvatar =
    safeUser.avatar?.startsWith('http') || safeUser.avatar?.startsWith('data:image/');

  return (
    <header className="h-16 bg-white/95 dark:bg-black/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-850 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Left: Mobile Toggle & Page Location */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggleMobileNav?.()}
          className="p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 lg:hidden transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Current Area Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
            <IconComponent className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-semibold -tracking-[0.02em] text-zinc-900 dark:text-zinc-100 leading-tight">
              {currentInfo.label}
            </h1>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden sm:block">
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
          className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-medium text-xs shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer active:scale-95"
          title="Chat with Byte, your cyber buddy"
        >
          <ByteMascot size="xs" animate={false} />
          <span className="hidden sm:inline">Ask Byte</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400 dark:text-amber-500" />
        </button>

        {/* User Avatar with Level Ring */}
        <button
          onClick={() => onNavigate('profile')}
          className="relative w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 dark:hover:border-zinc-500 transition-all flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 overflow-hidden cursor-pointer"
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
            <User className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
          )}
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-[8px] font-mono font-bold flex items-center justify-center border border-white dark:border-black">
            {safeUser.level || 1}
          </span>
        </button>
      </div>
    </header>
  );
};

