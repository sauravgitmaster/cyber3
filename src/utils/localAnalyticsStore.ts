import {
  VisitorAnalyticsSession,
  AnalyticsOverviewData,
  AnalyticsFilterParams,
  LoggedInUserVisitHistory,
  PageStatItem,
  DailyVisitorStat,
  DeviceType,
} from '../types';

const LOCAL_STORAGE_KEY = 'cybermentor_local_visitor_sessions';
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

export function getStoredSessions(): VisitorAnalyticsSession[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredSessions(sessions: VisitorAnalyticsSession[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions.slice(-200)));
  } catch {
    // Ignore storage quota errors
  }
}

export function recordLocalSessionStart(params: {
  sessionId: string;
  visitorId: string;
  deviceType: DeviceType;
  page: string;
  audienceType: 'kids' | 'adult' | 'unspecified';
  referrer?: string;
  userId?: string;
  userEmail?: string;
}): VisitorAnalyticsSession {
  const sessions = getStoredSessions();
  const now = Date.now();
  const existingIndex = sessions.findIndex((s) => s.sessionId === params.sessionId);

  if (existingIndex >= 0) {
    const s = sessions[existingIndex];
    s.lastSeenAt = now;
    s.durationSeconds = Math.max(0, Math.floor((now - s.startedAt) / 1000));
    if (params.userEmail && !s.userEmail) {
      s.userEmail = params.userEmail;
      s.userId = params.userId || s.userId;
      s.isAnonymous = false;
    }
    if (s.pages.length === 0 || s.pages[s.pages.length - 1].page !== params.page) {
      if (s.pages.length > 0) {
        const prev = s.pages[s.pages.length - 1];
        prev.durationSeconds = Math.max(1, Math.floor((now - prev.timestamp) / 1000));
      }
      s.pages.push({ page: params.page, timestamp: now, durationSeconds: 0 });
    }
    saveStoredSessions(sessions);
    return s;
  }

  const newSession: VisitorAnalyticsSession = {
    sessionId: params.sessionId,
    visitorId: params.visitorId,
    userId: params.userId,
    userEmail: params.userEmail,
    isAnonymous: !params.userEmail,
    startedAt: now,
    lastSeenAt: now,
    durationSeconds: 0,
    deviceType: params.deviceType,
    audienceType: params.audienceType,
    pages: [{ page: params.page, timestamp: now, durationSeconds: 0 }],
    status: 'active',
    referrer: params.referrer,
  };

  sessions.unshift(newSession);
  saveStoredSessions(sessions);
  return newSession;
}

export function recordLocalPageView(params: {
  sessionId: string;
  visitorId: string;
  page: string;
  audienceType?: string;
  userId?: string;
  userEmail?: string;
}): void {
  const sessions = getStoredSessions();
  const now = Date.now();
  const s = sessions.find((x) => x.sessionId === params.sessionId);
  if (!s) return;

  s.lastSeenAt = now;
  s.durationSeconds = Math.max(0, Math.floor((now - s.startedAt) / 1000));
  if (params.userEmail && !s.userEmail) {
    s.userEmail = params.userEmail;
    s.userId = params.userId || s.userId;
    s.isAnonymous = false;
  }

  if (s.pages.length === 0 || s.pages[s.pages.length - 1].page !== params.page) {
    if (s.pages.length > 0) {
      const prev = s.pages[s.pages.length - 1];
      prev.durationSeconds = Math.max(1, Math.floor((now - prev.timestamp) / 1000));
    }
    s.pages.push({ page: params.page, timestamp: now, durationSeconds: 0 });
  }
  saveStoredSessions(sessions);
}

export function recordLocalHeartbeat(params: {
  sessionId: string;
  visitorId: string;
  currentPage: string;
  audienceType?: string;
  userId?: string;
  userEmail?: string;
}): void {
  const sessions = getStoredSessions();
  const now = Date.now();
  const s = sessions.find((x) => x.sessionId === params.sessionId);
  if (!s) return;

  // Inactivity check
  if (now - s.lastSeenAt > INACTIVITY_TIMEOUT_MS) {
    s.status = 'closed';
    saveStoredSessions(sessions);
    return;
  }

  s.lastSeenAt = now;
  s.durationSeconds = Math.max(0, Math.floor((now - s.startedAt) / 1000));
  s.status = 'active';

  if (params.userEmail && !s.userEmail) {
    s.userEmail = params.userEmail;
    s.userId = params.userId || s.userId;
    s.isAnonymous = false;
  }

  if (s.pages.length > 0) {
    const cur = s.pages[s.pages.length - 1];
    if (cur.page === params.currentPage) {
      cur.durationSeconds = Math.max(0, Math.floor((now - cur.timestamp) / 1000));
    } else {
      cur.durationSeconds = Math.max(1, Math.floor((now - cur.timestamp) / 1000));
      s.pages.push({ page: params.currentPage, timestamp: now, durationSeconds: 0 });
    }
  }

  saveStoredSessions(sessions);
}

