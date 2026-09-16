import React, { useState } from 'react';
import { ActivePage, UserProfile } from '../types';
import { ArrowRight, LogIn, Sparkles, Mail, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import { ByteMascot } from '../components/common/ByteMascot';
import { AvatarUploader } from '../components/common/AvatarUploader';
import { ThemeToggle } from '../components/common/ThemeToggle';

interface AuthPageProps {
  onNavigate: (page: ActivePage) => void;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onAuthSuccess?: (user: UserProfile, isFirstTime: boolean) => void;
}


export const AuthPage: React.FC<AuthPageProps> = ({
  onNavigate,
  user,
  setUser,
  onAuthSuccess,
}) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState(user.name === 'Alex Rivera' ? '' : user.name);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(user.avatar || '🤖');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim() || cleanEmail.split('@')[0] || 'Cyber Explorer';

    if (!cleanEmail) {
      setError('Please enter your email address.');
      setLoading(false);
      return;
    }

    if (!password) {
      setError('Please enter a password.');
      setLoading(false);
      return;
    }

    try {
      let resolvedUser: UserProfile | null = null;

      // 1. Try server-side authentication if available (with a short timeout)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            password,
            avatar,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json().catch(() => null);
          if (res.ok && data?.user) {
            resolvedUser = {
              ...user,
              name: data.user.name || cleanName,
              email: data.user.email || cleanEmail,
              avatar: data.user.avatar || avatar,
              level: data.user.level || 1,
              levelTitle: data.user.levelTitle || 'Rookie',
              digitalTrustScore: data.user.digitalTrustScore || 70,
              currentXP: data.user.currentXP || 100,
              streakDays: data.user.streakDays || 1,
            };
          } else if (!res.ok && data?.error && res.status !== 404 && res.status < 500) {
            // Legitimate business logic error from an active API server
            throw new Error(data.error);
          }
        }
      } catch (apiErr: any) {
        // If it was an explicit API business logic error (like incorrect credentials on a real server), rethrow
        if (
          apiErr?.message &&
          !apiErr.message.includes('token') &&
          !apiErr.message.includes('is not valid JSON') &&
          !apiErr.message.includes('Failed to fetch') &&
          !apiErr.message.includes('aborted')
        ) {
          throw apiErr;
        }
        // Otherwise (404 on Vercel, HTML response, network error), fall back to local client auth seamlessly
      }

      // 2. Seamless local client fallback (for static hosts like Vercel, Netlify, or offline usage)
      if (!resolvedUser) {
        const localAccountsKey = 'cybermentor_registered_accounts';
        let accounts: Record<string, { profile: UserProfile; password?: string }> = {};
        try {
          const raw = localStorage.getItem(localAccountsKey);
          if (raw) accounts = JSON.parse(raw);
        } catch {
          accounts = {};
        }

        if (isSignUp) {
          resolvedUser = {
            ...user,
            name: cleanName,
            email: cleanEmail,
            avatar: avatar || '🤖',
            level: 1,
            levelTitle: 'Rookie',
            digitalTrustScore: 70,
            currentXP: 100,
            streakDays: 1,
          };
          accounts[cleanEmail] = {
            profile: resolvedUser,
            password,
          };
          localStorage.setItem(localAccountsKey, JSON.stringify(accounts));
        } else {
          // Log In mode
          if (accounts[cleanEmail]) {
            resolvedUser = {
              ...user,
              ...accounts[cleanEmail].profile,
              avatar: accounts[cleanEmail].profile.avatar || avatar,
            };
          } else {
            // Child-friendly fallback: Create profile so learner is never blocked
            resolvedUser = {
              ...user,
              name: cleanName,
              email: cleanEmail,
              avatar: avatar || '🤖',
              level: 1,
              levelTitle: 'Rookie',
              digitalTrustScore: 72,
              currentXP: 100,
              streakDays: 1,
            };
            accounts[cleanEmail] = {
              profile: resolvedUser,
              password,
            };
            localStorage.setItem(localAccountsKey, JSON.stringify(accounts));
          }
        }
      }

      // 3. Save to active user state & navigate
      setUser(resolvedUser);

      if (onAuthSuccess) {
        onAuthSuccess(resolvedUser, isSignUp);
      } else {
        if (isSignUp) {
          // New user goes to Quick Cyber Check!
          onNavigate('skill-check');
        } else {
          onNavigate('dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    const demoUser: UserProfile = {
      ...user,
      name: 'Saurav',
      email: 'saurav@school.edu',
      avatar: '🤖',
      level: 4,
      levelTitle: 'Cyber Scout',
      digitalTrustScore: 78,
      currentXP: 420,
      streakDays: 4,
    };
    setUser(demoUser);
    if (onAuthSuccess) {
      onAuthSuccess(demoUser, false);
    } else {
      onNavigate('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] dark:bg-slate-950 flex flex-col justify-center items-center px-4 py-10 text-[#243047] dark:text-slate-100 font-sans relative transition-colors duration-200 selection:bg-blue-200 dark:selection:bg-blue-900">
      {/* Top Bar with Dark/Light Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle id="auth-theme-toggle" />
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Brand Mascot */}
        <div className="text-center space-y-2">
          <div className="inline-flex justify-center mb-1">
            <ByteMascot mood="happy" size="md" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#243047] dark:text-white">
            {isSignUp ? "Let's create your profile!" : 'Welcome Back!'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            {isSignUp
              ? 'Get your personal cyber detective profile and track your score.'
              : 'Sign in to continue your missions with Byte.'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
          {/* Avatar Upload (Only on Sign Up) */}
          {isSignUp && (
            <div className="pb-2 flex flex-col items-center">
              <span className="text-xs font-black text-slate-500 dark:text-slate-400 mb-2">Pick your avatar (optional)</span>
              <AvatarUploader
                currentAvatar={avatar}
                onAvatarChange={(newAv) => setAvatar(newAv)}
                size="md"
              />
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Name or Nickname
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex or DetectiveCyber"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[#243047] dark:text-slate-100 font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#4F7CFF] focus:bg-white dark:focus:bg-slate-800 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[#243047] dark:text-slate-100 font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#4F7CFF] focus:bg-white dark:focus:bg-slate-800 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[#243047] dark:text-slate-100 font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#4F7CFF] focus:bg-white dark:focus:bg-slate-800 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-[#4F7CFF] hover:bg-[#3D6CE6] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 mt-2 cursor-pointer"
            >
              <span>{loading ? 'Please wait...' : isSignUp ? 'Create My Profile' : 'Log In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo button */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">Just trying it out?</span>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="text-xs text-[#4F7CFF] dark:text-blue-400 hover:underline font-black cursor-pointer"
            >
              Try Demo Account →
            </button>
          </div>

          {/* Toggle Login/Sign Up */}
          <div className="pt-1 text-center">
            {isSignUp ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setError(null);
                  }}
                  className="text-[#4F7CFF] dark:text-blue-400 font-black hover:underline cursor-pointer"
                >
                  Log In
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                New here?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setError(null);
                  }}
                  className="text-[#4F7CFF] dark:text-blue-400 font-black hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
