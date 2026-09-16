import React, { useState } from 'react';
import { ActivePage } from '../types';
import {
  Shield,
  ArrowRight,
  Sparkles,
  Gamepad2,
  Lock,
  Trophy,
  Users,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Terminal,
  ExternalLink,
  Zap,
  Clock,
  Flame,
  HelpCircle,
  Eye,
  Search,
  Bot,
  Swords,
} from 'lucide-react';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { ByteMascot } from '../components/common/ByteMascot';
import { CodexHeroBackground } from '../components/landing/CodexHeroBackground';

interface LandingPageProps {
  onNavigate: (page: ActivePage, params?: { pathId?: string }) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [activeInteractiveTab, setActiveInteractiveTab] = useState<'phishing' | 'password' | 'social'>('phishing');
  const [inspectedClue, setInspectedClue] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-black text-zinc-900 dark:text-white font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800 antialiased overflow-x-hidden transition-colors duration-300">
      {/* 1. Header — Exact ChatGPT / Codex Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200/80 dark:border-white/10 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Brand logo & name */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-hidden"
            >
              {/* OpenAI-style geometric emblem */}
              <div className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
                <Shield className="w-4 h-4 fill-current text-white dark:text-black" />
              </div>
              <span className="font-semibold text-base tracking-tight text-zinc-900 dark:text-white">
                CyberMentor
              </span>
            </button>

            {/* Center navigation links */}
            <nav className="hidden lg:flex items-center gap-6 text-xs text-zinc-600 dark:text-zinc-300">
              <a
                href="#features"
                className="hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                Features
              </a>
              <button
                onClick={() => onNavigate('interactive-scenario')}
                className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
              >
                Scenarios
              </button>
              <button
                onClick={() => onNavigate('learning-paths')}
                className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
              >
                Missions
              </button>
              <button
                onClick={() => onNavigate('multiplayer')}
                className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
              >
                Multiplayer
              </button>
              <button
                onClick={() => onNavigate('leaderboard')}
                className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
              >
                Leaderboard
              </button>
              <button
                onClick={() => onNavigate('achievements')}
                className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
              >
                Rewards
              </button>
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle variant="icon" id="landing-theme-toggle" />

            <button
              id="landing-header-skillcheck-btn"
              onClick={() => onNavigate('skill-check')}
              className="hidden sm:inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-200 dark:border-white/15 hover:border-zinc-300 dark:hover:border-white/30 transition-all cursor-pointer"
            >
              Skill Check
            </button>

            <button
              id="landing-header-launch-btn"
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-medium text-xs transition-colors shadow-xs cursor-pointer"
            >
              <span>Launch App</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section with Authentic Codex Planetary Horizon & Atmospheric Background */}
      <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 overflow-hidden border-b border-zinc-200 dark:border-white/10">
        {/* Authentic Codex Background with planetary arc, cosmic particles, and atmospheric aura */}
        <CodexHeroBackground />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Centered Squircle Icon (exact as in Screenshot 1) */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center shadow-xl dark:shadow-2xl mx-auto mb-6 transition-transform hover:scale-105">
            <Shield className="w-9 h-9 sm:w-11 sm:h-11 fill-current text-white dark:text-black" />
          </div>

          {/* Hero Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.03em] text-zinc-900 dark:text-white mb-4">
            CyberMentor
          </h1>

          {/* Hero Subtitle */}
          <p className="text-base sm:text-xl text-zinc-600 dark:text-zinc-200 font-normal max-w-2xl mx-auto mb-8 leading-relaxed">
            The interactive cyber safety mentor empowering kids to explore, learn, and navigate the web with confidence.
          </p>

          {/* Primary CTA Pill Button (Exact as in Screenshot 1) */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              id="hero-download-btn"
              onClick={() => onNavigate('dashboard')}
              className="rounded-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100 font-medium px-6 py-2.5 text-sm transition-all shadow-md active:scale-98 cursor-pointer inline-flex items-center gap-2"
            >
              <span>Start Learning for Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('skill-check')}
              className="rounded-full bg-white dark:bg-transparent hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white border border-zinc-300 dark:border-white/20 font-medium px-5 py-2.5 text-sm transition-colors cursor-pointer shadow-2xs dark:shadow-none"
            >
              Take 2-Min Skill Check
            </button>
          </div>

