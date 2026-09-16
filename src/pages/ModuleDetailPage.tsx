import React, { useState } from 'react';
import { ActivePage, LearningPath } from '../types';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  FileText,
  ShieldCheck,
  RotateCcw,
  Check,
  Copy,
  Terminal,
  PlayCircle,
  Lightbulb,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  HelpCircle,
  Shield,
  Eye,
} from 'lucide-react';
import { ByteMascot } from '../components/common/ByteMascot';

interface ModuleDetailPageProps {
  paths: LearningPath[];
  selectedPathId: string;
  selectedModuleId: string;
  onNavigate: (page: ActivePage, params?: { pathId?: string; moduleId?: string; scenarioId?: string }) => void;
  onUpdateModuleProgress: (pathId: string, moduleId: string, delta: number) => void;
}

export const ModuleDetailPage: React.FC<ModuleDetailPageProps> = ({
  paths,
  selectedPathId,
  selectedModuleId,
  onNavigate,
  onUpdateModuleProgress,
}) => {
  const currentPath = paths.find((p) => p.id === selectedPathId) || paths[0];
  const currentModule =
    currentPath?.modules.find((m) => m.id === selectedModuleId) ||
    currentPath?.modules[2] ||
    currentPath?.modules[0];

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showDeepDive, setShowDeepDive] = useState(false);

  const sections = [
    { id: 0, title: 'How Tricks Work', icon: BookOpen, tag: 'Level 1: Story' },
    { id: 1, title: 'Spotting Fake Links', icon: Eye, tag: 'Level 2: Clues' },
    { id: 2, title: 'What To Do In Real Life', icon: ShieldCheck, tag: 'Level 3: Safety Action' },
    { id: 3, title: 'Checklist & Quick Quiz', icon: RotateCcw, tag: 'Level 4: Quiz' },
  ];

  const handleNextSection = () => {
    if (activeSectionIndex < sections.length - 1) {
      setActiveSectionIndex((prev) => prev + 1);
      if (currentModule) {
        onUpdateModuleProgress(currentPath.id, currentModule.id, 20);
      }
    } else {
      if (currentModule) {
        onUpdateModuleProgress(currentPath.id, currentModule.id, 40);
      }
      onNavigate('interactive-scenario', { scenarioId: 'scenario-univ-phish' });
    }
  };

  const copySnippet = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1800);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto text-[#243047] font-sans">
      {/* Top Breadcrumb & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <button
            onClick={() => onNavigate('learning-paths', { pathId: currentPath.id })}
            className="hover:text-[#4F7CFF] flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentPath.title}</span>
          </button>
          <span>/</span>
          <span className="text-[#243047]">
            Lesson {currentModule?.moduleNumber || 3}: {currentModule?.title}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
          <span>PROGRESS: {Math.round(((activeSectionIndex + 1) / sections.length) * 100)}%</span>
          <div className="w-24 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-[#4F7CFF] rounded-full transition-all duration-300"
              style={{ width: `${Math.round(((activeSectionIndex + 1) / sections.length) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Section Steps / Table of Contents (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 border-b border-slate-100 pb-2">
              <span className="uppercase tracking-wider">LESSON STEPS</span>
              <span>
                {activeSectionIndex + 1} of {sections.length}
              </span>
            </div>

            <nav className="space-y-2">
              {sections.map((sec, idx) => {
                const Icon = sec.icon;
                const isCurrent = activeSectionIndex === idx;
                const isDone = activeSectionIndex > idx;

                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSectionIndex(idx)}
                    className={`w-full text-left p-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all ${
                      isCurrent
                        ? 'bg-blue-50 text-[#4F7CFF] border-2 border-[#4F7CFF] shadow-xs'
                        : isDone
                        ? 'bg-emerald-50/50 text-emerald-800 border border-emerald-200/60'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                          isCurrent
                            ? 'bg-[#4F7CFF] text-white'
                            : isDone
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <span className="block truncate">{sec.title}</span>
                        <span className="text-[10px] opacity-70 block font-normal">{sec.tag}</span>
                      </div>
                    </div>
                    {isDone && <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </nav>

            {/* Byte's Lesson Tip */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <ByteMascot mood="thinking" size="xs" />
                <span className="font-extrabold text-amber-900">Byte's Secret Tip:</span>
              </div>
              <p className="text-amber-800 leading-relaxed text-[11px] font-medium">
                "Whenever a message says YOU MUST DO THIS IN 10 MINUTES OR YOUR ACCOUNT IS DELETED, that rush is almost always the scammer's trick!"
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Reading & Interactive Playground (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
            {/* Section 0: How Tricks Work */}
            {activeSectionIndex === 0 && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-black uppercase tracking-wider">
                    LEVEL 1: SIMPLE EXPLANATION
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-[#243047] mt-1">
                    How Scammers Try to Trick You
                  </h2>
                </div>

                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  Imagine someone wearing a fake mustache knocking on your front door and saying: <em>"Quick! Hand over your house key right now or the roof will fall!"</em> That's exactly what a scam email does on your computer or phone.
                </p>

                {/* Friendly Comparison Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1.5">
                    <span className="text-base">🚨</span>
                    <strong className="text-rose-900 font-bold block text-sm">The Trickster's Goal</strong>
                    <p className="text-rose-800 leading-relaxed">
                      To make you panic so you enter your password on a fake website that looks almost real.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                    <span className="text-base">🛡️</span>
                    <strong className="text-emerald-900 font-bold block text-sm">Your Cyber Superpower</strong>
                    <p className="text-emerald-800 leading-relaxed">
                      Taking 5 seconds to pause, breathe, and inspect where the link really leads before tapping.
                    </p>
                  </div>
                </div>

                {/* Progressive Disclosure: Want to know how this works? */}
                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setShowDeepDive(!showDeepDive)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Want to know how this works behind the scenes?</span>
                    {showDeepDive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showDeepDive && (
                    <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in duration-200 text-xs text-slate-700 font-mono">
                      <div className="flex items-center justify-between text-[11px] text-slate-600 font-bold">
                        <span className="flex items-center gap-1.5 font-mono">
                          <Terminal className="w-3.5 h-3.5 text-[#4F7CFF]" />
                          RAW EMAIL HEADER (SMTP / DKIM)
                        </span>
                        <button
                          onClick={() => copySnippet('From: "Campus Helpdesk" <fake-account@attacker-domain.org>\nDKIM-Signature: v=1; d=attacker-domain.org\nAuthentication-Results: spf=softfail')}
                          className="hover:text-blue-600 flex items-center gap-1 text-[10px]"
                        >
                          {copiedCode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="p-3 rounded-xl bg-[#0a0f1d] text-slate-200 overflow-x-auto text-[11px] leading-relaxed">
                        <code>
{`Received: from mail-relay.attacker.net [198.51.100.24]
From: "Campus Security Desk" <admin@univ-sso-auth.org>
Authentication-Results: spf=softfail (school.edu: unapproved IP)
DKIM-Signature: v=1; d=univ-sso-auth.org (spoofed domain)`}
                        </code>
                      </pre>
                      <p className="font-sans text-xs text-slate-600 leading-normal">
                        <strong>Technical note:</strong> Anyone can type any display name like "Campus Security". The mail server envelope headers reveal who really sent the packet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Section 1: Spotting Fake Links */}
            {activeSectionIndex === 1 && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider">
                    LEVEL 2: REAL CLUES
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-[#243047] mt-1">
                    How to Read Web Addresses Like a Detective
                  </h2>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">
                  Web links are like postal mail addresses. Scammers often slip in extra words or sneaky fake endings. Compare these two examples:
                </p>

                {/* Visual Real vs Fake Address Breakdown */}
                <div className="space-y-3 text-xs font-mono">
                  <div className="p-4 rounded-2xl bg-emerald-50/80 border-2 border-emerald-300 space-y-1 text-emerald-950">
                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider block">
                      ✅ REAL OFFICIAL SCHOOL WEBSITE:
                    </span>
                    <span className="text-sm font-bold text-emerald-800 block">
                      https://login.university.edu/dashboard
                    </span>
                    <span className="text-[11px] font-sans text-emerald-700 block">
                      Notice the main domain ends right before the first slash: <strong>university.edu</strong>
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-50/80 border-2 border-rose-300 space-y-1 text-rose-950">
                    <span className="text-[10px] font-black text-rose-700 uppercase tracking-wider block">
                      🚨 TRICKSTER FAKE LINK:
                    </span>
                    <span className="text-sm font-bold text-rose-800 block">
                      https://university.edu.login-portal-auth.com/verify
                    </span>
                    <span className="text-[11px] font-sans text-rose-700 block">
                      Aha! Look right before the first slash: the real website is actually <strong>login-portal-auth.com</strong>!
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
                  <strong className="block font-bold">🔍 Detective Secret:</strong>
                  <p className="leading-relaxed">
                    On a computer, hover your mouse over any link without clicking. Look at the bottom corner of your screen to see where it REALLY goes!
                  </p>
                </div>
              </div>
            )}

            {/* Section 2: What To Do In Real Life */}
            {activeSectionIndex === 2 && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-black uppercase tracking-wider">
                    LEVEL 3: PRACTICAL ACTION
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-[#243047] mt-1">
                    What To Do If This Happens To You
                  </h2>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">
                  If you ever receive an urgent message saying your game account, school login, or social media is locked:
                </p>

                {/* 3 Step Action Rules */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="w-8 h-8 rounded-full bg-[#4F7CFF] text-white font-bold flex items-center justify-center text-sm">
                      1
                    </span>
                    <strong className="font-bold text-slate-800 block text-sm">Do Not Click</strong>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      Never click the big button or link inside the strange email or chat message.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="w-8 h-8 rounded-full bg-[#40C98A] text-white font-bold flex items-center justify-center text-sm">
                      2
                    </span>
                    <strong className="font-bold text-slate-800 block text-sm">Go Out-Of-Band</strong>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      Open a new tab and type the official website address yourself, or open the app directly.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="w-8 h-8 rounded-full bg-[#8B6CFF] text-white font-bold flex items-center justify-center text-sm">
                      3
                    </span>
                    <strong className="font-bold text-slate-800 block text-sm">Tell an Adult / IT</strong>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      Show your parent or teacher. They can help report the scam so other students stay safe too!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Checklist & Quick Quiz */}
            {activeSectionIndex === 3 && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-black uppercase tracking-wider">
                    LEVEL 4: QUICK CHECK
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-[#243047] mt-1">
                    Can You Spot the Safety Rule?
                  </h2>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">
                  Test what you've learned! Select the smartest choice below:
                </p>

                {/* Friendly Quiz Card */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <p className="font-bold text-slate-800 text-sm">
                    You get an email claiming your school password will expire in 2 hours unless you click "Update Now". What is the best thing to do?
                  </p>

                  <div className="space-y-2">
                    {[
                      { id: 0, text: 'Click the link immediately so you do not get locked out.', correct: false },
                      { id: 1, text: 'Open a new tab, visit your school portal directly, and ask your teacher.', correct: true },
                      { id: 2, text: 'Reply with your current password to prove it is really you.', correct: false },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setQuizAnswer(opt.id)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all ${
                          quizAnswer === opt.id
                            ? opt.correct
                              ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                              : 'bg-rose-100 border-rose-400 text-rose-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'
                        }`}
                      >
                        {opt.text}
                      </button>
                    ))}
                  </div>

                  {quizAnswer !== null && (
                    <div className="p-3 rounded-xl font-medium text-xs">
                      {quizAnswer === 1 ? (
                        <div className="text-emerald-700 flex items-center gap-2">
                          <ByteMascot mood="excited" size="xs" />
                          <span>🎉 Perfect! Visiting the official site directly keeps your account 100% safe.</span>
                        </div>
                      ) : (
                        <div className="text-rose-700 flex items-center gap-2">
                          <ByteMascot mood="caution" size="xs" />
                          <span>Oops! Clicking the link gives the scammer a chance to steal your login. Try option 2!</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation & Action Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => setActiveSectionIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeSectionIndex === 0}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-30 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => onNavigate('interactive-scenario', { scenarioId: 'scenario-univ-phish' })}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#8B6CFF] font-bold text-xs border border-purple-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Try Mission</span>
                </button>

                <button
                  onClick={handleNextSection}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#4F7CFF] hover:bg-[#3D6CE6] text-white font-bold text-xs shadow-xs hover:shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <span>
                    {activeSectionIndex === sections.length - 1
                      ? 'Launch Mission'
                      : 'Next Step'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