export function recordLocalSessionEnd(sessionId: string): void {
  const sessions = getStoredSessions();
  const now = Date.now();
  const s = sessions.find((x) => x.sessionId === sessionId);
  if (!s) return;

  s.lastSeenAt = now;
  s.durationSeconds = Math.max(0, Math.floor((now - s.startedAt) / 1000));
  if (s.pages.length > 0) {
    const prev = s.pages[s.pages.length - 1];
    prev.durationSeconds = Math.max(1, Math.floor((now - prev.timestamp) / 1000));
  }
  s.status = 'closed';
  saveStoredSessions(sessions);
}

export function clearLocalStoredSessions(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch {}
}

export function computeOverviewFromSessions(
  allSessions: VisitorAnalyticsSession[],
  filters: AnalyticsFilterParams = {}
): AnalyticsOverviewData {
  const now = Date.now();
  let list = [...allSessions];

  // Filter out any lingering fake seeds
  list = list.filter((s) => !s.sessionId.startsWith('sess_seed_'));

  // 1. Date Range
  let startTimeBoundary = 0;
  if (filters.dateRange === 'today') {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    startTimeBoundary = startOfDay.getTime();
  } else if (filters.dateRange === '7d') {
    startTimeBoundary = now - 7 * 24 * 60 * 60 * 1000;
  } else if (filters.dateRange === '30d') {
    startTimeBoundary = now - 30 * 24 * 60 * 60 * 1000;
  }

  if (startTimeBoundary > 0) {
    list = list.filter((s) => s.startedAt >= startTimeBoundary);
  }

  // 2. User Type
  if (filters.userType === 'identified') {
    list = list.filter((s) => !s.isAnonymous && s.userEmail);
  } else if (filters.userType === 'anonymous') {
    list = list.filter((s) => s.isAnonymous);
  }

  // 3. Device
  if (filters.deviceType && filters.deviceType !== 'all') {
    list = list.filter((s) => s.deviceType === filters.deviceType);
  }

  // 4. Audience
  if (filters.audienceType && filters.audienceType !== 'all') {
    list = list.filter((s) => s.audienceType === filters.audienceType);
  }

  // 5. Page
  if (filters.page && filters.page !== 'all') {
    list = list.filter((s) => s.pages.some((p) => p.page === filters.page));
  }

  // 6. Min duration
  if (filters.minDurationSeconds && filters.minDurationSeconds > 0) {
    list = list.filter((s) => s.durationSeconds >= filters.minDurationSeconds!);
  }

  // 7. Search
  if (filters.search && filters.search.trim()) {
    const q = filters.search.trim().toLowerCase();
    list = list.filter((s) =>
      s.sessionId.toLowerCase().includes(q) ||
      s.visitorId.toLowerCase().includes(q) ||
      (s.userEmail && s.userEmail.toLowerCase().includes(q)) ||
      s.pages.some((p) => p.page.toLowerCase().includes(q))
    );
  }

  list.sort((a, b) => b.startedAt - a.startedAt);

  const totalVisits = list.length;
  const uniqueVisitorsSet = new Set<string>();
  let totalDuration = 0;
  let activeSessionsCount = 0;
  const activeCutoff = now - 3 * 60 * 1000;

  const audienceBreakdown = { kids: 0, adult: 0, unspecified: 0 };
  const deviceBreakdown = { desktop: 0, mobile: 0, tablet: 0 };
  const pageStatsMap = new Map<string, { views: number; visitors: Set<string>; totalDuration: number }>();
  const dailyMap = new Map<string, { visits: number; visitors: Set<string> }>();
  const userHistoryMap = new Map<string, LoggedInUserVisitHistory>();

  // Fill in calendar dates for trend timeline
  if (filters.dateRange === '7d' || filters.dateRange === '30d') {
    const daysCount = filters.dateRange === '7d' ? 7 : 30;
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000);
      const k = d.toISOString().split('T')[0];
      dailyMap.set(k, { visits: 0, visitors: new Set() });
    }
  } else if (filters.dateRange === 'today') {
    const todayKey = new Date().toISOString().split('T')[0];
    dailyMap.set(todayKey, { visits: 0, visitors: new Set() });
  }

  list.forEach((s) => {
    uniqueVisitorsSet.add(s.visitorId);
    totalDuration += s.durationSeconds;

    if (s.lastSeenAt >= activeCutoff && s.status === 'active') {
      activeSessionsCount += 1;
    }

    audienceBreakdown[s.audienceType] = (audienceBreakdown[s.audienceType] || 0) + 1;
    deviceBreakdown[s.deviceType] = (deviceBreakdown[s.deviceType] || 0) + 1;

    const sessionVisitedPages = new Set<string>();
    s.pages.forEach((p, idx) => {
      sessionVisitedPages.add(p.page);
      let stat = pageStatsMap.get(p.page);
      if (!stat) {
        stat = { views: 0, visitors: new Set(), totalDuration: 0 };
        pageStatsMap.set(p.page, stat);
      }
      stat.views += 1;
      stat.visitors.add(s.visitorId);

      let pageDuration = p.durationSeconds || 0;
      if (!pageDuration && s.pages[idx + 1]) {
        pageDuration = Math.max(0, Math.floor((s.pages[idx + 1].timestamp - p.timestamp) / 1000));
      } else if (!pageDuration && idx === s.pages.length - 1) {
        pageDuration = Math.max(0, Math.floor((s.lastSeenAt - p.timestamp) / 1000));
      }
      stat.totalDuration += pageDuration;
    });

    const dateKey = new Date(s.startedAt).toISOString().split('T')[0];
    let dayEntry = dailyMap.get(dateKey);
    if (!dayEntry) {
      dayEntry = { visits: 0, visitors: new Set() };
      dailyMap.set(dateKey, dayEntry);
    }
    dayEntry.visits += 1;
    dayEntry.visitors.add(s.visitorId);

    if (s.userEmail) {
      const uKey = s.userEmail.toLowerCase();
      let uHist = userHistoryMap.get(uKey);
      if (!uHist) {
        uHist = {
          userId: s.userId || uKey,
          email: s.userEmail,
          name: s.userEmail.split('@')[0],
          sessionCount: 0,
          totalDurationSeconds: 0,
          firstSeenAt: s.startedAt,
          lastSeenAt: s.lastSeenAt,
          pagesVisited: [],
          audienceType: s.audienceType,
          lastDeviceType: s.deviceType,
        };
        userHistoryMap.set(uKey, uHist);
      }
      uHist.sessionCount += 1;
      uHist.totalDurationSeconds += s.durationSeconds;
      uHist.firstSeenAt = Math.min(uHist.firstSeenAt, s.startedAt);
      uHist.lastSeenAt = Math.max(uHist.lastSeenAt, s.lastSeenAt);
      sessionVisitedPages.forEach((pg) => {
        if (!uHist!.pagesVisited.includes(pg)) {
          uHist!.pagesVisited.push(pg);
        }
      });
    }
  });

  const averageDurationSeconds = totalVisits > 0 ? Math.round(totalDuration / totalVisits) : 0;

  const mostVisitedPages: PageStatItem[] = Array.from(pageStatsMap.entries())
    .map(([page, stat]) => ({
      page,
      views: stat.views,
      uniqueVisitors: stat.visitors.size,
      avgDurationSeconds: stat.views > 0 ? Math.round(stat.totalDuration / stat.views) : 0,
    }))
    .sort((a, b) => b.views - a.views);

  const dailyVisitors: DailyVisitorStat[] = Array.from(dailyMap.entries())
    .map(([date, d]) => ({
      date,
      visits: d.visits,
      uniqueVisitors: d.visitors.size,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const userHistory: LoggedInUserVisitHistory[] = Array.from(userHistoryMap.values())
    .sort((a, b) => b.lastSeenAt - a.lastSeenAt);

  return {
    totalVisits,
    uniqueVisitors: uniqueVisitorsSet.size,
    averageDurationSeconds,
    activeSessionsCount,
    mostVisitedPages,
    dailyVisitors,
    audienceBreakdown,
    deviceBreakdown,
    recentSessions: list.slice(0, 100),
    userHistory,
    timeframe: filters.dateRange || 'all',
  };
}

export function generateCSVFromOverview(overview: AnalyticsOverviewData, maskEmails = false): string {
  const headers = [
    'Session ID',
    'Visitor ID',
    'User Type',
    'User Email',
    'Device',
    'Audience Mode',
    'Started At (UTC)',
    'Last Seen At (UTC)',
    'Duration (seconds)',
    'Duration (formatted)',
    'Pages Visited',
    'Page Views Count',
    'Status',
  ];

  const escapeCSV = (str: string | number | undefined | null) => {
    if (str === undefined || str === null) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const formatSecs = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  const rows = overview.recentSessions.map((s) => {
    let emailDisplay = s.userEmail || 'Anonymous';
    if (s.userEmail && maskEmails) {
      const parts = s.userEmail.split('@');
      const userPart = parts[0];
      const masked = userPart.length > 2 ? `${userPart[0]}***${userPart[userPart.length - 1]}` : '***';
      emailDisplay = `${masked}@${parts[1] || ''}`;
    }

    return [
      escapeCSV(s.sessionId),
      escapeCSV(s.visitorId),
      escapeCSV(s.isAnonymous ? 'Anonymous Visitor' : 'Logged-In User'),
      escapeCSV(emailDisplay),
      escapeCSV(s.deviceType),
      escapeCSV(s.audienceType),
      escapeCSV(new Date(s.startedAt).toISOString()),
      escapeCSV(new Date(s.lastSeenAt).toISOString()),
      s.durationSeconds,
      escapeCSV(formatSecs(s.durationSeconds)),
      escapeCSV(s.pages.map((p) => p.page).join(' -> ')),
      s.pages.length,
      escapeCSV(s.status),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}