          {/* Mac Window Preview Emerging Below Hero (Screenshot 1) */}
          <div className="mt-12 sm:mt-16 max-w-4xl mx-auto rounded-t-2xl border-t border-x border-zinc-300 dark:border-white/15 bg-white/95 dark:bg-zinc-950/90 shadow-2xl overflow-hidden backdrop-blur-md">
            {/* Window Top Controls */}
            <div className="px-4 py-3 bg-zinc-100/90 dark:bg-zinc-900/90 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                <span className="ml-2 text-xs font-mono text-zinc-600 dark:text-zinc-400">CyberMentor // Mission Control</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                <span>AI Sandbox Online</span>
              </div>
            </div>

            {/* Split Preview */}
            <div className="grid grid-cols-12 min-h-[220px] text-left">
              {/* Sidebar */}
              <div className="col-span-4 sm:col-span-3 border-r border-zinc-200 dark:border-white/10 p-4 space-y-3 bg-zinc-50/80 dark:bg-zinc-950/80 text-xs text-zinc-600 dark:text-zinc-400">
                <div className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-200 uppercase tracking-wider">Missions</div>
                <div className="space-y-1.5">
                  <div className="px-2 py-1.5 rounded-md bg-zinc-200/80 dark:bg-white/10 text-zinc-900 dark:text-white font-medium flex items-center justify-between">
                    <span>Gaming Phishing</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded font-semibold">NEW</span>
                  </div>
                  <div className="px-2 py-1.5 rounded-md hover:bg-zinc-200/50 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400">Password Fortress</div>
                  <div className="px-2 py-1.5 rounded-md hover:bg-zinc-200/50 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400">Social Privacy</div>
                  <div className="px-2 py-1.5 rounded-md hover:bg-zinc-200/50 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400">Scareware Popups</div>
                </div>
              </div>

              {/* Main Area */}
              <div className="col-span-8 sm:col-span-9 p-5 flex flex-col justify-between bg-zinc-50/40 dark:bg-zinc-900/50">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">Active Scenario: Free Coins Trap</span>
                    <span className="text-zinc-500 font-mono">Level 1 · Age 8-14</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 text-xs text-zinc-800 dark:text-zinc-300 leading-relaxed font-mono shadow-xs dark:shadow-none">
                    "Hey! Click this link to get 5,000 free Robux right now: http://claim-coins-now.xyz"
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                    <ByteMascot mood="happy" size="xs" animate={false} />
                    <span>Byte is analyzing urgency cues and domain reputation...</span>
                  </div>
                  <button
                    onClick={() => onNavigate('interactive-scenario')}
                    className="px-3 py-1 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black font-medium text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    Investigate &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Big Centered Heading (Screenshot 2) */}
      <section id="features" className="pt-24 pb-16 sm:pt-32 sm:pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.03em] text-zinc-900 dark:text-white">
            The best way to build digital instincts
          </h2>
        </div>
      </section>

