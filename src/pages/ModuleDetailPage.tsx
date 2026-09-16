import React, { useState, useEffect } from 'react';
import { ActivePage, LearningPath } from '../types';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ShieldCheck,
  RotateCcw,
  Check,
  X,
  Copy,
  Terminal,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Eye,
  CheckCircle2,
  XCircle,
  Trophy,
  PartyPopper,
  ExternalLink,
  AlertTriangle,
  Shield,
} from 'lucide-react';
import { ByteMascot } from '../components/common/ByteMascot';
import confetti from 'canvas-confetti';

interface ModuleDetailPageProps {
  paths: LearningPath[];
  selectedPathId: string;
  selectedModuleId: string;
  onNavigate: (page: ActivePage, params?: { pathId?: string; moduleId?: string; scenarioId?: string }) => void;
  onUpdateModuleProgress: (pathId: string, moduleId: string, delta: number) => void;
}

interface QuizOption {
  id: number;
  label: string;
  text: string;
  correct: boolean;
  explanation: string;
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
  const [interactiveLinkChoice, setInteractiveLinkChoice] = useState<'real' | 'fake' | null>(null);
  const [showDeepDive, setShowDeepDive] = useState(false);

  // Reset states when the module changes
  useEffect(() => {
    setActiveSectionIndex(0);
    setQuizAnswer(null);
    setInteractiveLinkChoice(null);
    setShowDeepDive(false);
  }, [selectedModuleId]);

  // Determine the next lesson (module)
  const currentModuleIndex = currentPath?.modules.findIndex((m) => m.id === currentModule?.id) ?? -1;
  const nextModule =
    currentModuleIndex >= 0 && currentModuleIndex < currentPath.modules.length - 1
      ? currentPath.modules[currentModuleIndex + 1]
      : null;

  const currentPathIndex = paths.findIndex((p) => p.id === currentPath?.id) ?? -1;
  const nextPath =
    !nextModule && currentPathIndex >= 0 && currentPathIndex < paths.length - 1
      ? paths[currentPathIndex + 1]
      : null;
  const nextModuleFromNextPath = nextPath?.modules?.[0] || null;

  const targetNextLesson = nextModule || nextModuleFromNextPath;
  const targetNextPath = nextModule ? currentPath : nextPath;

  const sections = [
    { id: 0, title: 'How Tricks Work', icon: BookOpen, tag: 'Level 1: Story' },
    { id: 1, title: 'Spotting Fake Clues', icon: Eye, tag: 'Level 2: Clues' },
    { id: 2, title: 'What To Do In Real Life', icon: ShieldCheck, tag: 'Level 3: Safety Action' },
    { id: 3, title: 'Checklist & Quick Quiz', icon: RotateCcw, tag: 'Level 4: Quiz' },
  ];

