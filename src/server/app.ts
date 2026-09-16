import express from 'express';
import { roomService } from './roomService';
import { askByteMentor, analyzeMissionDecision } from './geminiService';

export function createApp() {
  const app = express();

  // Core middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Friendly CORS header for preview/iframe environments
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
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
    avatar: '🦊',
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
      const { name, email, avatar, password } = req.body;
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

      const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        name: (name || '').trim() || lowerEmail.split('@')[0] || 'Cyber Explorer',
        email: lowerEmail,
        avatar: avatar || '🤖',
        level: 1,
        levelTitle: 'Rookie',
        currentXP: 100,
        digitalTrustScore: 70,
        streakDays: 1,
        completedModulesCount: 0,
        scenariosCompletedCount: 0,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
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
        avatar: '🤖',
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
      const { email, name, avatar, digitalTrustScore, currentXP, level, levelTitle } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'User email is required' });
      }

      const lowerEmail = email.toLowerCase().trim();
      const existing = usersStore.get(lowerEmail) || { email: lowerEmail };

      const updated = {
        ...existing,
        ...(name ? { name: name.trim() } : {}),
        ...(avatar ? { avatar } : {}),
        ...(digitalTrustScore !== undefined ? { digitalTrustScore } : {}),
        ...(currentXP !== undefined ? { currentXP } : {}),
        ...(level !== undefined ? { level } : {}),
        ...(levelTitle ? { levelTitle } : {}),
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
      const { missionTitle, userChoice, isOptimal, scenarioContext } = req.body;
      if (!missionTitle || !userChoice) {
        return res.status(400).json({ error: 'Mission title and user choice are required' });
      }

      const analysis = await analyzeMissionDecision({
        missionTitle,
        userChoice,
        isOptimal: !!isOptimal,
        scenarioContext,
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
      { id: '1', name: 'Maya S.', avatar: '⚡', score: 94, level: 'Cyber Guardian', xp: 1420 },
      { id: '2', name: 'Liam K.', avatar: '🛡️', score: 91, level: 'Digital Defender', xp: 1280 },
      { id: '3', name: 'Zoe P.', avatar: '🔍', score: 88, level: 'Cyber Sleuth', xp: 1150 },
      { id: '4', name: 'Ethan R.', avatar: '🦊', score: 84, level: 'Cyber Sleuth', xp: 980 },
      { id: '5', name: 'Sofia T.', avatar: '🚀', score: 82, level: 'Digital Defender', xp: 890 },
    ];
    res.json({ leaderboard: mockLeaderboard });
  });

  // ==========================================
  // Multiplayer Game Engine Backends
  // ==========================================

  // Multiplayer Room: Create
  app.post('/api/rooms/create', (req, res) => {
    try {
      const { host } = req.body;
      if (!host || !host.id) {
        return res.status(400).json({ error: 'Host player information required' });
      }
      const room = roomService.createRoom(host);
      res.json(room);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Multiplayer Room: Join
  app.post('/api/rooms/join', (req, res) => {
    try {
      const { code, guest } = req.body;
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
  app.get('/api/rooms/:code', (req, res) => {
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
  app.post('/api/rooms/:code/start', (req, res) => {
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
  app.post('/api/rooms/:code/answer', (req, res) => {
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
  app.post('/api/rooms/:code/restart', (req, res) => {
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
  app.get('/api/rooms/:code/events', (req, res) => {
    const { code } = req.params;
    const playerId = (req.query.playerId as string) || '';
    roomService.subscribe(code, playerId, res);
  });

  // Multiplayer Room: Heartbeat
  app.post('/api/rooms/:code/heartbeat', (req, res) => {
    const { code } = req.params;
    const { playerId } = req.body;
    const ok = roomService.heartbeat(code, playerId);
    res.json({ ok });
  });

  // Multiplayer Room: Leave
  app.post('/api/rooms/:code/leave', (req, res) => {
    const { code } = req.params;
    const { playerId } = req.body;
    roomService.leaveRoom(code, playerId);
    res.json({ left: true });
  });

  return app;
}

export default createApp();
