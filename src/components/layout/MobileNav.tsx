import React, { useState } from 'react';
import { ActivePage } from '../../types';
import {
  Home,
  BookOpen,
  Target,
  Users,
  Trophy,
  User,
  X,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { ByteMascot } from '../common/ByteMascot';
import { ThemeToggle } from '../common/ThemeToggle';

interface MobileNavProps {
  isOpen?: boolean;
  onClose?: () => void;
  currentPage?: ActivePage;
  activePage?: ActivePage;
  onNavigate: (page: ActivePage) => void;
  onOpenMentor?: () => void;
  onLogout?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen = false,
  onClose,
  currentPage,
  activePage,
  onNavigate,
  onOpenMentor,
  onLogout,
}) => {
  const current = activePage || currentPage || 'dashboard';

  const items = [
    { id: 'dashboard' as ActivePage, label: 'Home', icon: Home },
    { id: 'learning-paths' as ActivePage, label: 'Learn', icon: BookOpen },
    { id: 'interactive-scenario' as ActivePage, label: 'Missions', icon: Target },
    { id: 'multiplayer' as ActivePage, label: 'Play', icon: Users },
    { id: 'badges' as ActivePage, label: 'Rewards', icon: Trophy },
    { id: 'profile' as ActivePage, label: 'Profile', icon: User },
  ];

  const handleSelectPage = (pageId: ActivePage) => {
    onNavigate(pageId);
    onClose?.();
  };

  return (
    <>
      {/* 6-Item Clean Bottom Bar on Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-850 px-1 py-1.5 flex items-center justify-around lg:hidden select-none transition-colors duration-200">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            current === item.id ||
            (item.id === 'learning-paths' && current === 'module-detail') ||
            (item.id === 'interactive-scenario' && current === 'ai-feedback');

          return (
            <button
              key={item.id}
              onClick={() => handleSelectPage(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl min-w-[50px] transition-all cursor-pointer ${
                isActive
                  ? 'text-zinc-900 dark:text-zinc-100 font-semibold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 font-medium'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isActive ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800' : ''
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Slide-out Drawer if triggered by menu toggle */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative w-4/5 max-w-xs bg-white dark:bg-black flex flex-col h-full z-10 text-zinc-900 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-850 shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-850 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
                  <ByteMascot size="xs" animate={false} />
                </div>
                <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                  CyberMentor
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = current === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectPage(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/40'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Mobile Theme Toggle Section */}
              <div className="pt-2">
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850">
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Theme</span>
                  <ThemeToggle variant="pill" id="mobile-drawer-theme-toggle" />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-850 space-y-2">
                <button
                  onClick={() => {
                    onClose?.();
                    onOpenMentor?.();
                  }}
                  className="w-full py-2.5 px-4 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-medium text-xs flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                >
                  <ByteMascot size="xs" animate={false} />
                  <span>Chat with Byte</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  id="mobile-drawer-logout-button"
                  onClick={() => {
                    onClose?.();
                    if (onLogout) {
                      onLogout();
                    } else {
                      onNavigate('landing');
                    }
                  }}
                  className="w-full py-2 px-4 rounded-xl font-medium text-xs text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/60 dark:hover:bg-rose-950/20 border border-zinc-200 dark:border-zinc-850 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out to Landing</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

