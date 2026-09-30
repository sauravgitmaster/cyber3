import express from 'express';
import { roomService } from './roomService';
import { askByteMentor, analyzeMissionDecision } from './geminiService';
import { analyticsService } from './analyticsService';

export function createApp() {
  const app = express();

  // Core middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Friendly CORS header for preview/iframe environments
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-admin-key, x-user-email, x-user-role, X-Admin-Key, X-User-Email, X-User-Role'
    );
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // In-memory user store
  const usersStore = new Map<string, any>();

  // Prepopulate with demo account
  usersStore.set('saurav@cybermentor.app', {
    id: 'user_saurav_01',
    name: 'Saurav',
    email: 'saurav@cybermentor.app',
    avatar: '',
    level: 2,
    levelTitle: 'Digital Defender',
    currentXP: 450,
    digitalTrustScore: 84,
    streakDays: 3,
    completedModulesCount: 4,
    scenariosCompletedCount: 6,
    joinedDate: 'Sep 2026',
  });

  // ==========================================
  // Health & System Info
  // ==========================================
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'CyberMentor AI Backend Engine',
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString(),
      activeRoomsCount: roomService.getActiveRoomsCount?.() ?? 0,
    });
  });

  // ==========================================
  // Authentication Backends
  // ==========================================

  // Auth: Sign Up
  app.post('/api/auth/signup', (req, res) => {
    try {
      const { name, email, avatar, password, age, audienceType } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const lowerEmail = email.toLowerCase().trim();
      const existing = usersStore.get(lowerEmail);

      if (existing) {
        return res.json({
          user: existing,
          token: `token_${Date.now()}`,
        });
      }

      const parsedAge = age !== undefined && age !== null && age !== '' ? Number(age) : undefined;
      const parsedAudience = audienceType || (parsedAge !== undefined ? (parsedAge >= 13 ? 'adult' : 'kids') : undefined);

      const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        name: (name || '').trim() || lowerEmail.split('@')[0] || 'Cyber Explorer',
        email: lowerEmail,
        avatar: avatar || '',
        level: 1,
        levelTitle: 'Rookie',
        currentXP: 100,
        digitalTrustScore: 70,
        streakDays: 1,
        completedModulesCount: 0,
        scenariosCompletedCount: 0,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        ...(parsedAge !== undefined ? { age: parsedAge } : {}),
        ...(parsedAudience ? { audienceType: parsedAudience } : {}),
      };

      usersStore.set(lowerEmail, newUser);

      res.json({
        user: newUser,
        token: `token_${Date.now()}`,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Signup failed' });
    }
  });

  // Auth: Login
  app.post('/api/auth/login', (req, res) => {
    try {
      const { email } = req.body;
      const lowerEmail = (email || '').toLowerCase().trim();
      const user = usersStore.get(lowerEmail);

      if (user) {
        return res.json({
          user,
          token: `token_${Date.now()}`,
        });
      }

      // Friendly fallback: if not found, create a clean profile so children are never blocked!
      const fallbackUser = {
        id: `user_${Date.now()}`,
        name: email ? email.split('@')[0] : 'Cyber Explorer',
        email: lowerEmail || 'explorer@cybermentor.app',
        avatar: '',
        level: 1,
        levelTitle: 'Rookie',
        currentXP: 100,
        digitalTrustScore: 72,
        streakDays: 1,
        completedModulesCount: 0,
        scenariosCompletedCount: 0,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      };

      usersStore.set(fallbackUser.email, fallbackUser);

      res.json({
        user: fallbackUser,
        token: `token_${Date.now()}`,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Login failed' });
    }
  });

  // Auth: Me / Session Check
  app.get('/api/auth/me', (req, res) => {
    const email = (req.query.email as string)?.toLowerCase().trim();
    if (email && usersStore.has(email)) {
      return res.json({ user: usersStore.get(email) });
    }
    res.json({ user: null });
  });

  // Auth: Update Profile
  app.post('/api/auth/update', (req, res) => {
    try {
      const { email, name, avatar, digitalTrustScore, currentXP, level, levelTitle, age, audienceType } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'User email is required' });
      }

      const lowerEmail = email.toLowerCase().trim();
      const existing = usersStore.get(lowerEmail) || { email: lowerEmail };

      const parsedAge = age !== undefined && age !== null && age !== '' ? Number(age) : undefined;
      const parsedAudience = audienceType || (parsedAge !== undefined ? (parsedAge >= 13 ? 'adult' : 'kids') : undefined);

      const updated = {
        ...existing,
        ...(name ? { name: name.trim() } : {}),
        ...(avatar ? { avatar } : {}),
        ...(digitalTrustScore !== undefined ? { digitalTrustScore } : {}),
        ...(currentXP !== undefined ? { currentXP } : {}),
        ...(level !== undefined ? { level } : {}),
        ...(levelTitle ? { levelTitle } : {}),
        ...(parsedAge !== undefined ? { age: parsedAge } : {}),
        ...(parsedAudience ? { audienceType: parsedAudience } : {}),
        updatedAt: Date.now(),
      };

      usersStore.set(lowerEmail, updated);
      res.json({ user: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Update failed' });
    }
  });

  // ==========================================
  // AI Mentor & Coaching Backends
  // ==========================================

  // AI Mentor: Chat with Byte (Server-Side Gemini Integration)
  app.post('/api/mentor/chat', async (req, res) => {
    try {
      const { question, context } = req.body;
      if (!question || typeof question !== 'string') {
        return res.status(400).json({ error: 'A question is required' });
      }

      const reply = await askByteMentor(question, context);
      res.json(reply);
    } catch (err: any) {
      res.status(500).json({
        reply: "I'm having a little trouble connecting my cyber antenna right now, but remember: always pause and verify unexpected links!",
        mood: 'thinking',
        error: err.message,
      });
    }
  });

  // AI Mentor: Scenario Decision Coaching
  app.post('/api/scenario/feedback', async (req, res) => {
    try {
      const { missionTitle, userChoice, isOptimal, scenarioContext, audienceType } = req.body;
      if (!missionTitle || !userChoice) {
        return res.status(400).json({ error: 'Mission title and user choice are required' });
      }

      const analysis = await analyzeMissionDecision({
        missionTitle,
        userChoice,
        isOptimal: !!isOptimal,
        scenarioContext,
        audienceType,
      });

      res.json(analysis);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==========================================
  // Quick Cyber Check Evaluation Backend
  // ==========================================
  app.post('/api/skill-check/evaluate', (req, res) => {
    try {
      const { answers } = req.body; // Array of option selections
      // Diagnostic calculation:
      let score = 50;
      let strengths: string[] = [];
      let focusAreas: string[] = [];

      if (Array.isArray(answers)) {
        answers.forEach((ans: any) => {
          if (ans.isOptimal) {
            score += 10;
            if (ans.category) strengths.push(ans.category);
          } else {
            if (ans.category) focusAreas.push(ans.category);
          }
        });
      }

      score = Math.max(50, Math.min(95, score));

      res.json({
        smartScore: score,
        strengths: Array.from(new Set(strengths)),
        focusAreas: Array.from(new Set(focusAreas)),
        levelTitle: score >= 80 ? 'Cyber Sleuth' : score >= 65 ? 'Digital Defender' : 'Cyber Explorer',
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==========================================
  // Community Leaderboard Backend
  // ==========================================
  app.get('/api/leaderboard', (req, res) => {
    const mockLeaderboard = [
      { id: '1', name: 'Maya S.', avatar: '', score: 94, level: 'Cyber Guardian', xp: 1420 },
      { id: '2', name: 'Liam K.', avatar: '', score: 91, level: 'Digital Defender', xp: 1280 },
      { id: '3', name: 'Zoe P.', avatar: '', score: 88, level: 'Cyber Sleuth', xp: 1150 },
      { id: '4', name: 'Ethan R.', avatar: '', score: 84, level: 'Cyber Sleuth', xp: 980 },
      { id: '5', name: 'Sofia T.', avatar: '', score: 82, level: 'Digital Defender', xp: 890 },
    ];
    res.json({ leaderboard: mockLeaderboard });
  });

  // ==========================================
  // Multiplayer Game Engine Backends
  // ==========================================

  // Multiplayer Room: Create (supports both /api/rooms/create and /api/room/create)
  app.post(['/api/rooms/create', '/api/room/create'], (req, res) => {
    try {
      const host = req.body.host || req.body.player;
      const audienceType = req.body.audienceType || (host && host.audienceType);
      if (!host || !host.id) {
        return res.status(400).json({ error: 'Host player information required' });
      }
      const room = roomService.createRoom(host, audienceType);
      res.json(room);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Multiplayer Room: Join (supports both /api/rooms/join and /api/room/join)
  app.post(['/api/rooms/join', '/api/room/join'], (req, res) => {
    try {
      const code = req.body.code || req.body.roomCode;
      const guest = req.body.guest || req.body.player;
      if (!code || !guest || !guest.id) {
        return res.status(400).json({ error: 'Game code and player info required' });
      }
      const room = roomService.joinRoom(code, guest);
      res.json(room);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Multiplayer Room: Get state (sync polling fallback)
  app.get(['/api/rooms/:code', '/api/room/:code'], (req, res) => {
    try {
      const { code } = req.params;
      const playerId = req.query.playerId as string | undefined;
      const room = roomService.getRoom(code, playerId);
      res.json(room);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  });

  // Multiplayer Room: Start game
  app.post(['/api/rooms/:code/start', '/api/room/:code/start'], (req, res) => {
    try {
      const { code } = req.params;
      const { playerId } = req.body;
      const room = roomService.startGame(code, playerId);
      res.json(room);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Multiplayer Room: Submit answer
  app.post(['/api/rooms/:code/answer', '/api/room/:code/answer'], (req, res) => {
    try {
      const { code } = req.params;
      const { playerId, questionId, optionId } = req.body;
      const room = roomService.submitAnswer(code, playerId, questionId, optionId);
      res.json(room);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Multiplayer Room: Restart game (Play Again)
  app.post(['/api/rooms/:code/restart', '/api/room/:code/restart'], (req, res) => {
    try {
      const { code } = req.params;
      const { playerId } = req.body;
      const room = roomService.restartGame(code, playerId);
      res.json(room);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Multiplayer Room: SSE Real-time Events Stream
  app.get(['/api/rooms/:code/events', '/api/room/:code/events'], (req, res) => {
    const { code } = req.params;
    const playerId = (req.query.playerId as string) || '';
    roomService.subscribe(code, playerId, res);
  });

  // Multiplayer Room: Heartbeat
  app.post(['/api/rooms/:code/heartbeat', '/api/room/:code/heartbeat'], (req, res) => {
    const { code } = req.params;
    const { playerId } = req.body;
    const ok = roomService.heartbeat(code, playerId);
    res.json({ ok });
  });

  // Multiplayer Room: Leave
  app.post(['/api/rooms/:code/leave', '/api/room/:code/leave'], (req, res) => {
    const { code } = req.params;
    const { playerId } = req.body;
    roomService.leaveRoom(code, playerId);
    res.json({ left: true });
  });

  // ==========================================
  // Privacy-Conscious Visitor Analytics APIs
  // ==========================================

  // Helper middleware for analytics rate limiting
  const analyticsRateLimiter = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const clientKey = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'client';
    if (!analyticsService.checkRateLimit(clientKey, 150, 60000)) {
      return res.status(429).json({ error: 'Too many analytics requests. Please wait a moment.' });
    }
    next();
  };

  // Helper to extract & test admin authorization
  const checkAdminAuth = (req: express.Request): boolean => {
    const adminKey = (req.headers['x-admin-key'] as string) || (req.query.adminKey as string) || '';
    const userEmail = (req.headers['x-user-email'] as string) || (req.query.userEmail as string) || '';
    const userRole = (req.headers['x-user-role'] as string) || '';

    // Check bearer token if present
    const authHeader = req.headers.authorization;
    let bearerToken = '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      bearerToken = authHeader.substring(7).trim();
    }

    return analyticsService.isAuthorizedAdmin(adminKey || bearerToken, userEmail, userRole);
  };

  // Analytics: Start Session
  app.post('/api/analytics/session/start', analyticsRateLimiter, (req, res) => {
    try {
      const { sessionId, visitorId, deviceType, page, audienceType, referrer, userId, userEmail } = req.body;
      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || undefined;
      const userAgent = (req.headers['user-agent'] as string) || '';

      const session = analyticsService.startSession({
        sessionId,
        visitorId,
        deviceType,
        page,
        audienceType,
        referrer,
        userId,
        userEmail,
        ip: clientIp,
        userAgent,
      });

      res.json({ success: true, session });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to start session' });
    }
  });

  // Analytics: Heartbeat (every 30-60s)
  app.post('/api/analytics/session/heartbeat', analyticsRateLimiter, (req, res) => {
    try {
      const { sessionId, visitorId, currentPage, audienceType, userId, userEmail, deviceType } = req.body;
      const userAgent = (req.headers['user-agent'] as string) || '';
      if (!sessionId) {
        return res.status(400).json({ error: 'sessionId is required for heartbeat' });
      }

      const result = analyticsService.heartbeat({
        sessionId,
        visitorId,
        currentPage,
        audienceType,
        userId,
        userEmail,
        deviceType,
        userAgent,
      });

      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Heartbeat failed' });
    }
  });

  // Analytics: Track Page View
  app.post('/api/analytics/pageview', analyticsRateLimiter, (req, res) => {
    try {
      const { sessionId, visitorId, page, audienceType, userId, userEmail, deviceType } = req.body;
      const userAgent = (req.headers['user-agent'] as string) || '';
      if (!sessionId || !page) {
        return res.status(400).json({ error: 'sessionId and page are required' });
      }

      const success = analyticsService.trackPageView({
        sessionId,
        visitorId,
        page,
        audienceType,
        userId,
        userEmail,
        deviceType,
        userAgent,
      });

      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to track page view' });
    }
  });

  // Analytics: End Session
  app.post('/api/analytics/session/end', (req, res) => {
    try {
      const { sessionId } = req.body;
      if (sessionId) {
        analyticsService.endSession(sessionId);
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to end session' });
    }
  });

  // Analytics: Admin Auth Verification
  app.post('/api/analytics/admin/verify', (req, res) => {
    const { adminKey, email } = req.body;
    const isAuthorized = analyticsService.isAuthorizedAdmin(adminKey, email);
    res.json({ authorized: isAuthorized });
  });

  // Analytics: Clear / Reset Records (Protected: Authorized Admins only)
  app.post('/api/analytics/admin/clear', (req, res) => {
    try {
      if (!checkAdminAuth(req)) {
        return res.status(403).json({ error: 'Unauthorized. Admin authorization required to reset analytics data.' });
      }
      analyticsService.clearAll();
      res.json({ success: true, message: 'All visitor analytics records have been cleared.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to clear analytics records' });
    }
  });

  // Analytics: Admin Overview Report (Protected: Authorized Admins only)
  app.get('/api/analytics/overview', (req, res) => {
    try {
      if (!checkAdminAuth(req)) {
        return res.status(403).json({
          error: 'Unauthorized. Admin authorization required to access visitor analytics metrics.',
        });
      }

      const {
        dateRange,
        userType,
        deviceType,
        page,
        minDurationSeconds,
        audienceType,
        search,
      } = req.query;

      const overview = analyticsService.getOverview({
        dateRange: dateRange as any,
        userType: userType as any,
        deviceType: deviceType as any,
        page: page as string,
        minDurationSeconds: minDurationSeconds ? Number(minDurationSeconds) : undefined,
        audienceType: audienceType as any,
        search: search as string,
      });

      res.json(overview);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to retrieve analytics overview' });
    }
  });

  // Analytics: CSV Export (Protected: Authorized Admins only)
  app.get('/api/analytics/export', (req, res) => {
    try {
      if (!checkAdminAuth(req)) {
        return res.status(403).send('Unauthorized. Admin authorization required to export visitor analytics data.');
      }

      const { dateRange, userType, deviceType, page, audienceType, mask } = req.query;
      const maskEmails = mask === 'true' || mask === '1';

      const csvData = analyticsService.exportCSV(
        {
          dateRange: dateRange as any,
          userType: userType as any,
          deviceType: deviceType as any,
          page: page as string,
          audienceType: audienceType as any,
        },
        maskEmails
      );

      const filename = `cybermentor-visitor-analytics-${new Date().toISOString().split('T')[0]}.csv`;
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.status(200).send(csvData);
    } catch (err: any) {
      res.status(500).send(`Failed to generate CSV export: ${err.message}`);
    }
  });

  // Analytics: Printable Executive Report (Protected: Authorized Admins only)
  app.get('/api/analytics/report', (req, res) => {
    try {
      if (!checkAdminAuth(req)) {
        return res.status(403).send('<!DOCTYPE html><html><body><h2>Unauthorized</h2><p>Admin authorization key is required to view this report.</p></body></html>');
      }

      const { dateRange, userType, deviceType, audienceType } = req.query;
      const htmlReport = analyticsService.generatePrintableReport({
        dateRange: dateRange as any,
        userType: userType as any,
        deviceType: deviceType as any,
        audienceType: audienceType as any,
      });

      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(htmlReport);
    } catch (err: any) {
      res.status(500).send(`Failed to generate printable report: ${err.message}`);
    }
  });

  return app;
}

export default createApp();
