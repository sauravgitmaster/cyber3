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
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto text-[#243047] font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-black text-[#8B6CFF] uppercase tracking-wider">
            <Trophy className="w-4 h-4" />
            <span>TROPHY ROOM & REWARDS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#243047]">
            Badges & Certificates
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Collect cool badges and earn real cyber certificates as you complete missions!
          </p>
        </div>

        {/* Level Banner */}
        <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8B6CFF] flex items-center justify-center text-white font-black text-sm shadow-xs">
            0{user.level}
          </div>
          <div>
            <div className="text-xs font-black text-[#243047] uppercase tracking-wide">
              {user.levelTitle}
            </div>
            <div className="text-xs font-bold text-[#8B6CFF]">
              {user.currentXP} / {user.nextLevelXP} XP
            </div>
          </div>
        </div>
      </div>

      {/* Level XP Progress Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-3">
            <ByteMascot mood="excited" size="sm" />
            <div>
              <span className="text-[11px] font-black uppercase text-slate-500 block">
                CURRENT CYBER RANK
              </span>
              <span className="text-base font-black text-[#243047]">
                Level 0{user.level} — {user.levelTitle}
              </span>
            </div>
          </div>
          <span className="text-xs font-extrabold text-[#4F7CFF] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            {user.currentXP.toLocaleString()} / {user.nextLevelXP.toLocaleString()} XP ({xpProgressPercent}%)
          </span>
        </div>

        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-[#4F7CFF] via-[#8B6CFF] to-[#40C98A] rounded-full transition-all duration-500"
            style={{ width: `${xpProgressPercent}%` }}
          />
        </div>

        <div className="flex justify-between text-xs font-bold text-slate-500">
          <span>{user.nextLevelXP - user.currentXP} XP until Level 08 (Cyber Guardian)</span>
          <span className="text-[#8B6CFF]">Earn XP from missions and quizzes!</span>
        </div>
      </div>

      {/* Badges Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-black text-[#4F7CFF] uppercase tracking-wider block mb-1">
              COLLECTION
            </span>
            <h2 className="text-xl font-black text-[#243047]">Cyber Badges</h2>
          </div>
          <span className="text-xs font-extrabold text-slate-500">
            {badges.filter((b) => b.unlocked).length} of {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((b) => {
            const isUnlocked = b.unlocked;

            return (
              <div
                key={b.id}
                className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between space-y-3 relative overflow-hidden ${
                  isUnlocked
                    ? 'bg-white border-blue-200 hover:border-[#4F7CFF] shadow-xs hover:shadow-md'
                    : 'bg-slate-50/70 border-dashed border-slate-300 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform hover:scale-105 ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isUnlocked ? getBadgeIcon(b.iconName) : <Lock className="w-5 h-5" />}
                  </div>

                  <span
                    className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                      isUnlocked
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    +{b.xpValue} XP
                  </span>
                </div>

                <div>
                  <h4 className={`text-sm font-black ${isUnlocked ? 'text-[#243047]' : 'text-slate-600'}`}>
                    {b.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {b.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs font-bold flex items-center justify-between">
                  <span className="text-slate-500">{b.category}</span>
                  {isUnlocked ? (
                    <span className="text-emerald-600 flex items-center gap-1 font-black">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Unlocked
                    </span>
                  ) : (
                    <span className="text-slate-600">Locked</span>
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
          <span className="text-xs font-black text-[#40C98A] uppercase tracking-wider block mb-1">
            OFFICIAL ACHIEVEMENTS
          </span>
          <h2 className="text-xl font-black text-[#243047]">Cyber Certificates</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Real completion certificates you can print, share, or show to parents and teachers!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="p-6 rounded-3xl bg-gradient-to-br from-white to-blue-50/40 border-2 border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    VERIFIED CERTIFICATE
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-600">
                    {cert.credentialId}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-[#243047]">{cert.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    Awarded by {cert.institution} • Issued {cert.issuedDate}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cert.skillsVerified.map((sk, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-600">
                  Smart Score: <strong className="text-[#4F7CFF]">{cert.trustScoreAtIssue}/100</strong>
                </span>
                <button
                  onClick={() => onOpenCertificate(cert)}
                  className="px-4 py-2 rounded-xl bg-[#4F7CFF] hover:bg-[#3D6CE6] text-white font-black text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
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
