import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Mail, AlertTriangle, Check, Search, Shield, Zap } from 'lucide-react';
import { ByteMascot } from '../common/ByteMascot';

interface HeroProductPreviewProps {
  onStartSkillCheck: () => void;
  onExplorePaths: () => void;
}

export const HeroProductPreview: React.FC<HeroProductPreviewProps> = ({
  onStartSkillCheck,
  onExplorePaths,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<'link' | 'inspect' | 'direct' | null>(null);

  return (
    <div className="w-full rounded-3xl border-2 border-blue-200/80 bg-white overflow-hidden text-[#243047] text-left shadow-lg">
      {/* Top Header Bar */}
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
          <span className="text-xs font-bold text-slate-700 ml-2">
            🎯 MINI-MISSION PREVIEW: The Sneaky School Email
          </span>
        </div>
        <span className="text-[11px] font-black text-[#4F7CFF] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
          TRY IT NOW
        </span>
      </div>

      {/* Main Interactive Demo Area */}
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Simulated Email (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                <Mail className="w-4 h-4 text-[#4F7CFF]" />
                <span>Inbox Preview</span>
              </div>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                ⚠️ Needs Review
              </span>
            </div>

            {/* Email Header Inspector */}
            <div className="text-xs bg-white p-3 rounded-xl border border-slate-200 space-y-1">
              <div>
                <span className="text-slate-400 font-bold mr-1">From:</span>
                <span className="text-[#243047] font-bold">School IT Helpdesk</span>
                <span className="text-slate-600 font-mono text-[11px] ml-1">&lt;support@school-login-update.cc&gt;</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold mr-1">Subject:</span>
                <span className="text-amber-800 font-bold">[URGENT] Account closing in 2 hours!</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pt-1 font-medium">
              "Your student password has expired! Click below immediately or you won't be able to turn in homework today."
            </p>

            {/* Interactive Decision Options */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wide block">
                What would you click?
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedChoice('link')}
                  className={`p-3 rounded-2xl text-left border-2 transition-all ${
                    selectedChoice === 'link'
                      ? 'bg-rose-50 border-rose-400 text-rose-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs">⚠️ Click the link</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Quickly sign in</div>
                </button>

                <button
                  onClick={() => setSelectedChoice('inspect')}
                  className={`p-3 rounded-2xl text-left border-2 transition-all ${
                    selectedChoice === 'inspect'
                      ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs">🔍 Inspect address</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Look at the domain</div>
                </button>

                <button
                  onClick={() => setSelectedChoice('direct')}
                  className={`p-3 rounded-2xl text-left border-2 transition-all ${
                    selectedChoice === 'direct'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs">🚩 Report & use bookmark</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Safe direct login</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Feedback from Byte */}
        <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs">
              <span className="font-black text-slate-600 uppercase tracking-wide">
                BYTE'S FEEDBACK
              </span>
              <span className="text-[11px] font-bold text-[#4F7CFF]">AI MENTOR</span>
            </div>

            {selectedChoice === null ? (
              <div className="py-4 text-center text-xs text-slate-500 space-y-2">
                <ByteMascot mood="thinking" size="sm" />
                <p className="font-medium">
                  Click an option above to see what Byte would say!
                </p>
              </div>
            ) : selectedChoice === 'link' ? (
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-rose-600 font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Uh-oh! That was a trap!</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  The domain ends in <code className="bg-rose-100 text-rose-800 px-1 py-0.5 rounded font-mono">.cc</code>, not your school’s address. A scammer created this fake website to steal passwords!
                </p>
              </div>
            ) : selectedChoice === 'inspect' ? (
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#4F7CFF] font-bold">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Great detective work!</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  You noticed that the email came from <code>school-login-update.cc</code>. Your real school uses <code>.edu</code> or <code>.org</code>. Well spotted!
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Master move! +10 Smart Score</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  By opening your real school website from your trusted bookmarks, scammers have zero chance of fooling you!
                </p>
              </div>
            )}
          </div>

          {/* Cyber Smart Score Box */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
                CYBER SMART SCORE
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-black text-[#243047]">
                  {selectedChoice === 'link' ? '65' : selectedChoice === 'inspect' ? '88' : selectedChoice === 'direct' ? '94' : '80'}
                </span>
                <span className="text-xs font-bold text-slate-500">/ 100</span>
                {selectedChoice && (
                  <span
                    className={`text-xs font-black ${
                      selectedChoice === 'link' ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {selectedChoice === 'link' ? '-15' : selectedChoice === 'inspect' ? '+8' : '+14'}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onStartSkillCheck}
              className="px-4 py-2 rounded-xl bg-[#4F7CFF] hover:bg-[#3D6CE6] text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <span>Play More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
