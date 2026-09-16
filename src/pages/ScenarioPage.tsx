import React, { useState, useEffect } from 'react';
import { ActivePage, ScenarioItem, ScenarioOption } from '../types';
import {
  Mail,
  Smartphone,
  ArrowRight,
  HelpCircle,
  Shield,
  Search,
  Globe,
  AlertCircle,
  Flag,
  Trash2,
  CheckCircle2,
  Sparkles,
  Shuffle,
  FileCode,
  Lock,
} from 'lucide-react';
import { ByteMascot } from '../components/common/ByteMascot';

interface ScenarioPageProps {
  scenarios: ScenarioItem[];
  selectedScenarioId: string;
  onSelectScenarioId: (id: string) => void;
  onSubmitDecision: (scenario: ScenarioItem, option: ScenarioOption, hintsUsed?: number) => void;
  onRequestNextMission?: () => void;
  onNavigate: (page: ActivePage) => void;
}

export const ScenarioPage: React.FC<ScenarioPageProps> = ({
  scenarios,
  selectedScenarioId,
  onSelectScenarioId,
  onSubmitDecision,
  onRequestNextMission,
  onNavigate,
}) => {
  const currentScenario =
    scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showClues, setShowClues] = useState(false);

  // Reset local state when scenario changes
  useEffect(() => {
    setSelectedOptionId(null);
    setShowHint(false);
    setShowClues(false);
  }, [selectedScenarioId]);

  const selectedOption = currentScenario.options.find((o) => o.id === selectedOptionId);

  const handleSubmit = () => {
    if (!selectedOption) return;
    const hintsUsed = (showHint ? 1 : 0) + (showClues ? 1 : 0);
    onSubmitDecision(currentScenario, selectedOption, hintsUsed);
  };

  // Scaffold level labels
  const getScaffoldBadge = (level: number = 1) => {
    switch (level) {
      case 1:
        return { label: 'Level 1: Rookie Scout', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 2:
        return { label: 'Level 2: Detective', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 3:
        return { label: 'Level 3: Investigator', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 4:
        return { label: 'Level 4: Guardian', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 5:
        return { label: 'Level 5: Master Agent', color: 'bg-rose-100 text-rose-800 border-rose-200' };
      default:
        return { label: `Level ${level}`, color: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  // Option icon helper
  const getOptionIcon = (opt: ScenarioOption) => {
    const text = opt.text.toLowerCase();
    if (text.includes('report') || text.includes('forward') || text.includes('security')) {
      return { icon: Flag, color: 'text-amber-500 bg-amber-50' };
    }
    if (text.includes('delete') || text.includes('block') || text.includes('ignore') || text.includes('decline')) {
      return { icon: Trash2, color: 'text-rose-500 bg-rose-50' };
    }
    if (text.includes('inspect') || text.includes('verify') || text.includes('check') || text.includes('call') || text.includes('bookmark')) {
      return { icon: Search, color: 'text-blue-500 bg-blue-50' };
    }
    return { icon: HelpCircle, color: 'text-purple-500 bg-purple-50' };
  };

  const scaffold = getScaffoldBadge(currentScenario.scaffoldLevel);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200">
      {/* Top Header - No countdown timer, clean and welcoming */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-mono uppercase tracking-wider">
              Your Mission
            </span>
            <span className="px-2.5 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {scaffold.label}
            </span>
            <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
              ~{currentScenario.estimatedMinutes || 3} min • Self-paced
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-semibold -tracking-[0.03em] text-zinc-900 dark:text-zinc-100 mt-2">
            {currentScenario.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            {currentScenario.context}
          </p>
        </div>

        {/* Action: Switch to another adaptive mission if curious */}
        {onRequestNextMission && (
          <button
            onClick={onRequestNextMission}
            className="px-3.5 py-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-300 text-xs font-mono transition-colors shrink-0 flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
            title="Pick another challenge adapted to your level"
          >
            <Shuffle className="w-3.5 h-3.5 text-zinc-500" />
            <span>Try Another Mission</span>
          </button>
        )}
      </div>

      {/* Main 2-Column Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Simulated Artifact Window (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-[#080808] rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden">
            {/* Artifact Window Header */}
            <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700 inline-block" />
                <span className="text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300 ml-2">
                  {currentScenario.environmentType === 'email' && 'Webmail Inbox'}
                  {currentScenario.environmentType === 'sms' && 'Text Message (SMS)'}
                  {currentScenario.environmentType === 'social_media' && 'Direct Chat Message'}
                  {currentScenario.environmentType === 'browser' && 'Webpage Prompt'}
                  {currentScenario.environmentType === 'system_alert' && 'Device Security Alert'}
                </span>
              </div>

              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                {currentScenario.category}
              </span>
            </div>

            {/* Artifact Body */}
            <div className="p-6 space-y-4">
              {/* Sender info card if present */}
              {(currentScenario.simulatedArtifact.sender || currentScenario.simulatedArtifact.senderAddress) && (
                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400 dark:text-zinc-500 font-mono text-[11px]">From:</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {currentScenario.simulatedArtifact.sender || 'Unknown Sender'}
                      </span>
                    </div>
                    <span className="text-zinc-400 dark:text-zinc-500 text-[11px] font-mono">
                      {currentScenario.simulatedArtifact.timestamp || 'Just now'}
                    </span>
                  </div>

                  {currentScenario.simulatedArtifact.senderAddress && (
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                      &lt;{currentScenario.simulatedArtifact.senderAddress}&gt;
                    </div>
                  )}

                  {currentScenario.simulatedArtifact.subject && (
                    <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                      <span className="text-zinc-400 dark:text-zinc-500 font-mono text-[11px] mr-2">Subject:</span>
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">
                        {currentScenario.simulatedArtifact.subject}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Message / Alert Content */}
              <div className="p-4 rounded-2xl bg-zinc-50/60 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-line font-normal">
                {currentScenario.simulatedArtifact.body}
              </div>

              {/* Attached file warning if present */}
              {currentScenario.simulatedArtifact.attachedFile && (
                <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <FileCode className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                    <div>
                      <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wide block">
                        Attached Download File
                      </span>
                      <code className="text-xs font-mono font-medium text-zinc-900 dark:text-zinc-100">
                        {currentScenario.simulatedArtifact.attachedFile}
                      </code>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg shrink-0">
                    Inspect extension
                  </span>
                </div>
              )}

              {/* Embedded Link in message if present */}
              {currentScenario.simulatedArtifact.targetUrl && (
                <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wide block">
                      Link in Message
                    </span>
                    <code className="text-xs font-mono font-medium text-zinc-900 dark:text-zinc-100 break-all">
                      {currentScenario.simulatedArtifact.targetUrl}
                    </code>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progressive Clues Inspector Tool (Hidden by default, opened on demand) */}
          <div className="bg-white dark:bg-[#080808] rounded-3xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-zinc-500" />
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Investigative Clues
                </span>
              </div>
              <button
                onClick={() => setShowClues(!showClues)}
                className="text-xs font-mono text-zinc-900 dark:text-zinc-100 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{showClues ? 'Hide Clues' : 'Inspect Details'}</span>
              </button>
            </div>

            {showClues && (
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-xs text-zinc-700 dark:text-zinc-300 space-y-2 animate-in fade-in duration-200">
                {currentScenario.toolReveals?.checkSender && (
                  <div>
                    <strong className="text-zinc-900 dark:text-zinc-100 font-mono text-[11px] block mb-0.5">Sender Analysis:</strong>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">{currentScenario.toolReveals.checkSender}</p>
                  </div>
                )}
                {currentScenario.toolReveals?.checkLink && (
                  <div className="pt-1.5 border-t border-zinc-200 dark:border-zinc-800">
                    <strong className="text-zinc-900 dark:text-zinc-100 font-mono text-[11px] block mb-0.5">Link / Code Analysis:</strong>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">{currentScenario.toolReveals.checkLink}</p>
                  </div>
                )}
                {currentScenario.toolReveals?.clue && (
                  <div className="pt-1.5 border-t border-zinc-200 dark:border-zinc-800">
                    <strong className="text-zinc-900 dark:text-zinc-100 font-mono text-[11px] block mb-0.5">Cyber Detective Hint:</strong>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">{currentScenario.toolReveals.clue}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: "What would you do?" Decision Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-[#080808] rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-[10px] font-mono uppercase tracking-wider border border-zinc-200 dark:border-zinc-800">
                  Your Decision
                </span>
                <span className="font-mono text-xs text-zinc-400">
                  Select 1 action
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold -tracking-[0.02em] text-zinc-900 dark:text-zinc-100 mt-2">
                What would you do?
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {currentScenario.prompt}
              </p>
            </div>

            {/* Answer Options as Large Friendly Cards */}
            <div className="space-y-2.5">
              {currentScenario.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const { icon: Icon } = getOptionIcon(opt);

                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 group cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-2xs'
                        : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSelected
                          ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950'
                          : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100 block leading-snug">
                        {opt.text}
                      </span>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                        isSelected
                          ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950'
                          : 'border-zinc-300 dark:border-zinc-700'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3 h-3 text-white dark:text-zinc-950" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Ask Byte For A Hint Toggle Button */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-850">
              <button
                onClick={() => setShowHint(!showHint)}
                className="w-full py-2.5 px-4 rounded-full bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ByteMascot mood="thinking" size="xs" animate={false} />
                <span>{showHint ? "Hide Byte's Hint" : "Need a hint? Ask Byte"}</span>
              </button>

              {showHint && (
                <div className="mt-3 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-xs space-y-1 animate-in fade-in duration-150">
                  <span className="font-mono text-[10px] uppercase text-zinc-500 block">Byte Whispers</span>
                  <p className="leading-relaxed text-zinc-700 dark:text-zinc-300 text-xs">
                    {currentScenario.hint ||
                      'Take a close look at who sent the message and what they want you to click or give away. The safest choice is always to check the official school portal directly!'}
                  </p>
                </div>
              )}
            </div>

            {/* Submit Action Button */}
            <button
              onClick={handleSubmit}
              disabled={!selectedOptionId}
              className="w-full py-3 px-6 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 disabled:opacity-40 text-white dark:text-zinc-950 font-medium text-xs sm:text-sm transition-all shadow-2xs active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Submit My Decision</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
