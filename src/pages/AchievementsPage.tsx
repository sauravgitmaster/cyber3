import React from 'react';
import { ActivePage, BadgeItem, CertificateItem, UserProfile } from '../types';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ExternalLink,
  Compass,
  EyeOff,
  Flame,
  Scale,
  KeyRound,
  Crosshair,
  ShieldAlert,
  Sparkles,
  Zap,
  Trophy,
} from 'lucide-react';
import { ByteMascot } from '../components/common/ByteMascot';

interface AchievementsPageProps {
  user: UserProfile;
  badges: BadgeItem[];
  certificates: CertificateItem[];
  onOpenCertificate: (cert: CertificateItem) => void;
  onNavigate: (page: ActivePage) => void;
}

export const AchievementsPage: React.FC<AchievementsPageProps> = ({
  user,
  badges,
  certificates,
  onOpenCertificate,
  onNavigate,
}) => {
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-6 h-6" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-6 h-6" />;
      case 'EyeOff':
        return <EyeOff className="w-6 h-6" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-6 h-6" />;
      case 'Scale':
        return <Scale className="w-6 h-6" />;
      case 'Flame':
        return <Flame className="w-6 h-6" />;
      case 'KeyRound':
        return <KeyRound className="w-6 h-6" />;
      case 'Crosshair':
        return <Crosshair className="w-6 h-6" />;
      default:
        return <Award className="w-6 h-6" />;
    }
  };

  const xpProgressPercent = Math.round((user.currentXP / user.nextLevelXP) * 100);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-zinc-400" />
            <span>Trophy Room & Rewards</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold -tracking-[0.03em] text-zinc-900 dark:text-zinc-100">
            Badges & Certificates
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Collect cool badges and earn real cyber certificates as you complete missions!
          </p>
        </div>

        {/* Level Banner */}
        <div className="px-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-950 font-mono text-xs font-semibold shadow-2xs">
            0{user.level}
          </div>
          <div>
            <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
              {user.levelTitle}
            </div>
            <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              {user.currentXP} / {user.nextLevelXP} XP
            </div>
          </div>
        </div>
      </div>

      {/* Level XP Progress Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-3">
            <ByteMascot mood="excited" size="sm" animate={false} />
            <div>
              <span className="text-[10px] font-mono uppercase text-zinc-400 dark:text-zinc-500 block">
                Current Cyber Rank
              </span>
              <span className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Level 0{user.level} — {user.levelTitle}
              </span>
            </div>
          </div>
          <span className="text-xs font-mono text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800">
            {user.currentXP.toLocaleString()} / {user.nextLevelXP.toLocaleString()} XP ({xpProgressPercent}%)
          </span>
        </div>

        <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-zinc-200 dark:border-zinc-800">
          <div
            className="h-full bg-zinc-900 dark:bg-white rounded-full transition-all duration-500"
            style={{ width: `${xpProgressPercent}%` }}
          />
        </div>

        <div className="flex justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400">
          <span>{user.nextLevelXP - user.currentXP} XP until next rank</span>
          <span className="text-zinc-600 dark:text-zinc-300 font-sans font-normal">Earn XP from missions and challenges</span>
        </div>
      </div>

      {/* Badges Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
              Collection
            </span>
            <h2 className="text-xl font-semibold -tracking-[0.02em] text-zinc-900 dark:text-zinc-100">Cyber Badges</h2>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            {badges.filter((b) => b.unlocked).length} of {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((b) => {
            const isUnlocked = b.unlocked;

            return (
              <div
                key={b.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-3 relative overflow-hidden ${
                  isUnlocked
                    ? 'bg-white dark:bg-[#080808] border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 shadow-xs'
                    : 'bg-zinc-50/50 dark:bg-zinc-950 border-dashed border-zinc-200 dark:border-zinc-800 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-transform hover:scale-105 ${
                      isUnlocked
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-2xs'
                        : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    {isUnlocked ? getBadgeIcon(b.iconName) : <Lock className="w-4 h-4" />}
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isUnlocked
                        ? 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                        : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    +{b.xpValue} XP
                  </span>
                </div>

                <div>
                  <h4 className={`text-sm font-semibold ${isUnlocked ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500'}`}>
                    {b.title}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                    {b.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-850 text-xs font-mono flex items-center justify-between">
                  <span className="text-zinc-400 text-[11px]">{b.category}</span>
                  {isUnlocked ? (
                    <span className="text-zinc-900 dark:text-zinc-100 flex items-center gap-1 font-sans text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Unlocked
                    </span>
                  ) : (
                    <span className="text-zinc-400">Locked</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Certificates Section */}
      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
            Official Achievements
          </span>
          <h2 className="text-xl font-semibold -tracking-[0.02em] text-zinc-900 dark:text-zinc-100">Cyber Certificates</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Real completion certificates you can print, share, or show to parents and teachers!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-mono uppercase tracking-wider">
                    <ShieldCheck className="w-3 h-3 text-zinc-500" />
                    Verified Certificate
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {cert.credentialId}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{cert.title}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-normal">
                    Awarded by {cert.institution} • Issued {cert.issuedDate}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cert.skillsVerified.map((sk, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-mono"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-850 flex items-center justify-between text-xs">
                <span className="font-mono text-zinc-500">
                  Smart Score: <strong className="text-zinc-900 dark:text-zinc-100">{cert.trustScoreAtIssue}/100</strong>
                </span>
                <button
                  onClick={() => onOpenCertificate(cert)}
                  className="px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-medium text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>View Certificate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
