import React from 'react';
import { useTheme, ThemeMode } from '../../context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'icon' | 'pill' | 'segmented';
  className?: string;
  id?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'icon',
  className = '',
  id = 'theme-toggle-button',
}) => {
  const { theme, isDark, setTheme, toggleTheme } = useTheme();

  if (variant === 'segmented') {
    const options: { mode: ThemeMode; label: string; icon: React.FC<{ className?: string }> }[] = [
      { mode: 'light', label: 'Light', icon: Sun },
      { mode: 'dark', label: 'Dark', icon: Moon },
      { mode: 'system', label: 'System', icon: Monitor },
    ];

    return (
      <div
        id={id}
        className={`inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-2xs ${className}`}
        role="group"
        aria-label="Theme selection"
      >
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.mode;
          return (
            <button
              key={opt.mode}
              type="button"
              id={`${id}-${opt.mode}`}
              onClick={() => setTheme(opt.mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs scale-102'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        id={id}
        type="button"
        onClick={toggleTheme}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-150 cursor-pointer text-xs font-bold ${
          isDark
            ? 'bg-zinc-900 hover:bg-zinc-800 border-white/15 text-amber-300'
            : 'bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-700 shadow-2xs'
        } ${className}`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? (
          <>
            <Sun className="w-4 h-4 text-amber-300 fill-amber-300/30 transition-transform duration-200 rotate-0 hover:rotate-45" />
            <span className="hidden sm:inline text-zinc-200">Light Mode</span>
          </>
        ) : (
          <>
            <Moon className="w-4 h-4 text-zinc-700 fill-zinc-200 transition-transform duration-200 hover:-rotate-12" />
            <span className="hidden sm:inline text-zinc-700">Dark Mode</span>
          </>
        )}
      </button>
    );
  }

  // Default: Compact Icon button
  return (
    <button
      id={id}
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center ${
        isDark
          ? 'bg-zinc-900 hover:bg-zinc-800 border-white/15 text-amber-300 shadow-2xs'
          : 'bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-700 shadow-2xs hover:text-zinc-950'
      } ${className}`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-300 fill-amber-300/30 transition-transform duration-300 hover:rotate-90" />
      ) : (
        <Moon className="w-4 h-4 text-zinc-700 fill-zinc-200 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
};
