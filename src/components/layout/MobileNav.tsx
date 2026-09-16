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
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen = false,
  onClose,
  currentPage,
  activePage,
  onNavigate,
  onOpenMentor,
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
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-1 py-1 flex items-center justify-around lg:hidden shadow-lg select-none transition-colors duration-200">
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
                  ? 'text-[#4F7CFF] dark:text-blue-400 font-black scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isActive ? 'bg-blue-50 dark:bg-blue-950/60 text-[#4F7CFF] dark:text-blue-400' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
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
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative w-4/5 max-w-xs bg-white dark:bg-slate-900 flex flex-col h-full z-10 text-[#243047] dark:text-slate-100 border-r border-slate-200 dark:border-slate-800 shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ByteMascot size="xs" animate={false} />
                <span className="font-extrabold text-sm text-[#243047] dark:text-slate-100">
                  CyberMentor
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = current === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectPage(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-[#4F7CFF] dark:text-blue-400'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Mobile Theme Toggle Section */}
              <div className="pt-2">
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Theme</span>
                  <ThemeToggle variant="pill" id="mobile-drawer-theme-toggle" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    onClose?.();
                    onOpenMentor?.();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#8B6CFF] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <ByteMascot size="xs" animate={false} />
                  <span>Chat with Byte</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

