import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ActivePage,
  UserProfile,
  AnalyticsOverviewData,
  AnalyticsFilterParams,
  DeviceType,
  AudienceType,
} from '../types';
import {
  BarChart3,
  Users,
  Clock,
  Activity,
  Download,
  Printer,
  RefreshCw,
  Search,
  Filter,
  Shield,
  ShieldAlert,
  KeyRound,
  Eye,
  EyeOff,
  Laptop,
  Smartphone,
  Tablet,
  ArrowUpDown,
  Calendar,
  CheckCircle,
  FileSpreadsheet,
  FileText,
  UserCheck,
  UserX,
  Sparkles,
  Trash2,
} from 'lucide-react';

interface AdminAnalyticsPageProps {
  user: UserProfile;
  onNavigate: (page: ActivePage) => void;
}

export const AdminAnalyticsPage: React.FC<AdminAnalyticsPageProps> = ({ user, onNavigate }) => {
  // Admin Authorization State
  const [adminKey, setAdminKey] = useState<string>(() => {
    try {
      return sessionStorage.getItem('cybermentor_admin_key') || '';
    } catch {
      return '';
    }
  });
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState<string>('');

  // Data & Filters State
  const [overview, setOverview] = useState<AnalyticsOverviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [maskEmails, setMaskEmails] = useState<boolean>(false);

  // Filters
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | 'all'>('all');
  const [userType, setUserType] = useState<'all' | 'identified' | 'anonymous'>('all');
  const [deviceType, setDeviceType] = useState<'all' | DeviceType>('all');
  const [audienceType, setAudienceType] = useState<'all' | 'kids' | 'adult' | 'unspecified'>('all');
  const [selectedPage, setSelectedPage] = useState<string>('all');
  const [minDuration, setMinDuration] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Initial Check on user email or existing key
  useEffect(() => {
    const checkInitialAuth = async () => {
      const email = user?.email?.toLowerCase().trim() || '';
      const isKnownAdminEmail =
        email === 'admin@cybermentor.app' ||
        email === 'chopraparth2007@gmail.com' ||
        email === 'saurav@cybermentor.app';

      const keyToTest = adminKey || (isKnownAdminEmail ? 'cyberadmin2026' : '');

      try {
        const res = await fetch('/api/analytics/admin/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adminKey: keyToTest, email }),
        });
        const data = await res.json();
        if (data.authorized) {
          setIsAuthorized(true);
          if (keyToTest && !adminKey) {
            setAdminKey(keyToTest);
            try {
              sessionStorage.setItem('cybermentor_admin_key', keyToTest);
            } catch {}
          }
        } else {
          setIsAuthorized(false);
        }
      } catch {
        setIsAuthorized(false);
      }
    };

    checkInitialAuth();
  }, [user.email, adminKey]);

  // Load Overview Data
  const loadOverview = useCallback(async () => {
    if (!isAuthorized && !adminKey) return;
    setLoading(true);
    setFetchError(null);

    try {
      const params = new URLSearchParams();
      if (dateRange !== 'all') params.set('dateRange', dateRange);
      if (userType !== 'all') params.set('userType', userType);
      if (deviceType !== 'all') params.set('deviceType', deviceType);
      if (audienceType !== 'all') params.set('audienceType', audienceType);
      if (selectedPage !== 'all') params.set('page', selectedPage);
      if (minDuration > 0) params.set('minDurationSeconds', minDuration.toString());
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (adminKey) params.set('adminKey', adminKey);
      if (user?.email) params.set('userEmail', user.email);

      const res = await fetch(`/api/analytics/overview?${params.toString()}`, {
        headers: {
          'x-admin-key': adminKey,
          'x-user-email': user.email || '',
        },
      });

      if (!res.ok) {
        if (res.status === 403 || res.status === 401) {
          setIsAuthorized(false);
          setFetchError('Admin authorization credentials expired or invalid.');
        } else {
          const errData = await res.json().catch(() => null);
          setFetchError(errData?.error || 'Failed to load analytics overview.');
        }
        return;
      }

      const data: AnalyticsOverviewData = await res.json();
      setOverview(data);
    } catch (err: any) {
      setFetchError(err.message || 'Network error fetching analytics data.');
    } finally {
      setLoading(false);
    }
  }, [isAuthorized, adminKey, user.email, dateRange, userType, deviceType, audienceType, selectedPage, minDuration, searchQuery]);

  useEffect(() => {
    if (isAuthorized) {
      loadOverview();
    }
  }, [isAuthorized, loadOverview]);

  // Handle Manual Admin Key Verification
  const handleVerifyKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const key = inputKey.trim();
    if (!key) {
      setAuthError('Please enter an admin key.');
      return;
    }

    try {
      const res = await fetch('/api/analytics/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminKey: key, email: user.email }),
      });
      const data = await res.json();
      if (data.authorized) {
        setIsAuthorized(true);
        setAdminKey(key);
        try {
          sessionStorage.setItem('cybermentor_admin_key', key);
        } catch {}
      } else {
        setAuthError('Invalid admin key. Access denied.');
      }
    } catch {
      setAuthError('Verification service currently unavailable.');
    }
  };

  // CSV Export Trigger
  const handleExportCSV = () => {
    const params = new URLSearchParams();
    if (dateRange !== 'all') params.set('dateRange', dateRange);
    if (userType !== 'all') params.set('userType', userType);
    if (deviceType !== 'all') params.set('deviceType', deviceType);
    if (audienceType !== 'all') params.set('audienceType', audienceType);
    if (selectedPage !== 'all') params.set('page', selectedPage);
    if (maskEmails) params.set('mask', 'true');
    if (adminKey) params.set('adminKey', adminKey);
    if (user?.email) params.set('userEmail', user.email);

    window.open(`/api/analytics/export?${params.toString()}`, '_blank');
  };

  // Printable Report Trigger
  const handlePrintReport = () => {
    const params = new URLSearchParams();
    if (dateRange !== 'all') params.set('dateRange', dateRange);
    if (userType !== 'all') params.set('userType', userType);
    if (deviceType !== 'all') params.set('deviceType', deviceType);
    if (audienceType !== 'all') params.set('audienceType', audienceType);
    if (adminKey) params.set('adminKey', adminKey);
    if (user?.email) params.set('userEmail', user.email);

    window.open(`/api/analytics/report?${params.toString()}`, '_blank');
  };

  // Clear / Reset All Real Analytics
  const handleClearAnalytics = async () => {
    if (!confirm('Are you sure you want to reset all visitor analytics data? New sessions will start recording fresh in real time.')) {
      return;
    }
    try {
      const res = await fetch('/api/analytics/admin/clear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
          'x-user-email': user.email || '',
        },
      });
      if (res.ok) {
        await loadOverview();
      }
    } catch {
      // ignore
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${s}s`;
  };

  const maskUserEmail = (email: string) => {
    if (!maskEmails) return email;
    const parts = email.split('@');
    const u = parts[0];
    const masked = u.length > 2 ? `${u[0]}***${u[u.length - 1]}` : '***';
    return `${masked}@${parts[1] || ''}`;
  };

  // If Not Authorized: Admin Passkey Screen
  if (!isAuthorized) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-6 text-zinc-900 dark:text-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Admin Analytics Portal</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Restricted to authorized staff</p>
            </div>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Detailed visitor telemetry and identified user session analytics are protected to safeguard student and learner privacy. Please provide your administrator key to proceed.
          </p>

          <form onSubmit={handleVerifyKey} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                Administrator Passkey
              </label>
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Enter admin access key"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-400"
              />
              <span className="text-[10px] text-zinc-400 mt-1 block">
                Default demo passkey: <code className="font-mono text-zinc-700 dark:text-zinc-300">cyberadmin2026</code>
              </span>
            </div>

            {authError && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-semibold transition-all shadow-xs cursor-pointer"
            >
              Verify & Enter Dashboard
            </button>
          </form>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex justify-between items-center text-xs">
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
            >
              &larr; Return to Home
            </button>
            <span className="text-[10px] font-mono text-zinc-400">Role-Based Access Control</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Shield className="w-3.5 h-3.5" />
            <span>Authorized Administration Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold -tracking-[0.03em] text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
            <span>Visitor Analytics & Activity</span>
            {overview && (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                100% Real Live Telemetry
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Real visitor session tracking, live heartbeat monitoring, and actual device distribution without mock or simulated data.
          </p>
        </div>

        {/* Action Buttons: Export, Print, Refresh */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <button
            onClick={handleClearAnalytics}
            className="px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Reset/wipe visitor analytics data to start fresh"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>

          <button
            onClick={() => setMaskEmails(!maskEmails)}
            className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              maskEmails
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-transparent'
                : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
            title="Toggle email masking in dashboard tables and exports"
          >
            {maskEmails ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{maskEmails ? 'Emails Masked' : 'Mask Emails'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Download CSV export"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Open printable executive report"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Print Report</span>
          </button>

          <button
            onClick={() => loadOverview()}
            disabled={loading}
            className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Refresh metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900 dark:text-zinc-200">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <span>Analytics Filters</span>
          </div>
          <button
            onClick={() => {
              setDateRange('all');
              setUserType('all');
              setDeviceType('all');
              setAudienceType('all');
              setSelectedPage('all');
              setMinDuration(0);
              setSearchQuery('');
            }}
            className="text-[11px] font-mono text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
          {/* Date Range */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Timeframe</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          {/* User Type */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">User Status</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium cursor-pointer"
            >
              <option value="all">All Visitors</option>
              <option value="identified">Logged-in Accounts</option>
              <option value="anonymous">Anonymous Only</option>
            </select>
          </div>

          {/* Device Type */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Device Category</label>
            <select
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium cursor-pointer"
            >
              <option value="all">All Devices</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile Phone</option>
              <option value="tablet">Tablet</option>
            </select>
          </div>

          {/* Audience Mode */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Audience Mode</label>
            <select
              value={audienceType}
              onChange={(e) => setAudienceType(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium cursor-pointer"
            >
              <option value="all">All Audiences</option>
              <option value="kids">Kids (&lt;13)</option>
              <option value="adult">Adult (13+)</option>
              <option value="unspecified">Unspecified</option>
            </select>
          </div>

          {/* Page Route */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Page Route</label>
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium cursor-pointer"
            >
              <option value="all">All Pages</option>
              <option value="landing">Landing</option>
              <option value="auth">Auth</option>
              <option value="dashboard">Home / Dashboard</option>
              <option value="interactive-scenario">Cyber Missions</option>
              <option value="learning-paths">Learning Paths</option>
              <option value="module-detail">Module Detail</option>
              <option value="multiplayer">Multiplayer Play</option>
              <option value="skill-check">Skill Check</option>
              <option value="badges">Badges / Rewards</option>
              <option value="profile">Profile</option>
              <option value="settings">Settings</option>
            </select>
          </div>

          {/* Search Query */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Search Identifier</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Email, visitor or session..."
                className="w-full pl-7 pr-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2 top-2" />
            </div>
          </div>
        </div>
      </div>

      {fetchError && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs flex items-center justify-between">
          <span>{fetchError}</span>
          <button onClick={() => loadOverview()} className="font-semibold underline cursor-pointer">
            Retry
          </button>
        </div>
      )}

      {/* Top 4 KPI Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Visits */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Total Visits</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight">
              {overview?.totalVisits ?? '...'}
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Recorded user sessions</p>
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Unique Visitors</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight">
              {overview?.uniqueVisitors ?? '...'}
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Distinct devices & learners</p>
          </div>
        </div>

        {/* Average Visit Duration */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Avg. Duration</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight">
              {overview ? formatSeconds(overview.averageDurationSeconds) : '...'}
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Time per active visit</p>
          </div>
        </div>

        {/* Active Visitors Now */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Active Now</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              {overview?.activeSessionsCount ?? '...'}
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Online in last 3 mins</p>
          </div>
        </div>
      </div>

      {/* Middle Row: Visitor Trends Chart + Kids vs Adult Audience Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visitor Volume Chart (2 cols) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-zinc-500" />
                <span>Visitor Volume Trends</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Daily sessions and unique visitor breakdown</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-zinc-900 dark:bg-white"></div>
                <span className="text-zinc-600 dark:text-zinc-400">Total Visits</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></div>
                <span className="text-zinc-600 dark:text-zinc-400">Unique</span>
              </div>
            </div>
          </div>

          {/* Simple Clean Responsive SVG Bar Chart */}
          {overview && overview.dailyVisitors.length > 0 && overview.dailyVisitors.some((d) => d.visits > 0) ? (
            <div className="h-56 w-full flex items-end gap-2 pt-6 pb-2 border-b border-zinc-100 dark:border-zinc-850">
              {(() => {
                const maxVal = Math.max(1, ...overview.dailyVisitors.map((d) => d.visits));
                return overview.dailyVisitors.map((d) => {
                  const visitHeightPct = d.visits > 0 ? Math.max(8, Math.round((d.visits / maxVal) * 100)) : 0;
                  const uniqueHeightPct = d.uniqueVisitors > 0 ? Math.max(6, Math.round((d.uniqueVisitors / maxVal) * 100)) : 0;
                  const label = d.date.split('-').slice(1).join('/');

                  return (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                      <div className="w-full flex items-end justify-center gap-1 h-44">
                        {/* Visit Bar */}
                        <div
                          style={{ height: `${visitHeightPct}%` }}
                          className={`w-1/2 rounded-t-md transition-all relative flex justify-center ${
                            d.visits > 0 ? 'bg-zinc-800 dark:bg-zinc-200 group-hover:bg-zinc-600' : 'bg-transparent'
                          }`}
                          title={`${d.date}: ${d.visits} visits`}
                        />
                        {/* Unique Bar */}
                        <div
                          style={{ height: `${uniqueHeightPct}%` }}
                          className={`w-1/2 rounded-t-md transition-all relative flex justify-center ${
                            d.uniqueVisitors > 0 ? 'bg-emerald-500 group-hover:bg-emerald-400' : 'bg-transparent'
                          }`}
                          title={`${d.date}: ${d.uniqueVisitors} unique visitors`}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 truncate w-full text-center">
                        {label}
                      </span>
                    </div>
                  );
                });
              })()}
            </div>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-xs text-zinc-400 space-y-1">
              <span className="font-semibold text-zinc-600 dark:text-zinc-300">No visits logged for this timeframe</span>
              <span className="text-[11px] text-zinc-400">Live data will appear here as visitors navigate the platform.</span>
            </div>
          )}
        </div>

        {/* Audience & Device Distribution (1 col) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              Audience Mode Breakdown
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Kids (&le;12) vs Adult (13+) comparison
            </p>

            {overview && (
              <div className="space-y-3.5">
                {/* Visual Ratio Bar */}
                {(() => {
                  const totalAud = Math.max(
                    1,
                    overview.audienceBreakdown.kids +
                      overview.audienceBreakdown.adult +
                      overview.audienceBreakdown.unspecified
                  );
                  const kidsPct = Math.round((overview.audienceBreakdown.kids / totalAud) * 100);
                  const adultPct = Math.round((overview.audienceBreakdown.adult / totalAud) * 100);

                  return (
                    <div className="space-y-1.5">
                      <div className="w-full h-3 rounded-full overflow-hidden flex bg-zinc-100 dark:bg-zinc-800">
                        <div style={{ width: `${kidsPct}%` }} className="bg-blue-500 h-full" title={`Kids: ${kidsPct}%`} />
                        <div style={{ width: `${adultPct}%` }} className="bg-emerald-500 h-full" title={`Adult: ${adultPct}%`} />
                      </div>
                      <div className="flex justify-between text-[11px] font-mono text-zinc-500">
                        <span>Kids: {kidsPct}%</span>
                        <span>Adult: {adultPct}%</span>
                      </div>
                    </div>
                  );
                })()}

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
                    <span className="text-[10px] font-mono uppercase text-blue-600 dark:text-blue-400 block font-semibold">
                      Kids Mode
                    </span>
                    <span className="text-xl font-bold mt-1 block">
                      {overview.audienceBreakdown.kids}
                    </span>
                    <span className="text-[10px] text-zinc-500">Playful missions & tips</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                    <span className="text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-400 block font-semibold">
                      Adult Mode
                    </span>
                    <span className="text-xl font-bold mt-1 block">
                      {overview.audienceBreakdown.adult}
                    </span>
                    <span className="text-[10px] text-zinc-500">Career & technical drills</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Device Telemetry */}
          {overview && (
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                Device Distribution
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
                  <Laptop className="w-4 h-4 mx-auto text-zinc-500 mb-1" />
                  <span className="font-bold block">{overview.deviceBreakdown.desktop}</span>
                  <span className="text-[10px] text-zinc-400">Desktop</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
                  <Smartphone className="w-4 h-4 mx-auto text-zinc-500 mb-1" />
                  <span className="font-bold block">{overview.deviceBreakdown.mobile}</span>
                  <span className="text-[10px] text-zinc-400">Mobile</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
                  <Tablet className="w-4 h-4 mx-auto text-zinc-500 mb-1" />
                  <span className="font-bold block">{overview.deviceBreakdown.tablet}</span>
                  <span className="text-[10px] text-zinc-400">Tablet</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Most Visited Pages Table */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Most Visited Pages</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Navigation hotspots and engagement by route
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-mono text-zinc-400 uppercase">
                <th className="pb-3 font-medium">Page Route</th>
                <th className="pb-3 font-medium">Total Views</th>
                <th className="pb-3 font-medium">Unique Visitors</th>
                <th className="pb-3 font-medium">Traffic Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
              {overview && overview.mostVisitedPages.length > 0 ? (
                overview.mostVisitedPages.map((p) => {
                  const totalPageViews = overview.mostVisitedPages.reduce((acc, curr) => acc + curr.views, 0) || 1;
                  const sharePct = Math.round((p.views / totalPageViews) * 100);

                  return (
                    <tr key={p.page} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3 font-mono font-medium text-zinc-900 dark:text-zinc-200">
                        /{p.page}
                      </td>
                      <td className="py-3 font-semibold">{p.views}</td>
                      <td className="py-3 text-zinc-600 dark:text-zinc-400">{p.uniqueVisitors}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                            <div
                              style={{ width: `${Math.max(4, sharePct)}%` }}
                              className="h-full bg-zinc-800 dark:bg-zinc-200 rounded-full"
                            />
                          </div>
                          <span className="font-mono text-[10px] text-zinc-400">{sharePct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-zinc-400">
                    No page views recorded for this timeframe yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Logged-In User Visit History */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-500" />
              <span>Identified User Visit History</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Authenticated learners and cumulative learning engagement
            </p>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">
            {overview?.userHistory.length ?? 0} registered learners
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-mono text-zinc-400 uppercase">
                <th className="pb-3 font-medium">User Account</th>
                <th className="pb-3 font-medium">Audience</th>
                <th className="pb-3 font-medium">Sessions</th>
                <th className="pb-3 font-medium">Total Time</th>
                <th className="pb-3 font-medium">Last Active</th>
                <th className="pb-3 font-medium">Explored Pages</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
              {overview && overview.userHistory.length > 0 ? (
                overview.userHistory.map((u) => (
                  <tr key={u.email} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3 font-medium text-zinc-900 dark:text-zinc-200">
                      {maskUserEmail(u.email)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium font-mono ${
                          u.audienceType === 'kids'
                            ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                            : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {u.audienceType}
                      </span>
                    </td>
                    <td className="py-3 font-semibold">{u.sessionCount}</td>
                    <td className="py-3 font-mono">{formatSeconds(u.totalDurationSeconds)}</td>
                    <td className="py-3 text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">
                      {new Date(u.lastSeenAt).toLocaleString()}
                    </td>
                    <td className="py-3 text-[11px] text-zinc-500">
                      {u.pagesVisited.join(', ') || 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-zinc-400">
                    No identified student accounts in the filtered window.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security & Privacy Commitment Badge */}
      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            <strong>Zero Password Logging:</strong> Form inputs, passwords, and sensitive student credentials are never inspected or stored.
          </span>
        </div>
        <span className="font-mono text-[10px] text-zinc-400">
          Storage: Persistent Local Database (data/visitor_analytics.json)
        </span>
      </div>
    </div>
  );
};
