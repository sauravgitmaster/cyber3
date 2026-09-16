import React, { useState } from 'react';
import { ActivePage, LearningPath, CategoryGroup } from '../types';
import {
  Map,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  Sparkles,
  Trophy,
  ChevronRight,
  Compass,
  Shield,
  Key,
  AlertTriangle,
  Eye,
  Smartphone,
  Globe,
  Scale,
  BookOpen,
} from 'lucide-react';
import { ByteMascot } from '../components/common/ByteMascot';

interface LearningPathsPageProps {
  paths: LearningPath[];
  onNavigate: (page: ActivePage, params?: { pathId?: string; moduleId?: string }) => void;
  selectedPathId?: string;
}

export const LearningPathsPage: React.FC<LearningPathsPageProps> = ({
  paths,
  onNavigate,
  selectedPathId,
}) => {
  // Select active adventure path
  const [activePathId, setActivePathId] = useState<string>(
    selectedPathId || paths[0]?.id || 'cyber-safety-fundamentals'
  );

  const currentPath = paths.find((p) => p.id === activePathId) || paths[0];

  const getModuleIcon = (title: string, index: number) => {
    const t = title.toLowerCase();
    if (t.includes('password') || t.includes('auth')) return Key;
    if (t.includes('phish') || t.includes('social')) return AlertTriangle;
    if (t.includes('privacy') || t.includes('leak')) return Eye;
    if (t.includes('share') || t.includes('device')) return Smartphone;
    if (t.includes('browse') || t.includes('network') || t.includes('wifi')) return Globe;
    if (t.includes('ethics') || t.includes('responsible')) return Scale;
    const fallbacks = [BookOpen, Shield, Sparkles, Trophy];
    return fallbacks[index % fallbacks.length];
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            <Map className="w-3.5 h-3.5 text-zinc-400" />
            <span>Adventure Map</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold -tracking-[0.03em] text-zinc-900 dark:text-zinc-100">
            Learning Adventures
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
            Follow the journey path, earn stars, and unlock new cyber powers one mission at a time!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Progress: {currentPath?.progress || 0}%</span>
          </div>
        </div>
      </div>

      {/* Path Switcher Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {paths.map((path) => {
          const isSelected = path.id === currentPath.id;
          return (
            <button
              key={path.id}
              onClick={() => setActivePathId(path.id)}
              className={`px-4 py-2 rounded-full text-xs font-mono transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-2xs'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <span className="flex items-center">{path.id === 'cyber-safety-fundamentals' ? <Shield className="w-3.5 h-3.5" /> : <Compass className="w-3.5 h-3.5" />}</span>
              <span className="font-sans font-medium">{path.title}</span>
              <span className="text-[10px] opacity-70">({path.progress}%)</span>
            </button>
          );
        })}
      </div>

      {/* Main Adventure Board */}
      <div className="bg-white dark:bg-[#080808] rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Adventure Summary Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            <ByteMascot mood="excited" size="md" animate={false} />
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                Current Expedition
              </span>
              <h2 className="text-lg sm:text-xl font-semibold -tracking-[0.02em] text-zinc-900 dark:text-zinc-100">
                {currentPath.title}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 max-w-lg">
                {currentPath.description}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-950 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>{currentPath.estimatedTime} journey</span>
          </div>
        </div>

        {/* Visual Map Journey Tree (Nodes with connectors) */}
        <div className="relative py-4 space-y-4">
          {/* Subtle center path spine */}
          <div className="absolute top-8 bottom-8 left-8 sm:left-10 w-px bg-zinc-200 dark:bg-zinc-800 -z-0" />

          {currentPath.modules.map((module, index) => {
            const isCompleted = module.isCompleted;
            const isCurrent = !isCompleted && (index === 0 || currentPath.modules[index - 1]?.isCompleted);
            const isLocked = !isCompleted && !isCurrent;
            const IconComponent = getModuleIcon(module.title, index);

            return (
              <div
                key={module.id}
                onClick={() => {
                  if (!isLocked) {
                    onNavigate('module-detail', { pathId: currentPath.id, moduleId: module.id });
                  }
                }}
                className={`relative z-10 flex items-start gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                  isCurrent
                    ? 'bg-zinc-50 dark:bg-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-xs cursor-pointer'
                    : isCompleted
                    ? 'bg-white dark:bg-[#080808] border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 cursor-pointer'
                    : 'bg-zinc-50/40 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-850 opacity-50 cursor-not-allowed'
                }`}
              >
                {/* Visual Step Node Badge */}
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-2xs transition-transform ${
                    isCompleted
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700'
                      : isCurrent
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950'
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
                  ) : isLocked ? (
                    <Lock className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <IconComponent className="w-5 h-5" />
                  )}
                </div>

                {/* Module Details Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                      Step {index + 1}
                    </span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-[10px] font-mono uppercase tracking-wider">
                        Up Next
                      </span>
                    )}
                    {isCompleted && (
                      <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-mono uppercase tracking-wider">
                        Completed
                      </span>
                    )}
                    <span className="text-[11px] text-zinc-400 font-mono">
                      • {module.estimatedMinutes} min
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {module.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
                    {module.summary}
                  </p>

                  {/* Micro Objectives preview */}
                  {module.objectives && module.objectives.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {module.objectives.slice(0, 2).map((obj, oIdx) => (
                        <span
                          key={oIdx}
                          className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-600 dark:text-zinc-400"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>{obj}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Action Button */}
                <div className="shrink-0 self-center hidden sm:block">
                  {isCurrent ? (
                    <button className="px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-mono shadow-2xs flex items-center gap-1.5 cursor-pointer">
                      <span>Start</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : isCompleted ? (
                    <button className="px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-600 dark:text-zinc-400 text-xs font-mono flex items-center gap-1 cursor-pointer">
                      <span>Review</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Final Cyber Hero Trophy Node */}
          <div className="relative z-10 flex items-center gap-4 sm:gap-6 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-950 shadow-2xs shrink-0">
              <Trophy className="w-5 h-5 text-amber-400 dark:text-amber-600" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                Finish Line Reward
              </span>
              <h3 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Cyber Hero Badge & Certificate
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Complete all steps in this path to earn the official verifiable Cyber Hero certificate and +500 XP!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
