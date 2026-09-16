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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto text-[#243047] font-sans">
      {/* Top Header - No countdown timer, clean and welcoming */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#4F7CFF] text-[11px] font-black uppercase tracking-wider">
              🎯 YOUR MISSION
            </span>
            <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-extrabold ${scaffold.color}`}>
              {scaffold.label}
            </span>
            <span className="text-xs font-bold text-slate-500">
              ⏱️ ~{currentScenario.estimatedMinutes || 3} min • Self-paced
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-[#243047] mt-1.5">
            {currentScenario.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {currentScenario.context}
          </p>
        </div>

        {/* Action: Switch to another adaptive mission if curious */}
        {onRequestNextMission && (
          <button
            onClick={onRequestNextMission}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 self-start sm:self-center"
            title="Pick another challenge adapted to your level"
          >
            <Shuffle className="w-3.5 h-3.5 text-slate-600" />
            <span>Try Another Mission</span>
          </button>
        )}
      </div>

      {/* Main 2-Column Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Simulated Artifact Window (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm overflow-hidden">
            {/* Artifact Window Header */}
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                <span className="text-xs font-bold text-slate-700 ml-2">
                  {currentScenario.environmentType === 'email' && '📬 Webmail Inbox'}
                  {currentScenario.environmentType === 'sms' && '💬 Text Message (SMS)'}
                  {currentScenario.environmentType === 'social_media' && '💬 Direct Chat Message'}
                  {currentScenario.environmentType === 'browser' && '🌐 Webpage Prompt'}
                  {currentScenario.environmentType === 'system_alert' && '⚙️ Device Security Alert'}
                </span>
              </div>

              <span className="text-[11px] font-bold text-slate-500">
                {currentScenario.category}
              </span>
            </div>

            {/* Artifact Body */}
            <div className="p-6 space-y-4">
              {/* Sender info card if present */}
              {(currentScenario.simulatedArtifact.sender || currentScenario.simulatedArtifact.senderAddress) && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-bold">From:</span>
                      <span className="font-extrabold text-[#243047]">
                        {currentScenario.simulatedArtifact.sender || 'Unknown Sender'}
                      </span>
                    </div>
                    <span className="text-slate-500 text-[11px]">
                      {currentScenario.simulatedArtifact.timestamp || 'Just now'}
                    </span>
                  </div>

                  {currentScenario.simulatedArtifact.senderAddress && (
                    <div className="text-[11px] text-slate-500 font-mono">
                      &lt;{currentScenario.simulatedArtifact.senderAddress}&gt;
                    </div>
                  )}

                  {currentScenario.simulatedArtifact.subject && (
                    <div className="pt-2 border-t border-slate-200/60">
                      <span className="text-slate-500 font-bold mr-2">Subject:</span>
                      <span className="font-bold text-slate-800">
                        {currentScenario.simulatedArtifact.subject}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Message / Alert Content */}
              <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-200 text-sm leading-relaxed text-slate-800 whitespace-pre-line font-medium">
                {currentScenario.simulatedArtifact.body}
              </div>

              {/* Attached file warning if present */}
              {currentScenario.simulatedArtifact.attachedFile && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <FileCode className="w-5 h-5 text-rose-600" />
                    <div>
                      <span className="text-[10px] font-black uppercase text-rose-700 tracking-wide block">
                        ATTACHED DOWNLOAD FILE
                      </span>
                      <code className="text-xs font-mono font-bold text-rose-900">
                        {currentScenario.simulatedArtifact.attachedFile}
                      </code>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-rose-200/70 text-rose-800 rounded-lg shrink-0">
                    Inspect extension
                  </span>
                </div>
              )}

              {/* Embedded Link in message if present */}
              {currentScenario.simulatedArtifact.targetUrl && (
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase text-amber-800 tracking-wide block">
                      LINK IN MESSAGE
                    </span>
                    <code className="text-xs font-mono font-bold text-amber-900 break-all">
                      {currentScenario.simulatedArtifact.targetUrl}
                    </code>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progressive Clues Inspector Tool (Hidden by default, opened on demand) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🕵️</span>
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  INVESTIGATIVE CLUES
                </span>
              </div>
              <button
                onClick={() => setShowClues(!showClues)}
                className="text-xs font-bold text-[#4F7CFF] hover:text-[#3D6CE6] flex items-center gap-1"
              >
                <span>{showClues ? 'Hide Clues' : '🔍 Inspect Details'}</span>
              </button>
            </div>

            {showClues && (
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700 space-y-2 animate-in fade-in duration-200">
                {currentScenario.toolReveals?.checkSender && (
                  <div>
                    <strong className="text-blue-900 font-bold block mb-0.5">Sender Analysis:</strong>
                    <p className="text-slate-700 leading-relaxed">{currentScenario.toolReveals.checkSender}</p>
                  </div>
                )}
                {currentScenario.toolReveals?.checkLink && (
                  <div className="pt-1.5 border-t border-blue-200/60">
                    <strong className="text-blue-900 font-bold block mb-0.5">Link / Code Analysis:</strong>
                    <p className="text-slate-700 leading-relaxed">{currentScenario.toolReveals.checkLink}</p>
                  </div>
                )}
                {currentScenario.toolReveals?.clue && (
                  <div className="pt-1.5 border-t border-blue-200/60">
                    <strong className="text-blue-900 font-bold block mb-0.5">Cyber Detective Hint:</strong>
                    <p className="text-slate-700 leading-relaxed">{currentScenario.toolReveals.clue}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: "What would you do?" Decision Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border-2 border-blue-200/80 p-6 shadow-sm space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-black uppercase tracking-wider">
                  YOUR DECISION
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Select 1 action
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#243047] mt-1.5">
                What would you do?
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                {currentScenario.prompt}
              </p>
            </div>

            {/* Answer Options as Large Friendly Cards */}
            <div className="space-y-2.5">
              {currentScenario.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const { icon: Icon, color } = getOptionIcon(opt);

                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 group ${
                      isSelected
                        ? 'bg-blue-50/80 border-[#4F7CFF] shadow-xs scale-[1.01]'
                        : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSelected ? 'bg-[#4F7CFF] text-white' : color
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-[#243047] block leading-snug">
                        {opt.text}
                      </span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${
                        isSelected
                          ? 'border-[#4F7CFF] bg-[#4F7CFF]'
                          : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Ask Byte For A Hint Toggle Button */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowHint(!showHint)}
                className="w-full py-2.5 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-xs font-bold text-amber-800 transition-colors flex items-center justify-center gap-2"
              >
                <ByteMascot mood="thinking" size="xs" />
                <span>{showHint ? 'Hide Byte’s Hint' : '💡 Need a hint? Ask Byte'}</span>
              </button>

              {showHint && (
                <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 text-xs text-amber-900 space-y-1 animate-in fade-in duration-150">
                  <span className="font-black block">💡 Byte Whispers:</span>
                  <p className="leading-relaxed text-[11px]">
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
              className="w-full py-3.5 px-6 rounded-2xl bg-[#4F7CFF] hover:bg-[#3D6CE6] disabled:opacity-40 text-white font-black text-sm transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Submit My Decision</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