      {/* 4. Alternating Feature Section 1: Text on Left, Photo/Preview on Right (Screenshot 2) */}
      <section className="py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-16">
            {/* Left: Text explanation */}
            <div className="lg:col-span-5 text-left space-y-4">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-zinc-900 dark:text-white leading-tight">
                Built to stop real-world online dangers
              </h3>
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
                From sneaky game-coin giveaways and fake Discord mods to malicious download links, CyberMentor reliably completes safety training end to end, empowering kids with practical instincts powered by safe AI simulations.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('interactive-scenario')}
                  className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer group"
                >
                  <span>Explore sample phishing mission</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right: The Photo / Luminous Lavender-Blue Card (Exact style from Screenshot 2) */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl p-6 sm:p-10 relative overflow-hidden bg-gradient-to-br from-[#4e5ea7] via-[#6576c7] to-[#394582] border border-zinc-200/40 dark:border-white/10 shadow-2xl flex items-center justify-center min-h-[380px] sm:min-h-[440px]">
                {/* Floating macOS card matching Screenshot 2 */}
                <div className="w-full max-w-lg rounded-2xl bg-white/95 dark:bg-[#141416]/95 border border-zinc-200/80 dark:border-white/15 p-5 sm:p-6 shadow-2xl backdrop-blur-md text-left space-y-4">
                  {/* User Bubble (Right) */}
                  <div className="flex justify-end">
                    <div className="bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm px-4 py-2.5 rounded-2xl rounded-tr-xs max-w-[85%]">
                      Suspicious DM: "Click here to claim 5,000 free Robux!"
                    </div>
                  </div>

                  {/* Agent Response */}
                  <div className="space-y-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                    <p>
                      I'll analyze the sender address, verify link legitimacy, and test whether this matches known credential theft patterns.
                    </p>
                    <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Thought for 4s
                      </span>
                      <span>·</span>
                      <span>Explored 3 safety rules</span>
                    </div>
                    <p className="text-zinc-700 dark:text-zinc-300">
                      The domain <span className="font-mono text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/40 px-1 py-0.5 rounded">free-robux-claim.xyz</span> is an unauthorized clone. Authentic gaming networks never demand passwords or personal data for prizes.
                    </p>
                  </div>

                  {/* Bottom Action Pill matching "Changed 8 files +23 -16 Review >" */}
                  <div className="pt-2">
                    <button
                      onClick={() => setInspectedClue(!inspectedClue)}
                      className="w-full p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 border border-zinc-200 dark:border-white/10 flex items-center justify-between text-xs transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+50 Safety XP</span>
                        <span className="text-zinc-500 dark:text-zinc-400">· Flagged Fake Link</span>
                      </div>
                      <div className="flex items-center gap-1 text-zinc-800 dark:text-zinc-200 font-medium">
                        <span>{inspectedClue ? 'Clue Verified' : 'Review Clue'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                    {inspectedClue && (
                      <div className="mt-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/30 text-xs text-emerald-900 dark:text-emerald-200 animate-in fade-in duration-200 flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div><strong>Byte's Golden Rule:</strong> Never enter your password outside the official game app!</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Alternating Feature Section 2: Photo/Preview on Left, Text on Right (Screenshot 3) */}
      <section className="py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-16">
            {/* Left: The Photo / Floating macOS window (Exact style from Screenshot 3) */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="rounded-3xl p-6 sm:p-10 relative overflow-hidden bg-gradient-to-br from-[#4e5ea7] via-[#6576c7] to-[#394582] border border-zinc-200/40 dark:border-white/10 shadow-2xl flex items-center justify-center min-h-[380px] sm:min-h-[440px]">
                {/* Floating macOS Window with Sidebar matching Screenshot 3 */}
                <div className="w-full max-w-lg rounded-2xl bg-white/95 dark:bg-[#141416]/95 border border-zinc-200/80 dark:border-white/15 shadow-2xl overflow-hidden backdrop-blur-md text-left">
                  {/* Window Bar */}
                  <div className="px-4 py-3 bg-zinc-100/90 dark:bg-zinc-900/90 border-b border-zinc-200 dark:border-white/10 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>

                  <div className="grid grid-cols-12">
                    {/* Sidebar with Navigation & Pinned Items (Screenshot 3 style) */}
                    <div className="col-span-5 p-4 border-r border-zinc-200 dark:border-white/10 space-y-4 bg-zinc-50/80 dark:bg-zinc-950/60 text-xs text-zinc-600 dark:text-zinc-400">
                      <div>
                        <div className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                          <span>CyberMentor</span>
                          <span className="text-zinc-500 font-mono text-[10px]">AI</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 font-medium">
                        <div className="text-zinc-900 dark:text-zinc-300 flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> New scenario
                        </div>
                        <div className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 flex items-center gap-2">
                          <Search className="w-3.5 h-3.5" /> Search archive
                        </div>
                        <div className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 flex items-center gap-2">
                          <Bot className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> AI Mentor Byte
                        </div>
                        <div className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 flex items-center gap-2">
                          <Swords className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" /> Multiplayer Duels
                        </div>
                      </div>

                      <div className="pt-2 border-t border-zinc-200 dark:border-white/10 space-y-2">
                        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Pinned Missions</div>
                        <div className="space-y-1 text-[11px]">
                          <div className="text-zinc-800 dark:text-zinc-300 font-medium truncate">Spot fake giveaway links</div>
                          <div className="text-zinc-600 dark:text-zinc-400 truncate">Build strong passphrases</div>
                          <div className="text-zinc-600 dark:text-zinc-400 truncate">Social media privacy audit</div>
                        </div>
                      </div>
                    </div>

                    {/* Right Content Space */}
                    <div className="col-span-7 p-5 flex flex-col justify-between space-y-3 bg-zinc-50/30 dark:bg-zinc-900/30">
                      <div>
                        <div className="text-xs font-semibold text-zinc-900 dark:text-white mb-1">Mission Control</div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          Students work through multi-stage investigations, inspecting simulated browser tabs, email headers, and password vaults safely.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-white/10 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-600 dark:text-zinc-400">Readiness Score</span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">92%</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div className="w-[92%] h-full bg-emerald-500 rounded-full" />
                        </div>
                      </div>

                      <button
                        onClick={() => onNavigate('learning-paths')}
                        className="w-full py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black font-medium text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-center cursor-pointer"
                      >
                        Launch Learning Paths &gt;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Text explanation */}
            <div className="lg:col-span-5 text-left space-y-4 order-1 lg:order-2">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-zinc-900 dark:text-white leading-tight">
                Designed for hands-on, mission-based training
              </h3>
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
                CyberMentor is a command center for young cyber explorers. With built-in sandboxes and guided feedback loops, students practice defense strategies across multiple challenges, mastering weeks of digital literacy in hours.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('learning-paths')}
                  className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer group"
                >
                  <span>See all learning paths</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Alternating Feature Section 3: Text on Left, Photo/Preview with Image on Right (Screenshot 4) */}
      <section className="py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-16">
            {/* Left: Text explanation */}
            <div className="lg:col-span-5 text-left space-y-4">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-zinc-900 dark:text-white leading-tight">
                Adapts to how every student learns
              </h3>
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
                With tailored skill modules and supportive mentoring, you can adjust CyberMentor to your learner's age, grade standards, and confidence level. Byte applies adaptive hints consistently, building resilience without fear or frustration.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('skill-check')}
                  className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer group"
                >
                  <span>Try the adaptive skill check</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right: The Photo / Luminous Card with Image inside (Exact style from Screenshot 4) */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl p-6 sm:p-10 relative overflow-hidden bg-gradient-to-br from-[#4e5ea7] via-[#6576c7] to-[#394582] border border-zinc-200/40 dark:border-white/10 shadow-2xl flex items-center justify-center min-h-[380px] sm:min-h-[440px]">
                {/* Floating macOS card with card inside matching Screenshot 4 */}
                <div className="w-full max-w-lg rounded-2xl bg-white/95 dark:bg-[#141416]/95 border border-zinc-200/80 dark:border-white/15 p-5 sm:p-6 shadow-2xl backdrop-blur-md text-left space-y-3.5">
                  {/* User Bubble (Right) */}
                  <div className="flex justify-end">
                    <div className="bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm px-4 py-2.5 rounded-2xl rounded-tr-xs max-w-[85%]">
                      Use the mentor skill to verify my new gaming password
                    </div>
                  </div>

                  {/* Agent Response */}
                  <div className="space-y-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Worked for 2s &gt;</span>
                    </div>
                    <p>
                      I'll apply password strength heuristics and entropy standards to evaluate your passphrase.
                    </p>
                    <p className="text-zinc-700 dark:text-zinc-300">
                      Done — <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">"Dragon-Skates-Midnight#99"</span> is rated 100/100 unbreakable. It takes quantum supercomputers over 4,000 years to crack!
                    </p>
                  </div>

                  {/* Visual Photo Card inside (Matching Screenshot 4) */}
                  <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-white/15 bg-zinc-50 dark:bg-gradient-to-b dark:from-zinc-900 dark:to-black p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 dark:from-emerald-500/30 dark:to-blue-500/30 border border-emerald-500/40 dark:border-emerald-400/40 flex items-center justify-center shrink-0">
                      <Shield className="w-9 h-9 text-emerald-600 dark:text-emerald-400 fill-emerald-500/20" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-white">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Shield Certified Unbreakable</span>
                      </div>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        Entropy: 84 bits · 4 memorized random words · Symbols included.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Alternating Feature Section 4: Photo on Left, Text on Right (Multiplayer & Social Learning) */}
      <section className="py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-16">
            {/* Left: The Photo / Multiplayer Duel Arena Card */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="rounded-3xl p-6 sm:p-10 relative overflow-hidden bg-gradient-to-br from-[#4e5ea7] via-[#6576c7] to-[#394582] border border-zinc-200/40 dark:border-white/10 shadow-2xl flex items-center justify-center min-h-[380px] sm:min-h-[440px]">
                <div className="w-full max-w-lg rounded-2xl bg-white/95 dark:bg-[#141416]/95 border border-zinc-200/80 dark:border-white/15 p-5 sm:p-6 shadow-2xl backdrop-blur-md text-left space-y-4">
                  {/* Header of Duel Card */}
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-white/10 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="font-semibold text-zinc-900 dark:text-white">LIVE 1V1 DUEL ARENA</span>
                    </div>
                    <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">00:45 REMAINING</span>
                  </div>

                  {/* Player Matchup */}
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/80 border border-emerald-500/30">
                      <div className="text-xs font-semibold text-zinc-900 dark:text-white">You (Scout)</div>
                      <div className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">320 pts</div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-1">
                        <span>Streak: 3x</span>
                        <Flame className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-white/10">
                      <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Alex (CyberNinja)</div>
                      <div className="text-lg font-mono font-bold text-zinc-700 dark:text-zinc-300">280 pts</div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400">Streak: 2x</div>
                    </div>
                  </div>

                  {/* Active Question */}
                  <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 text-xs text-zinc-700 dark:text-zinc-300 space-y-2">
                    <div className="text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-400">Fast Decision Required:</div>
                    <p className="font-medium text-zinc-900 dark:text-white">
                      "Email: Your school account will be deleted in 10 minutes unless you verify now."
                    </p>
                  </div>

                  {/* Action Buzzers */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => onNavigate('multiplayer')}
                      className="py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 dark:bg-red-500/20 dark:hover:bg-red-500/30 text-red-600 dark:text-red-300 border border-red-500/30 dark:border-red-500/40 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Phishing Trap</span>
                    </button>
                    <button
                      onClick={() => onNavigate('multiplayer')}
                      className="py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 dark:border-emerald-500/40 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Safe Message</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Text explanation */}
            <div className="lg:col-span-5 text-left space-y-4 order-1 lg:order-2">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-zinc-900 dark:text-white leading-tight">
                Designed for multi-agent workflows and team play
              </h3>
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
                CyberMentor transforms safety into a shared adventure. Kids can practice solo or challenge classmates in lightning speed duels, unlocking collaborative achievements and healthy friendly competition.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('multiplayer')}
                  className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer group"
                >
                  <span>Enter the multiplayer arena</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Call to Action (Codex Style) */}
      <section className="py-24 sm:py-32 border-t border-zinc-200 dark:border-white/10 relative overflow-hidden text-center">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-gradient-to-t from-[#4957a4]/20 dark:from-[#4957a4]/30 via-transparent to-transparent blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center mx-auto shadow-xl">
            <Shield className="w-8 h-8 fill-current text-white dark:text-black" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] text-zinc-900 dark:text-white">
            Start your cyber safety journey today
          </h2>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto font-normal">
            Join thousands of kids learning how to explore the internet safely, smartly, and with total confidence.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="rounded-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100 font-medium px-6 py-3 text-sm transition-all shadow-md active:scale-98 cursor-pointer flex items-center gap-2"
            >
              <span>Launch CyberMentor</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('auth')}
              className="rounded-full border border-zinc-300 dark:border-white/20 text-zinc-800 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/10 font-medium px-6 py-3 text-sm transition-colors cursor-pointer bg-white dark:bg-transparent shadow-2xs dark:shadow-none"
            >
              Sign In to Save Progress
            </button>
          </div>
        </div>
      </section>

      {/* 9. Minimalist Codex-Style Footer */}
      <footer className="py-12 border-t border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-black text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center">
              <Shield className="w-3 h-3 fill-current text-white dark:text-black" />
            </div>
            <span className="font-semibold text-zinc-900 dark:text-white">CyberMentor</span>
            <span className="text-zinc-400 dark:text-zinc-600">·</span>
            <span>Interactive Cyber Safety for Kids</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('skill-check')}
              className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Skill Check
            </button>
            <button
              onClick={() => onNavigate('learning-paths')}
              className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Missions
            </button>
            <button
              onClick={() => onNavigate('multiplayer')}
              className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Duels
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Preferences
            </button>
          </div>

          <div className="text-zinc-500">
            © 2026 CyberMentor AI. Built in AI Studio.
          </div>
        </div>
      </footer>
    </div>
  );
};