  // Dynamic quiz tailored to the current module topic
  const getModuleQuiz = (): { question: string; options: QuizOption[] } => {
    if (currentModule?.id.includes('password') || currentModule?.title.toLowerCase().includes('password')) {
      return {
        question: 'Which of these passwords is the strongest and safest for your gaming or school account?',
        options: [
          {
            id: 0,
            label: 'A',
            text: 'P@ssw0rd123! (Contains common replacement symbols found in hacker wordlists)',
            correct: false,
            explanation: 'Attackers use dictionary lists that instantly guess common substitutions like P@ssw0rd or Qwerty! Length is much more powerful than simple symbol swaps.',
          },
          {
            id: 1,
            label: 'B',
            text: 'solar-panda-guitar-cookie (A 4-word random passphrase of 26 characters)',
            correct: true,
            explanation: 'Outstanding! Long passphrases made of 4 unrelated words have massive mathematical entropy and take supercomputers centuries to crack, while staying easy for you to remember!',
          },
          {
            id: 2,
            label: 'C',
            text: 'MySchool2026! (Same password used across all your personal and school accounts)',
            correct: false,
            explanation: 'Reusing the same password everywhere means if just one site has a data leak, hackers immediately unlock all your other accounts (credential stuffing)!',
          },
        ],
      };
    }

    if (currentModule?.id.includes('privacy') || currentModule?.title.toLowerCase().includes('privacy')) {
      return {
        question: 'A newly downloaded free camera filter app asks for full access to your GPS Location and Contacts. What is the safest choice?',
        options: [
          {
            id: 0,
            label: 'A',
            text: 'Tap "Allow Always" so you never get prompted again.',
            correct: false,
            explanation: 'Granting constant GPS and Contacts permissions allows the app to collect and sell your real-world location history and contact list to third-party ad brokers.',
          },
          {
            id: 1,
            label: 'B',
            text: 'Deny GPS & Contacts. A camera filter only needs photo/camera permissions to work.',
            correct: true,
            explanation: 'Spot on! The rule of least privilege: only grant permissions an app genuinely needs to operate. A photo filter has no real reason to access your contact book or live GPS!',
          },
          {
            id: 2,
            label: 'C',
            text: 'Post your location on social media to see if friends are nearby.',
            correct: false,
            explanation: 'Broadcasting your real-time location reveals when you are away from home and allows strangers to track your physical whereabouts.',
          },
        ],
      };
    }

    // Default: Phishing & Social Engineering
    return {
      question: 'You get an urgent message: "Your school account will be deleted in 10 minutes unless you click here to update your password!" What is the smartest move?',
      options: [
        {
          id: 0,
          label: 'A',
          text: 'Click the link immediately so you do not lose your homework and account.',
          correct: false,
          explanation: 'Artificial panic ("in 10 minutes!") is the #1 trick scammers use to stop you from thinking clearly. Clicking sends you straight to a fake credentials-stealing form!',
        },
        {
          id: 1,
          label: 'B',
          text: 'Open a fresh browser tab, go to your official school website directly, and ask your teacher.',
          correct: true,
          explanation: 'Perfect detective work! Never follow links inside urgent messages. Always go directly to the trusted official address or check with a teacher or parent.',
        },
        {
          id: 2,
          label: 'C',
          text: 'Reply to the sender with your current password to prove you are the real owner.',
          correct: false,
          explanation: 'Never send your password over email or chat! Real IT teams and companies will NEVER ask for your password.',
        },
      ],
    };
  };

  const currentQuiz = getModuleQuiz();

  const handleSelectQuizOption = (optId: number) => {
    setQuizAnswer(optId);
    const selected = currentQuiz.options.find((o) => o.id === optId);
    if (selected?.correct) {
      confetti({ particleCount: 65, spread: 60, origin: { y: 0.7 } });
      if (currentModule) {
        onUpdateModuleProgress(currentPath.id, currentModule.id, 40);
      }
    }
  };

  const handleNextSection = () => {
    if (activeSectionIndex < sections.length - 1) {
      setActiveSectionIndex((prev) => prev + 1);
      if (currentModule) {
        onUpdateModuleProgress(currentPath.id, currentModule.id, 20);
      }
    } else {
      // Completed final level -> Move to NEXT LESSON!
      handleProceedToNextLesson();
    }
  };

  const handleProceedToNextLesson = () => {
    if (currentModule) {
      onUpdateModuleProgress(currentPath.id, currentModule.id, 100);
    }
    confetti({ particleCount: 80, spread: 75, origin: { y: 0.6 } });

    if (targetNextLesson && targetNextPath) {
      onNavigate('module-detail', {
        pathId: targetNextPath.id,
        moduleId: targetNextLesson.id,
      });
      setActiveSectionIndex(0);
      setQuizAnswer(null);
      setInteractiveLinkChoice(null);
    } else {
      // All lessons in all paths completed!
      onNavigate('learning-paths', { pathId: currentPath.id });
    }
  };

