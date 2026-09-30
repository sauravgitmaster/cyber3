import React, { useState } from 'react';
import { ShieldCheck, Lock, EyeOff, Info, X, CheckCircle2 } from 'lucide-react';

interface AnalyticsPrivacyNoticeProps {
  hasDismissed: boolean;
  onDismiss: () => void;
  isLoggedIn?: boolean;
  userEmail?: string;
}

export const AnalyticsPrivacyNotice: React.FC<AnalyticsPrivacyNoticeProps> = ({
  hasDismissed,
  onDismiss,
  isLoggedIn = false,
  userEmail,
}) => {
  const [showModal, setShowModal] = useState(false);

  if (hasDismissed && !showModal) {
    return null;
  }

  return (
    <>
      {/* Discreet Banner Toast */}
      {!hasDismissed && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-40 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-950/10 text-zinc-900 dark:text-zinc-100 flex items-start gap-3 select-none">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>

            <div className="flex-1 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Privacy & Visitor Notice
                </span>
                <button
                  onClick={onDismiss}
                  className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                  title="Dismiss notice"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[11px] sm:text-xs">
                CyberMentor uses privacy-first session telemetry to improve missions. We{' '}
                <strong className="text-zinc-900 dark:text-zinc-200 font-medium">never</strong> record passwords, keystrokes, or sensitive personal data.
              </p>

              <div className="flex items-center gap-2 pt-1.5">
                <button
                  onClick={onDismiss}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium text-[11px] hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                >
                  Got It
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-2.5 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium text-[11px] transition-colors cursor-pointer"
                >
                  Privacy Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Privacy Transparency Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-zinc-900 dark:text-zinc-100">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">Privacy & Analytics Commitment</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Child-safe & COPPA-aligned design</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
                <div className="font-semibold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>What We Collect (To Improve Learning)</span>
                </div>
                <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-zinc-600 dark:text-zinc-400">
                  <li>Session start time, duration, and active heartbeat</li>
                  <li>Page navigation routes (e.g. Missions, Play, Learn)</li>
                  <li>Device category (Desktop, Tablet, or Mobile)</li>
                  <li>Audience mode selection (Kids Mode vs Adult Mode)</li>
                  {isLoggedIn ? (
                    <li>
                      Account linkage: Your session is associated with <span className="font-mono text-zinc-900 dark:text-zinc-200">{userEmail}</span> to preserve mission progress.
                    </li>
                  ) : (
                    <li>Anonymous random Visitor ID (e.g. anon_...) for logged-out visitors.</li>
                  )}
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-2">
                <div className="font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1.5 text-xs">
                  <EyeOff className="w-4 h-4" />
                  <span>What We NEVER Collect or Store</span>
                </div>
                <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-rose-700/80 dark:text-rose-400/80">
                  <li>No passwords, secret credentials, or login inputs</li>
                  <li>No keystrokes, microphone, or camera tracking</li>
                  <li>No third-party advertising or commercial ad-trackers</li>
                  <li>No cross-site tracking cookies</li>
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                  onDismiss();
                }}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity"
              >
                Accept & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
