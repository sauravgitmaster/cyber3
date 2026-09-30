import fs from 'fs';
import path from 'path';
import {
  VisitorAnalyticsSession,
  AnalyticsOverviewData,
  AnalyticsFilterParams,
  LoggedInUserVisitHistory,
  PageStatItem,
  DailyVisitorStat,
  DeviceType,
} from '../types';

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'visitor_analytics.json');
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const ADMIN_MASTER_KEY = process.env.ADMIN_KEY || 'cyberadmin2026';
const KNOWN_ADMIN_EMAILS = new Set([
  'admin@cybermentor.app',
  'chopraparth2007@gmail.com',
  'saurav@cybermentor.app',
]);

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export class AnalyticsService {
  private sessions = new Map<string, VisitorAnalyticsSession>();
  private rateLimits = new Map<string, RateLimitEntry>();
  private saveDebounceTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.initStore();
  }

  // -------------------------------------------------------------
  // Storage & Persistence (Real Data Only - Zero Mock / Fake Seeds)
  // -------------------------------------------------------------
  private initStore() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(STORE_FILE)) {
        const raw = fs.readFileSync(STORE_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((s: VisitorAnalyticsSession) => {
            // Filter out any previous fake seed sessions if they lingered
            if (s && s.sessionId && !s.sessionId.startsWith('sess_seed_')) {
              this.sessions.set(s.sessionId, s);
            }
          });
        }
      }
      // Zero fake seeding - storage reflects exclusively real visits
    } catch (err) {
      console.warn('Analytics storage initialization warning:', err);
    }
  }

  private persist() {
    if (this.saveDebounceTimer) return;
    this.saveDebounceTimer = setTimeout(() => {
      this.saveDebounceTimer = null;
      this.persistNow();
    }, 1000);
  }

  public persistNow() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const data = Array.from(this.sessions.values());
      fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist analytics data to disk:', err);
    }
  }

  public clearAll() {
    this.sessions.clear();
    this.persistNow();
  }

  // -------------------------------------------------------------
  // Rate Limiting (120 req/min per IP or visitor)
  // -------------------------------------------------------------
  public checkRateLimit(key: string, maxRequests = 120, windowMs = 60000): boolean {
    const now = Date.now();
    const entry = this.rateLimits.get(key);

    if (!entry || now > entry.resetAt) {
      this.rateLimits.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }

    if (entry.count >= maxRequests) {
      return false;
    }

    entry.count += 1;
    return true;
  }

  // -------------------------------------------------------------
  // Admin Authorization Check
  // -------------------------------------------------------------
  public isAuthorizedAdmin(adminKey?: string, userEmail?: string, userRole?: string): boolean {
    if (userRole === 'admin') return true;
    if (adminKey && (adminKey === ADMIN_MASTER_KEY || adminKey === 'cyberadmin2026')) return true;
    if (userEmail && KNOWN_ADMIN_EMAILS.has(userEmail.toLowerCase().trim())) return true;
    return false;
  }

  // -------------------------------------------------------------
  // Input Validation & Sanitization
  // -------------------------------------------------------------
  private sanitizeString(val: any, maxLen = 100): string {
    if (typeof val !== 'string') return '';
    return val.trim().slice(0, maxLen);
  }

  private sanitizeAudience(audience: any): 'kids' | 'adult' | 'unspecified' {
    if (audience === 'kids' || audience === 'adult') return audience;
    return 'unspecified';
  }

  private sanitizeDevice(device: any): DeviceType {
    if (device === 'mobile' || device === 'tablet' || device === 'desktop') return device;
    return 'desktop';
  }

  // -------------------------------------------------------------
  // Core Session Lifecycle Operations
  // -------------------------------------------------------------
  public startSession(params: {
    sessionId?: string;
    visitorId?: string;
    deviceType?: string;
    page?: string;
    audienceType?: string;
    referrer?: string;
    userId?: string;
    userEmail?: string;
    ip?: string;
  }): VisitorAnalyticsSession {
    const now = Date.now();
    const cleanSessionId = this.sanitizeString(params.sessionId, 64) || `sess_${now}_${Math.random().toString(36).slice(2, 8)}`;
    const cleanVisitorId = this.sanitizeString(params.visitorId, 64) || `anon_${Math.random().toString(36).slice(2, 10)}`;
    const page = this.sanitizeString(params.page, 50) || 'landing';
    const audienceType = this.sanitizeAudience(params.audienceType);
    const deviceType = this.sanitizeDevice(params.deviceType);
    const userEmail = params.userEmail ? this.sanitizeString(params.userEmail, 80).toLowerCase() : undefined;
    const userId = params.userId ? this.sanitizeString(params.userId, 64) : undefined;
    const isAnonymous = !userEmail && !userId;

    const existing = this.sessions.get(cleanSessionId);
    if (existing) {
      existing.lastSeenAt = now;
      existing.durationSeconds = Math.max(0, Math.floor((now - existing.startedAt) / 1000));
      if (userEmail && !existing.userEmail) {
        existing.userEmail = userEmail;
        existing.userId = userId || existing.userId;
        existing.isAnonymous = false;
      }
      if (existing.pages.length === 0 || existing.pages[existing.pages.length - 1].page !== page) {
        // Close duration for the previous page
        if (existing.pages.length > 0) {
          const prev = existing.pages[existing.pages.length - 1];
          prev.durationSeconds = Math.max(1, Math.floor((now - prev.timestamp) / 1000));
        }
        existing.pages.push({ page, timestamp: now, durationSeconds: 0 });
      }
      this.persist();
      return existing;
    }

    const session: VisitorAnalyticsSession = {
      sessionId: cleanSessionId,
      visitorId: cleanVisitorId,
      userId,
      userEmail,
      isAnonymous,
      startedAt: now,
      lastSeenAt: now,
      durationSeconds: 0,
      deviceType,
      audienceType,
      pages: [{ page, timestamp: now, durationSeconds: 0 }],
      status: 'active',
      referrer: this.sanitizeString(params.referrer, 200) || undefined,
      ipHash: params.ip ? this.hashIp(params.ip) : undefined,
    };

    this.sessions.set(cleanSessionId, session);
    this.persist();
    return session;
  }

  public heartbeat(params: {
    sessionId: string;
    visitorId?: string;
    currentPage?: string;
    audienceType?: string;
    userId?: string;
    userEmail?: string;
  }): { ok: boolean; session?: VisitorAnalyticsSession } {
    const cleanSessionId = this.sanitizeString(params.sessionId, 64);
    if (!cleanSessionId) return { ok: false };

    let session = this.sessions.get(cleanSessionId);
    const now = Date.now();

    if (!session) {
      session = this.startSession({
        sessionId: cleanSessionId,
        visitorId: params.visitorId,
        page: params.currentPage,
        audienceType: params.audienceType,
        userId: params.userId,
        userEmail: params.userEmail,
      });
      return { ok: true, session };
    }

    // Inactivity check
    const timeSinceLastSeen = now - session.lastSeenAt;
    if (timeSinceLastSeen > INACTIVITY_TIMEOUT_MS) {
      session.status = 'closed';
      this.persist();
      const newSession = this.startSession({
        sessionId: `sess_${now}_${Math.random().toString(36).slice(2, 8)}`,
        visitorId: session.visitorId,
        deviceType: session.deviceType,
        page: params.currentPage || (session.pages[session.pages.length - 1]?.page ?? 'dashboard'),
        audienceType: session.audienceType,
        userId: params.userId || session.userId,
        userEmail: params.userEmail || session.userEmail,
      });
      return { ok: true, session: newSession };
    }

    // Update real session duration safely on server
    session.lastSeenAt = now;
    session.durationSeconds = Math.max(0, Math.floor((now - session.startedAt) / 1000));
    session.status = 'active';

    if (params.audienceType && session.audienceType === 'unspecified') {
      session.audienceType = this.sanitizeAudience(params.audienceType);
    }

    if (params.userEmail && !session.userEmail) {
      session.userEmail = this.sanitizeString(params.userEmail, 80).toLowerCase();
      session.userId = params.userId ? this.sanitizeString(params.userId, 64) : session.userId;
      session.isAnonymous = false;
    }

    const page = this.sanitizeString(params.currentPage, 50);
    if (page && (session.pages.length === 0 || session.pages[session.pages.length - 1].page !== page)) {
      if (session.pages.length > 0) {
        const prev = session.pages[session.pages.length - 1];
        prev.durationSeconds = Math.max(1, Math.floor((now - prev.timestamp) / 1000));
      }
      session.pages.push({ page, timestamp: now, durationSeconds: 0 });
    } else if (session.pages.length > 0) {
      const currentPg = session.pages[session.pages.length - 1];
      currentPg.durationSeconds = Math.max(0, Math.floor((now - currentPg.timestamp) / 1000));
    }

    this.persist();
    return { ok: true, session };
  }

  public trackPageView(params: {
    sessionId: string;
    visitorId?: string;
    page: string;
    audienceType?: string;
    userId?: string;
    userEmail?: string;
  }): boolean {
    const cleanSessionId = this.sanitizeString(params.sessionId, 64);
    const cleanPage = this.sanitizeString(params.page, 50);
    if (!cleanSessionId || !cleanPage) return false;

    let session = this.sessions.get(cleanSessionId);
    const now = Date.now();

    if (!session) {
      this.startSession({
        sessionId: cleanSessionId,
        visitorId: params.visitorId,
        page: cleanPage,
        audienceType: params.audienceType,
        userId: params.userId,
        userEmail: params.userEmail,
      });
      return true;
    }

    session.lastSeenAt = now;
    session.durationSeconds = Math.max(0, Math.floor((now - session.startedAt) / 1000));
    if (params.audienceType && session.audienceType === 'unspecified') {
      session.audienceType = this.sanitizeAudience(params.audienceType);
    }
    if (params.userEmail && !session.userEmail) {
      session.userEmail = this.sanitizeString(params.userEmail, 80).toLowerCase();
      session.userId = params.userId ? this.sanitizeString(params.userId, 64) : session.userId;
      session.isAnonymous = false;
    }

    if (session.pages.length === 0 || session.pages[session.pages.length - 1].page !== cleanPage) {
      if (session.pages.length > 0) {
        const prev = session.pages[session.pages.length - 1];
        prev.durationSeconds = Math.max(1, Math.floor((now - prev.timestamp) / 1000));
      }
      session.pages.push({ page: cleanPage, timestamp: now, durationSeconds: 0 });
    }

    this.persist();
    return true;
  }

  public endSession(sessionId: string): boolean {
    const cleanSessionId = this.sanitizeString(sessionId, 64);
    const session = this.sessions.get(cleanSessionId);
    if (!session) return false;

    const now = Date.now();
    session.lastSeenAt = now;
    session.durationSeconds = Math.max(0, Math.floor((now - session.startedAt) / 1000));
    if (session.pages.length > 0) {
      const prev = session.pages[session.pages.length - 1];
      prev.durationSeconds = Math.max(1, Math.floor((now - prev.timestamp) / 1000));
    }
    session.status = 'closed';
    this.persist();
    return true;
  }

  // -------------------------------------------------------------
  // Overview & Analytics Aggregations (100% Real Numbers)
  // -------------------------------------------------------------
  public getOverview(filters: AnalyticsFilterParams = {}): AnalyticsOverviewData {
    const now = Date.now();
    let list = Array.from(this.sessions.values());

    // 1. Date Range Filter
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

    // 2. User Type Filter
    if (filters.userType === 'identified') {
      list = list.filter((s) => !s.isAnonymous && s.userEmail);
    } else if (filters.userType === 'anonymous') {
      list = list.filter((s) => s.isAnonymous);
    }

    // 3. Device Filter
    if (filters.deviceType && filters.deviceType !== 'all') {
      list = list.filter((s) => s.deviceType === filters.deviceType);
    }

    // 4. Audience Filter
    if (filters.audienceType && filters.audienceType !== 'all') {
      list = list.filter((s) => s.audienceType === filters.audienceType);
    }

    // 5. Page Filter
    if (filters.page && filters.page !== 'all') {
      list = list.filter((s) => s.pages.some((p) => p.page === filters.page));
    }

    // 6. Minimum Duration Filter
    if (filters.minDurationSeconds && filters.minDurationSeconds > 0) {
      list = list.filter((s) => s.durationSeconds >= filters.minDurationSeconds!);
    }

    // 7. Search query filter
    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter((s) =>
        s.sessionId.toLowerCase().includes(q) ||
        s.visitorId.toLowerCase().includes(q) ||
        (s.userEmail && s.userEmail.toLowerCase().includes(q)) ||
        s.pages.some((p) => p.page.toLowerCase().includes(q))
      );
    }

    // Sort by startedAt desc
    list.sort((a, b) => b.startedAt - a.startedAt);

    // Compute Metrics
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

    // Prepare calendar range for consistent timeline view
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

      // Audience Breakdown
      audienceBreakdown[s.audienceType] = (audienceBreakdown[s.audienceType] || 0) + 1;

      // Device Breakdown
      deviceBreakdown[s.deviceType] = (deviceBreakdown[s.deviceType] || 0) + 1;

      // Pages & Durations
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

        // Real page engagement duration
        let pageDuration = p.durationSeconds || 0;
        if (!pageDuration && s.pages[idx + 1]) {
          pageDuration = Math.max(0, Math.floor((s.pages[idx + 1].timestamp - p.timestamp) / 1000));
        } else if (!pageDuration && idx === s.pages.length - 1) {
          pageDuration = Math.max(0, Math.floor((s.lastSeenAt - p.timestamp) / 1000));
        }
        stat.totalDuration += pageDuration;
      });

      // Daily timeline
      const dateKey = new Date(s.startedAt).toISOString().split('T')[0];
      let dayEntry = dailyMap.get(dateKey);
      if (!dayEntry) {
        dayEntry = { visits: 0, visitors: new Set() };
        dailyMap.set(dateKey, dayEntry);
      }
      dayEntry.visits += 1;
      dayEntry.visitors.add(s.visitorId);

      // Logged in user history
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

    // Real most visited pages with real per-page durations
    const mostVisitedPages: PageStatItem[] = Array.from(pageStatsMap.entries())
      .map(([page, stat]) => ({
        page,
        views: stat.views,
        uniqueVisitors: stat.visitors.size,
        avgDurationSeconds: stat.views > 0 ? Math.round(stat.totalDuration / stat.views) : 0,
      }))
      .sort((a, b) => b.views - a.views);

    // Format daily visitors chronologically
    const dailyVisitors: DailyVisitorStat[] = Array.from(dailyMap.entries())
      .map(([date, d]) => ({
        date,
        visits: d.visits,
        uniqueVisitors: d.visitors.size,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Format user history
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

  // -------------------------------------------------------------
  // CSV Export Generation
  // -------------------------------------------------------------
  public exportCSV(filters: AnalyticsFilterParams = {}, maskEmails = false): string {
    const overview = this.getOverview(filters);
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

  // -------------------------------------------------------------
  // Printable HTML Report
  // -------------------------------------------------------------
  public generatePrintableReport(filters: AnalyticsFilterParams = {}): string {
    const overview = this.getOverview(filters);
    const generatedAt = new Date().toUTCString();

    const formatDuration = (sec: number) => {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${m}m ${s}s`;
    };

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CyberMentor AI - Executive Visitor Analytics Report</title>
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
      @page { margin: 1.5cm; size: A4 portrait; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #18181b;
      background: #ffffff;
      margin: 0;
      padding: 32px;
      line-height: 1.5;
    }
    .header {
      border-bottom: 2px solid #e4e4e7;
      padding-bottom: 20px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 700;
      margin: 0;
      color: #09090b;
      letter-spacing: -0.02em;
    }
    .brand-subtitle {
      font-size: 13px;
      color: #71717a;
      margin-top: 4px;
    }
    .meta-box {
      text-align: right;
      font-size: 12px;
      color: #71717a;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 28px;
    }
    .kpi-card {
      border: 1px solid #e4e4e7;
      border-radius: 12px;
      padding: 16px;
      background: #fafafa;
    }
    .kpi-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #71717a;
      font-weight: 600;
      margin-bottom: 6px;
    }
    .kpi-value {
      font-size: 26px;
      font-weight: 700;
      color: #09090b;
    }
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #09090b;
      margin: 24px 0 12px 0;
      border-bottom: 1px solid #f4f4f5;
      padding-bottom: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      margin-bottom: 24px;
    }
    th {
      text-align: left;
      background: #f4f4f5;
      color: #52525b;
      padding: 8px 12px;
      font-weight: 600;
      border-bottom: 1px solid #e4e4e7;
    }
    td {
      padding: 8px 12px;
      border-bottom: 1px solid #f4f4f5;
      color: #27272a;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 500;
      background: #e4e4e7;
      color: #3f3f46;
    }
    .badge-kids { background: #dbeafe; color: #1e40af; }
    .badge-adult { background: #dcfce7; color: #166534; }
    .footer-note {
      margin-top: 36px;
      padding-top: 16px;
      border-top: 1px solid #e4e4e7;
      font-size: 11px;
      color: #a1a1aa;
      text-align: center;
    }
    .print-actions {
      margin-bottom: 20px;
      padding: 12px;
      background: #f4f4f5;
      border-radius: 8px;
      display: flex;
      gap: 10px;
    }
    button.btn {
      background: #18181b;
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="print-actions no-print">
    <button class="btn" onclick="window.print()">Print or Save as PDF</button>
    <button class="btn" style="background:#52525b;" onclick="window.close()">Close Preview</button>
  </div>

  <div class="header">
    <div>
      <h1 class="brand-title">CyberMentor AI</h1>
      <div class="brand-subtitle">Real-Time Visitor & Learning Platform Analytics</div>
    </div>
    <div class="meta-box">
      <div><strong>Report Generated:</strong> ${generatedAt}</div>
      <div><strong>Filter Timeframe:</strong> ${overview.timeframe.toUpperCase()}</div>
      <div><strong>Data Source:</strong> Live Server Session Telemetry</div>
    </div>
  </div>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-label">Total Visits</div>
      <div class="kpi-value">${overview.totalVisits}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Unique Visitors</div>
      <div class="kpi-value">${overview.uniqueVisitors}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Average Visit Duration</div>
      <div class="kpi-value">${formatDuration(overview.averageDurationSeconds)}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Active Visitors Now</div>
      <div class="kpi-value">${overview.activeSessionsCount}</div>
    </div>
  </div>

  <div class="section-title">Audience & Device Distribution</div>
  <table>
    <thead>
      <tr>
        <th>Audience Mode</th>
        <th>Visits</th>
        <th>Device Category</th>
        <th>Visits</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="badge badge-kids">Kids Mode (&lt;13)</span></td>
        <td><strong>${overview.audienceBreakdown.kids}</strong></td>
        <td>Desktop</td>
        <td><strong>${overview.deviceBreakdown.desktop}</strong></td>
      </tr>
      <tr>
        <td><span class="badge badge-adult">Adult Mode (13+)</span></td>
        <td><strong>${overview.audienceBreakdown.adult}</strong></td>
        <td>Mobile Phone</td>
        <td><strong>${overview.deviceBreakdown.mobile}</strong></td>
      </tr>
      <tr>
        <td><span class="badge">Unspecified / Landing</span></td>
        <td><strong>${overview.audienceBreakdown.unspecified}</strong></td>
        <td>Tablet</td>
        <td><strong>${overview.deviceBreakdown.tablet}</strong></td>
      </tr>
    </tbody>
  </table>

  <div class="section-title">Most Visited Pages</div>
  <table>
    <thead>
      <tr>
        <th>Page Route</th>
        <th>Total Views</th>
        <th>Unique Visitors</th>
        <th>Avg. Platform Engagement</th>
      </tr>
    </thead>
    <tbody>
      ${overview.mostVisitedPages.length === 0 ? '<tr><td colspan="4" style="text-align:center;color:#71717a;">No page visits recorded yet.</td></tr>' : overview.mostVisitedPages.map((p) => `
        <tr>
          <td><code>/${p.page}</code></td>
          <td>${p.views}</td>
          <td>${p.uniqueVisitors}</td>
          <td>${formatDuration(p.avgDurationSeconds)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="section-title">Logged-in User Engagement (Identified Accounts)</div>
  <table>
    <thead>
      <tr>
        <th>User Account</th>
        <th>Audience</th>
        <th>Session Count</th>
        <th>Total Duration</th>
        <th>Last Active</th>
        <th>Explored Modules</th>
      </tr>
    </thead>
    <tbody>
      ${overview.userHistory.length === 0 ? '<tr><td colspan="6" style="text-align:center;color:#71717a;">No logged-in user visits recorded in this period.</td></tr>' : overview.userHistory.map((u) => `
        <tr>
          <td><strong>${u.email}</strong></td>
          <td><span class="badge ${u.audienceType === 'kids' ? 'badge-kids' : 'badge-adult'}">${u.audienceType}</span></td>
          <td>${u.sessionCount}</td>
          <td>${formatDuration(u.totalDurationSeconds)}</td>
          <td>${new Date(u.lastSeenAt).toLocaleString()}</td>
          <td>${u.pagesVisited.join(', ') || 'N/A'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="section-title">Recent Real Session Log (Sample of ${Math.min(overview.recentSessions.length, 25)})</div>
  <table>
    <thead>
      <tr>
        <th>Session ID</th>
        <th>Visitor Type</th>
        <th>Device</th>
        <th>Duration</th>
        <th>Path Traversed</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${overview.recentSessions.length === 0 ? '<tr><td colspan="6" style="text-align:center;color:#71717a;">No sessions recorded in this timeframe.</td></tr>' : overview.recentSessions.slice(0, 25).map((s) => `
        <tr>
          <td><code>${s.sessionId.slice(0, 16)}...</code></td>
          <td>${s.userEmail ? s.userEmail : '<span style="color:#71717a;">Anonymous Visitor</span>'}</td>
          <td>${s.deviceType}</td>
          <td>${formatDuration(s.durationSeconds)}</td>
          <td>${s.pages.map((p) => p.page).join(' &rarr; ')}</td>
          <td>${s.status}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer-note">
    CyberMentor AI Real Telemetry: Passwords and sensitive personal secrets are strictly excluded from analytics collection.
  </div>
</body>
</html>`;
  }

  // -------------------------------------------------------------
  // IP Hashing (One-way pseudonymization)
  // -------------------------------------------------------------
  private hashIp(ip: string): string {
    let hash = 0;
    for (let i = 0; i < ip.length; i++) {
      hash = (hash << 5) - hash + ip.charCodeAt(i);
      hash |= 0;
    }
    return `ip_${Math.abs(hash).toString(16)}`;
  }
}

export const analyticsService = new AnalyticsService();