  const copySnippet = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1800);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200">
      {/* Top Breadcrumb & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <button
            onClick={() => onNavigate('learning-paths', { pathId: currentPath.id })}
            className="hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{currentPath.title}</span>
          </button>
          <span>/</span>
          <span className="text-zinc-900 dark:text-zinc-100 font-medium font-sans">
            Lesson {currentModule?.moduleNumber || 1}: {currentModule?.title}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
          <span>PROGRESS: {Math.round(((activeSectionIndex + 1) / sections.length) * 100)}%</span>
          <div className="w-24 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700">
            <div
              className="h-full bg-zinc-900 dark:bg-white rounded-full transition-all duration-300"
              style={{ width: `${Math.round(((activeSectionIndex + 1) / sections.length) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Section Steps / Table of Contents (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 border-b border-zinc-100 dark:border-zinc-850 pb-2">
              <span className="uppercase tracking-wider">Lesson Steps</span>
              <span>
                {activeSectionIndex + 1} of {sections.length}
              </span>
            </div>

            <nav className="space-y-1.5">
              {sections.map((sec, idx) => {
                const Icon = sec.icon;
                const isCurrent = activeSectionIndex === idx;
                const isDone = activeSectionIndex > idx;

                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSectionIndex(idx)}
                    className={`w-full text-left p-3 rounded-2xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 shadow-2xs font-semibold'
                        : isDone
                        ? 'bg-zinc-50/50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-850'
                        : 'bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isCurrent
                            ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950'
                            : isDone
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                            : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <span className="block truncate">{sec.title}</span>
                        <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 block">{sec.tag}</span>
                      </div>
                    </div>
                    {isDone && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </nav>

            {/* Byte's Lesson Tip */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <ByteMascot mood="thinking" size="xs" animate={false} />
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 font-mono text-[11px] uppercase tracking-wider">Byte's Tip:</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-xs">
                "Whenever a message demands YOU MUST DO THIS IN 10 MINUTES OR YOUR ACCOUNT IS GONE, that artificial rush is almost always the scammer's trick!"
              </p>
            </div>

            {/* Next Lesson Preview Banner in Sidebar */}
            {targetNextLesson && (
              <div className="p-3.5 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  <span>Up Next</span>
                  <span>Lesson {targetNextLesson.moduleNumber}</span>
                </div>
                <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                  {targetNextLesson.title}
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                  <span>~{targetNextLesson.estimatedMinutes} min</span>
                  <span>•</span>
                  <span>{targetNextLesson.totalSteps} steps</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Reading & Interactive Playground (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
            {/* Section 0: How Tricks Work */}
            {activeSectionIndex === 0 && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-mono uppercase tracking-wider">
                    Level 1: Simple Explanation
                  </span>
                  <h2 className="text-xl sm:text-2xl font-semibold -tracking-[0.02em] text-zinc-900 dark:text-zinc-100 mt-1">
                    How Scammers Try to Trick You
                  </h2>
                </div>

                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
                  Imagine someone wearing a fake mustache knocking on your front door and saying: <em>"Quick! Hand over your house key right now or the roof will collapse!"</em> That's exactly what a scam message or deceptive email does on your computer or phone.
                </p>

                {/* Friendly Comparison Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <strong className="text-zinc-900 dark:text-zinc-100 font-semibold block text-sm">The Trickster's Goal</strong>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      To make you panic so you enter your login on a clone website that looks almost identical to the real one.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <strong className="text-zinc-900 dark:text-zinc-100 font-semibold block text-sm">Your Cyber Superpower</strong>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Taking 5 seconds to pause, breathe, and inspect where the link actually leads before tapping.
                    </p>
                  </div>
                </div>

                {/* Progressive Disclosure: How this works behind the scenes */}
                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <button
                    onClick={() => setShowDeepDive(!showDeepDive)}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>How this works behind the scenes</span>
                    {showDeepDive ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showDeepDive && (
                    <div className="mt-3 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 animate-in fade-in duration-200 text-xs text-zinc-300 font-mono">
                      <div className="flex items-center justify-between text-[11px] text-zinc-400">
                        <span className="flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-zinc-300" />
                          RAW EMAIL HEADER (SMTP / DKIM)
                        </span>
                        <button
                          onClick={() => copySnippet('From: "Campus Helpdesk" <fake-account@attacker-domain.org>\nDKIM-Signature: v=1; d=attacker-domain.org\nAuthentication-Results: spf=softfail')}
                          className="hover:text-white flex items-center gap-1 text-[10px] cursor-pointer"
                        >
                          {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="p-3 rounded-xl bg-black text-zinc-300 overflow-x-auto text-[11px] leading-relaxed border border-zinc-800">
                        <code>
{`Received: from mail-relay.attacker.net [198.51.100.24]
From: "Campus Security Desk" <admin@univ-sso-auth.org>
Authentication-Results: spf=softfail (school.edu: unapproved IP)
DKIM-Signature: v=1; d=univ-sso-auth.org (spoofed domain)`}
                        </code>
                      </pre>
                      <p className="font-sans text-xs text-zinc-400 leading-normal">
                        <strong className="text-zinc-200 font-mono text-[11px]">Technical note:</strong> Anyone can type any display name like "Campus Security". The mail server envelope headers reveal who really sent the packet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Section 1: Spotting Fake Clues with Interactive Option Selection */}
            {activeSectionIndex === 1 && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-mono uppercase tracking-wider">
                    Level 2: Detective Clues
                  </span>
                  <h2 className="text-xl sm:text-2xl font-semibold -tracking-[0.02em] text-zinc-900 dark:text-zinc-100 mt-1">
                    How to Read Web Addresses Like a Detective
                  </h2>
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
                  Web links are like postal mail addresses. Scammers often slip in extra words or sneaky fake endings. Try the detective challenge below!
                </p>

                {/* Interactive Practice Option Selector */}
                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-indigo-500" />
                      <span>Interactive Challenge: Tap the SAFE Official Link</span>
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">Pick 1 option</span>
                  </div>

                  <div className="space-y-2.5">
                    {/* Option 1: Fake Link */}
                    <button
                      onClick={() => setInteractiveLinkChoice('fake')}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs font-mono transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        interactiveLinkChoice === 'fake'
                          ? 'border-rose-500 dark:border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.15)] ring-1 ring-rose-500/30'
                          : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                            interactiveLinkChoice === 'fake'
                              ? 'bg-rose-500 text-white'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                          }`}
                        >
                          {interactiveLinkChoice === 'fake' ? <X className="w-3.5 h-3.5" /> : '1'}
                        </div>
                        <span className="break-all font-medium">https://university.edu.login-portal-auth.com/verify</span>
                      </div>
                      {interactiveLinkChoice === 'fake' && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 flex items-center gap-1 shadow-xs">
                          <X className="w-3 h-3" /> Fake Scam Link
                        </span>
                      )}
                    </button>

                    {/* Option 2: Real Link */}
                    <button
                      onClick={() => {
                        setInteractiveLinkChoice('real');
                        confetti({ particleCount: 45, spread: 50, origin: { y: 0.65 } });
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs font-mono transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        interactiveLinkChoice === 'real'
                          ? 'border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30'
                          : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                            interactiveLinkChoice === 'real'
                              ? 'bg-emerald-500 text-white'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                          }`}
                        >
                          {interactiveLinkChoice === 'real' ? <Check className="w-3.5 h-3.5" /> : '2'}
                        </div>
                        <span className="break-all font-medium">https://login.university.edu/dashboard</span>
                      </div>
                      {interactiveLinkChoice === 'real' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 flex items-center gap-1 shadow-xs">
                          <Check className="w-3 h-3" /> Safe Official
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Immediate Visual Feedback */}
                  {interactiveLinkChoice !== null && (
                    <div
                      className={`p-3.5 rounded-xl border text-xs leading-relaxed transition-all flex items-start gap-2.5 ${
                        interactiveLinkChoice === 'real'
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
                          : 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-500/40 text-rose-900 dark:text-rose-200'
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {interactiveLinkChoice === 'real' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        )}
                      </div>
                      <div className="space-y-1 font-sans">
                        <strong className="block font-semibold">
                          {interactiveLinkChoice === 'real'
                            ? 'Spot On! That is the genuine link.'
                            : 'Danger: Look right before the first single slash!'}
                        </strong>
                        <p className="text-[11px] leading-normal opacity-90">
                          {interactiveLinkChoice === 'real'
                            ? 'The true home domain is "university.edu". The words before it ("login.") are just subdomains belonging to the school.'
                            : 'Even though it has "university.edu" written in it, the actual root domain before the slash is "login-portal-auth.com"! The scammer owns that domain.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 space-y-1">
                  <strong className="block font-mono text-[11px] uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Detective Rule of Thumb:</strong>
                  <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                    On a computer, hover your mouse cursor over any link without clicking. Look at the bottom-left corner of your browser window to see where it REALLY goes!
                  </p>
                </div>
              </div>
            )}

            {/* Section 2: What To Do In Real Life */}
            {activeSectionIndex === 2 && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-mono uppercase tracking-wider">
                    Level 3: Practical Action
                  </span>
                  <h2 className="text-xl sm:text-2xl font-semibold -tracking-[0.02em] text-zinc-900 dark:text-zinc-100 mt-1">
                    What To Do If This Happens To You
                  </h2>
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  If you ever receive a surprise message saying your game account, school portal, or social media is locked:
                </p>

                {/* 3 Step Action Rules */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                    <span className="w-7 h-7 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-mono font-bold flex items-center justify-center text-xs">
                      1
                    </span>
                    <strong className="font-semibold text-zinc-900 dark:text-zinc-100 block text-sm">Do Not Click</strong>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[11px]">
                      Never click the big button or link inside the strange email, DM, or chat message.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                    <span className="w-7 h-7 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-mono font-bold flex items-center justify-center text-xs">
                      2
                    </span>
                    <strong className="font-semibold text-zinc-900 dark:text-zinc-100 block text-sm">Go Direct</strong>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[11px]">
                      Open a new tab and type the official website address yourself, or open the official installed app.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                    <span className="w-7 h-7 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-mono font-bold flex items-center justify-center text-xs">
                      3
                    </span>
                    <strong className="font-semibold text-zinc-900 dark:text-zinc-100 block text-sm">Tell an Adult / IT</strong>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[11px]">
                      Show your parent or teacher. They can help report the scam so other students stay safe too!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Final Level - Checklist & Quick Quiz with High-Visibility Correct/Wrong States */}
            {activeSectionIndex === 3 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[10px] font-mono uppercase tracking-wider font-semibold">
                      Final Level 4: Mastery Check
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">Complete to unlock next lesson</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold -tracking-[0.02em] text-zinc-900 dark:text-zinc-100 mt-1">
                    Can You Spot the Safety Rule?
                  </h2>
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Test what you've learned to complete this lesson! Select your answer below:
                </p>

                {/* Enhanced Visual Quiz Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs shadow-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                      Q
                    </span>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100 text-sm sm:text-base leading-snug">
                      {currentQuiz.question}
                    </p>
                  </div>

                  {/* Options with High-Contrast Clear Visual States */}
                  <div className="space-y-3 pt-1">
                    {currentQuiz.options.map((opt) => {
                      const isSelected = quizAnswer === opt.id;
                      const isCorrect = opt.correct;

                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectQuizOption(opt.id)}
                          className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? isCorrect
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-400 text-emerald-950 dark:text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.2)] ring-2 ring-emerald-500/20'
                                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 dark:border-rose-400 text-rose-950 dark:text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.2)] ring-2 ring-rose-500/20'
                              : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 font-mono text-xs font-bold transition-colors ${
                                isSelected
                                  ? isCorrect
                                    ? 'bg-emerald-500 text-white shadow-xs'
                                    : 'bg-rose-500 text-white shadow-xs'
                                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                              }`}
                            >
                              {isSelected ? (
                                isCorrect ? (
                                  <Check className="w-4 h-4 stroke-[3]" />
                                ) : (
                                  <X className="w-4 h-4 stroke-[3]" />
                                )
                              ) : (
                                opt.label
                              )}
                            </div>
                            <span className="leading-relaxed">{opt.text}</span>
                          </div>

                          {/* Visual Tag Indicating Status */}
                          <div className="shrink-0">
                            {isSelected && isCorrect && (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                                <Check className="w-3.5 h-3.5 stroke-[3]" /> Correct
                              </span>
                            )}
                            {isSelected && !isCorrect && (
                              <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                                <X className="w-3.5 h-3.5 stroke-[3]" /> Incorrect
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* High Visibility Feedback Card */}
                  {quizAnswer !== null && (
                    <div
                      className={`p-4 sm:p-5 rounded-2xl border text-xs transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
                        currentQuiz.options[quizAnswer]?.correct
                          ? 'bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-500/50 text-emerald-950 dark:text-emerald-100 shadow-sm'
                          : 'bg-rose-50/90 dark:bg-rose-950/30 border-rose-500/50 text-rose-950 dark:text-rose-100 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="shrink-0">
                          {currentQuiz.options[quizAnswer]?.correct ? (
                            <ByteMascot mood="excited" size="xs" animate={false} />
                          ) : (
                            <ByteMascot mood="caution" size="xs" animate={false} />
                          )}
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-mono text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                currentQuiz.options[quizAnswer]?.correct
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-rose-500 text-white'
                              }`}
                            >
                              {currentQuiz.options[quizAnswer]?.correct ? 'Spot On!' : 'Watch Out!'}
                            </span>
                            <span className="font-semibold text-xs sm:text-sm">
                              {currentQuiz.options[quizAnswer]?.correct
                                ? 'You nailed this cybersecurity rule!'
                                : 'That choice carries real danger!'}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm leading-relaxed opacity-95">
                            {currentQuiz.options[quizAnswer]?.explanation}
                          </p>

                          {!currentQuiz.options[quizAnswer]?.correct && (
                            <p className="text-[11px] font-mono font-medium text-rose-700 dark:text-rose-300 pt-1">
                              Tip: Try selecting another option above to learn the safest habit!
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Lesson Completed Celebration Callout (Gives instant Next Lesson button) */}
                {quizAnswer !== null && currentQuiz.options[quizAnswer]?.correct && (
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-transparent border border-emerald-500/40 dark:border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                          <span>Lesson Complete!</span>
                          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                            +100% Mastered
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">
                          {targetNextLesson
                            ? `Ready for Lesson ${targetNextLesson.moduleNumber}: ${targetNextLesson.title}?`
                            : 'You have conquered all lessons in this path!'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleProceedToNextLesson}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-medium text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
                    >
                      <span>
                        {targetNextLesson ? `Next Lesson: ${targetNextLesson.title}` : 'Finish Path'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Navigation & Action Bar: Automatically Offers Next Lesson instead of Launch Mission */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => setActiveSectionIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeSectionIndex === 0}
                className="w-full sm:w-auto px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-850 disabled:opacity-30 font-mono text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {/* Final Level gives option of Next Lesson instead of Launch Mission */}
              {activeSectionIndex === sections.length - 1 ? (
                <button
                  onClick={handleProceedToNextLesson}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-mono text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span className="font-semibold">
                    {targetNextLesson ? `Next Lesson: ${targetNextLesson.title}` : 'Complete Path'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleNextSection}
                  className="w-full sm:w-auto px-5 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-mono text-xs shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
