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
    if (t.includes('password') || t.includes('auth')) return '🔐';
    if (t.includes('phish') || t.includes('social')) return '🎣';
    if (t.includes('privacy') || t.includes('leak')) return '👀';
    if (t.includes('share') || t.includes('device')) return '📱';
    if (t.includes('browse') || t.includes('network') || t.includes('wifi')) return '🌐';
    if (t.includes('ethics') || t.includes('responsible')) return '⚖️';
    const fallbacks = ['🌱', '🔍', '🛡️', '⚡', '🏆'];
    return fallbacks[index % fallbacks.length];
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto text-[#243047] font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Map className="w-5 h-5 text-[#40C98A]" />
            <span className="text-xs font-black text-[#40C98A] uppercase tracking-wider">
              YOUR ADVENTURE MAP
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#243047]">
            Learning Adventures
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            Follow the journey path, earn stars, and unlock new cyber powers one mission at a time!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Map Progress: {currentPath?.progress || 0}%</span>
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
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                isSelected
                  ? 'bg-[#4F7CFF] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <span>{path.id === 'cyber-safety-fundamentals' ? '🌱' : '🛡️'}</span>
              <span>{path.title}</span>
              <span className="opacity-80 text-[10px]">({path.progress}%)</span>
            </button>
          );
        })}
      </div>

      {/* Main Adventure Board */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Adventure Summary Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-emerald-50 to-indigo-50 border border-blue-100">
          <div className="flex items-center gap-4">
            <ByteMascot mood="excited" size="md" />
            <div>
              <span className="text-xs font-black text-[#4F7CFF] uppercase tracking-wider block">
                CURRENT EXPEDITION
              </span>
              <h2 className="text-lg sm:text-xl font-black text-[#243047]">
                {currentPath.title}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5 max-w-lg">
                {currentPath.description}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-slate-600" />
            <span>{currentPath.estimatedTime} journey</span>
          </div>
        </div>

        {/* Visual Map Journey Tree (Nodes with connectors) */}
        <div className="relative py-4 space-y-4">
          {/* Subtle center path spine */}
          <div className="absolute top-8 bottom-8 left-8 sm:left-10 w-1 bg-gradient-to-b from-emerald-400 via-blue-400 to-slate-200 rounded-full -z-0" />

          {currentPath.modules.map((module, index) => {
            const isCompleted = module.isCompleted;
            const isCurrent = !isCompleted && (index === 0 || currentPath.modules[index - 1]?.isCompleted);
            const isLocked = !isCompleted && !isCurrent;
            const icon = getModuleIcon(module.title, index);

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
                    ? 'bg-gradient-to-r from-white to-blue-50/70 border-2 border-[#4F7CFF] shadow-md ring-4 ring-blue-100 cursor-pointer scale-[1.01]'
                    : isCompleted
                    ? 'bg-white border-slate-200/90 hover:border-emerald-300 hover:shadow-xs cursor-pointer'
                    : 'bg-slate-50/70 border-slate-200/60 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Visual Step Node Badge */}
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-xs transition-transform ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-400'
                      : isCurrent
                      ? 'bg-[#4F7CFF] text-white animate-bounce'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                  ) : isLocked ? (
                    <Lock className="w-5 h-5 text-slate-600" />
                  ) : (
                    <span>{icon}</span>
                  )}
                </div>

                {/* Module Details Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider">
                      STEP {index + 1}
                    </span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider">
                        ★ UP NEXT
                      </span>
                    )}
                    {isCompleted && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
                        COMPLETED
                      </span>
                    )}
                    <span className="text-[11px] text-slate-600 font-medium">
                      • {module.estimatedMinutes} min
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#243047]">
                    {module.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                    {module.summary}
                  </p>

                  {/* Micro Objectives preview */}
                  {module.objectives && module.objectives.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {module.objectives.slice(0, 2).map((obj, oIdx) => (
                        <span
                          key={oIdx}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-medium text-slate-600"
                        >
                          ✓ {obj}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Action Button */}
                <div className="shrink-0 self-center hidden sm:block">
                  {isCurrent ? (
                    <button className="px-4 py-2 rounded-xl bg-[#4F7CFF] hover:bg-[#3D6CE6] text-white text-xs font-bold shadow-xs flex items-center gap-1.5">
                      <span>Start</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : isCompleted ? (
                    <button className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold flex items-center gap-1">
                      <span>Review</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Final Cyber Hero Trophy Node */}
          <div className="relative z-10 flex items-center gap-4 sm:gap-6 p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 shadow-sm">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-3xl text-white shadow-xs shrink-0">
              🏆
            </div>
            <div className="flex-1">
              <span className="text-[11px] font-black text-amber-700 uppercase tracking-wider block">
                FINISH LINE REWARD
              </span>
              <h3 className="text-base sm:text-lg font-black text-[#243047]">
                Cyber Hero Badge & Certificate
              </h3>
              <p className="text-xs text-slate-600">
                Complete all steps in this path to earn the official verifiable Cyber Hero certificate and +500 XP!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
