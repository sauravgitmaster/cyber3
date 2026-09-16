import React from 'react';
import { ActivePage, UserProfile } from '../../types';
import {
  Home,
  BookOpen,
  Target,
  Users,
  Trophy,
  User,
  ChevronRight,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { ByteMascot } from '../common/ByteMascot';
import { ThemeToggle } from '../common/ThemeToggle';

interface SidebarProps {
  currentPage?: ActivePage;
  activePage?: ActivePage;
  onNavigate: (page: ActivePage) => void;
  user?: UserProfile;
  onOpenMentor?: () => void;
  unreadNotificationsCount?: number;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  activePage,
  onNavigate,
  user,
  onOpenMentor,
  onLogout,
}) => {
  const current = activePage || currentPage || 'dashboard';

  // The 6 clean consumer-learning nav items
  const mainNav = [
    { id: 'dashboard' as ActivePage, label: 'Home', icon: Home, color: 'text-[#4F7CFF]' },
    { id: 'learning-paths' as ActivePage, label: 'Learn', icon: BookOpen, color: 'text-[#40C98A]' },
    { id: 'interactive-scenario' as ActivePage, label: 'Missions', icon: Target, color: 'text-[#FF6B6B]' },
    { id: 'multiplayer' as ActivePage, label: 'Play', icon: Users, color: 'text-[#8B6CFF]' },
    { id: 'badges' as ActivePage, label: 'Rewards', icon: Trophy, color: 'text-[#FFC857]' },
    { id: 'profile' as ActivePage, label: 'Profile', icon: User, color: 'text-[#36B37E]' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-black border-r border-zinc-200 dark:border-zinc-850 flex flex-col h-screen shrink-0 sticky top-0 select-none text-zinc-900 dark:text-zinc-100 z-20 hidden lg:flex transition-colors duration-200">
      {/* Brand Header */}
      <div className="p-5 border-b border-zinc-200/80 dark:border-zinc-850 flex items-center justify-between">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white group-hover:scale-105 transition-transform shadow-xs">
            <ByteMascot size="xs" animate={false} />
          </div>
          <div>
            <span className="font-semibold text-sm -tracking-[0.02em] text-zinc-900 dark:text-zinc-100 block leading-tight">
              CyberMentor
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 block">
              Adventure Academy
            </span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('landing')}
          title="Overview & Info"
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Nav Items */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-1">
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive =
            current === item.id ||
            (item.id === 'learning-paths' && current === 'module-detail') ||
            (item.id === 'interactive-scenario' && current === 'ai-feedback');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-2xs'
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />}
            </button>
          );
        })}
      </div>

      {/* Footer Area: Theme Switcher & Byte Callout */}
      <div className="p-4 border-t border-zinc-200/80 dark:border-zinc-850 bg-white dark:bg-black space-y-3">
        {/* Theme Toggle Bar */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Appearance</span>
          <ThemeToggle variant="pill" id="sidebar-theme-toggle" />
        </div>

        {/* Mascot Card */}
        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 space-y-2">
          <div className="flex items-center gap-2.5">
            <ByteMascot mood="waving" size="sm" />
            <div>
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 block">
                Meet Byte
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">
                Your cyber safety buddy
              </span>
            </div>
          </div>
          <button
            onClick={onOpenMentor}
            className="w-full py-1.5 px-3 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>Ask Byte a question</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Logout Button */}
        <button
          id="sidebar-logout-button"
          onClick={() => {
            if (onLogout) {
              onLogout();
            } else {
              onNavigate('landing');
            }
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/60 dark:hover:bg-rose-950/20 border border-zinc-200/60 dark:border-zinc-850 transition-all duration-150 cursor-pointer group"
          title="Log out and return to landing page"
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
            EXIT
          </span>
        </button>
      </div>
    </aside>
  );
};

