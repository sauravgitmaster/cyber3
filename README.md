# CyberMentor AI

An interactive cybersecurity education framework transforming digital-safety training through scenario-based learning and AI mentoring. CyberMentor AI pairs a React 19 + Vite 6 single-page app with an Express backend that powers an AI mentor ("Byte", backed by Google Gemini with a rule-engine fallback), a real-time 1v1 multiplayer quiz built on Server-Sent Events, skill diagnostics, and gamified progression — levels, streaks, achievements, and a Cyber Smart Score.

## Features

- **Gamified scenario-based learning** — missions and learning paths with XP, levels, streaks, and a Digital Trust / Smart Score out of 100.
- **AI mentor "Byte"** — a chat drawer answering learner questions. Uses Google Gemini when `GEMINI_API_KEY` is set and falls back to a deterministic keyword rule engine otherwise, so the app is fully usable with no API key.
- **Real-time 1v1 multiplayer quiz** — 6-character room codes, 8 questions, 10-second rounds, live scores streamed over SSE with an authoritative server clock.
- **Skill checks** — a quick diagnostic that returns a Smart Score plus strengths and focus areas per security category.
- **Leaderboard** — community standings with score, level title, and XP.
- **Achievements & certificates** — unlockable badges and a printable certificate modal.
- **Profile & analytics** — progress dashboards, category-level competency, and editable profile with avatar upload.

## Tech stack

| Layer | Technology |
| --- | --- |
| UI | React 19, React DOM 19, Tailwind CSS v4 (`@tailwindcss/vite`), lucide-react |
| Motion & visuals | motion, canvas-confetti, cobe |
| Build/dev | Vite 6, `@vitejs/plugin-react`, TypeScript 5.8, tsx, esbuild |
| Server | Express 4, dotenv |
| AI | `@google/genai` (Gemini) |
| Peer networking | peerjs |

## Project structure

```
.
├── api/index.ts              # Serverless entry — exports createApp()
├── server.ts                 # Standalone Node entry (Vite middleware in dev, static dist in prod)
├── index.html                # SPA shell
├── render.yaml               # Render web service config
├── vercel.json               # Vercel build + rewrites config
└── src/
    ├── pages/                # Route-level views (Dashboard, Scenario, Multiplayer, Leaderboard, ...)
    ├── components/
    │   ├── common/           # Byte mascot, AI mentor drawer, trust gauge, certificate modal
    │   ├── landing/          # Hero background and product preview
    │   ├── layout/           # Navbar, Sidebar, MobileNav
    │   └── multiplayer/      # Create/Join game, question, score bar, results, review
    ├── server/
    │   ├── app.ts            # createApp(): all REST + SSE routes, CORS, in-memory user store
    │   ├── roomService.ts    # Authoritative multiplayer room engine
    │   └── geminiService.ts  # Gemini calls for Byte + mission feedback, with rule-engine fallback
    ├── hooks/                # useCyberState, useMultiplayerRoom
    ├── context/              # ThemeContext
    ├── data/                 # missionsData, mockData, multiplayerQuestions
    ├── types/                # Shared TypeScript contracts (incl. multiplayer)
    └── utils/                # adaptiveEngine, levelSystem, multiplayerApi, relays
```

## Getting started

### Prerequisites

- Node.js 18+ (Node 20 LTS recommended) and npm.

### Install

```bash
npm install
```

### Environment

Create a `.env` file in the repo root:

```bash
# Optional — enables Gemini-backed responses for Byte and mission feedback.
# Without it, src/server/geminiService.ts serves its rule-engine fallback responses.
GEMINI_API_KEY=your_api_key_here

# Optional — set to "production" to serve the prebuilt dist/ instead of Vite middleware.
NODE_ENV=development
```

### Scripts

| Script | Command | Description |
| --- | --- | --- |
| `npm run dev` | `tsx server.ts` | Runs the Express API with Vite middleware on http://localhost:3000 |
| `npm run build` | `vite build` + `esbuild server.ts` | Builds the SPA into `dist/` and bundles the server to `dist/server.cjs` |
| `npm start` | `node dist/server.cjs` | Runs the production build (set `NODE_ENV=production`) |
| `npm run preview` | `vite preview` | Previews the built frontend only |
| `npm run lint` | `tsc --noEmit` | Type-checks the whole project |
| `npm run clean` | `rm -rf dist server.js` | Removes build output |

## Deployment

- **Render** — `render.yaml` defines a free Node web service `cybermentor-app` with `npm install && npm run build` as the build command and `npm run start` as the start command, with `NODE_ENV=production`.
- **Vercel** — `vercel.json` builds with `vite build` into `dist`, rewrites `/api/(.*)` to the serverless function and everything else to `/index.html`. The function entry is `api/index.ts`, which simply calls `createApp()` from `src/server/app.ts` and exports the Express app.

Note: the user store and multiplayer rooms live in process memory, so serverless deployments with multiple instances will not share state.

## REST API reference

All routes are defined in `src/server/app.ts`. A permissive CORS middleware sets `Access-Control-Allow-Origin: *` and answers `OPTIONS` with `200`. Users are kept in an **in-memory `Map`** (seeded with a demo account, `saurav@cybermentor.app`) — nothing is persisted across restarts, and there is no real password verification.

### Overview

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Service health, Gemini config flag, active room count |
| POST | `/api/auth/signup` | Create (or return existing) user profile |
| POST | `/api/auth/login` | Look up a user; creates a fallback profile if unknown |
| GET | `/api/auth/me` | Fetch user by email query param |
| POST | `/api/auth/update` | Patch profile fields |
| POST | `/api/mentor/chat` | Ask Byte a question |
| POST | `/api/scenario/feedback` | Coaching for a mission decision |
| POST | `/api/skill-check/evaluate` | Score a skill check submission |
| GET | `/api/leaderboard` | Community leaderboard |
| POST | `/api/rooms/create` | Create a multiplayer room |
| POST | `/api/rooms/join` | Join a room by code |
| GET | `/api/rooms/:code` | Poll room state |
| POST | `/api/rooms/:code/start` | Start the game (host) |
| POST | `/api/rooms/:code/answer` | Submit an answer |
| POST | `/api/rooms/:code/restart` | Play again with fresh questions |
| GET | `/api/rooms/:code/events` | SSE stream of room state |
| POST | `/api/rooms/:code/heartbeat` | Keep a player marked connected |
| POST | `/api/rooms/:code/leave` | Mark a player disconnected |

Every multiplayer route is also registered under the singular alias `/api/room/...` (e.g. `POST /api/room/create`, `GET /api/room/:code/events`).

---

### Health

#### `GET /api/health`

No parameters.

```json
{
  "status": "ok",
  "service": "CyberMentor AI Backend Engine",
  "geminiConfigured": false,
  "timestamp": "2026-09-17T07:04:00.000Z",
  "activeRoomsCount": 2
}
```

---

### Authentication

#### `POST /api/auth/signup`

Body:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `email` | string | yes | Lowercased and trimmed; `400` if missing |
| `name` | string | no | Defaults to the email local part, else `Cyber Explorer` |
| `avatar` | string | no | Data URL or image URL |
| `password` | string | no | Accepted but not stored or verified |

If the email already exists, the existing profile is returned instead of a new one.

```json
{
  "user": {
    "id": "user_1758092640000_k3f9zq",
    "name": "Explorer",
    "email": "explorer@cybermentor.app",
    "avatar": "",
    "level": 1,
    "levelTitle": "Rookie",
    "currentXP": 100,
    "digitalTrustScore": 70,
    "streakDays": 1,
    "completedModulesCount": 0,
    "scenariosCompletedCount": 0,
    "joinedDate": "Sep 2026"
  },
  "token": "token_1758092640000"
}
```

#### `POST /api/auth/login`

Body: `{ "email": "saurav@cybermentor.app" }`. No password check. If the email is unknown, a clean fallback profile (`digitalTrustScore: 72`) is created and stored so learners are never blocked.

```json
{
  "user": {
    "id": "user_saurav_01",
    "name": "Saurav",
    "email": "saurav@cybermentor.app",
    "avatar": "",
    "level": 2,
    "levelTitle": "Digital Defender",
    "currentXP": 450,
    "digitalTrustScore": 84,
    "streakDays": 3,
    "completedModulesCount": 4,
    "scenariosCompletedCount": 6,
    "joinedDate": "Sep 2026"
  },
  "token": "token_1758092640000"
}
```

#### `GET /api/auth/me?email=<email>`

Query param `email` (case-insensitive). Returns `{ "user": null }` when absent or unknown — always `200`.

```json
{ "user": { "id": "user_saurav_01", "name": "Saurav", "email": "saurav@cybermentor.app", "level": 2 } }
```

#### `POST /api/auth/update`

Body: `email` (required, `400` if missing), plus any of `name`, `avatar`, `digitalTrustScore`, `currentXP`, `level`, `levelTitle`. Only provided fields are merged; an `updatedAt` timestamp is added. Unknown emails are created as a new record.

```json
{
  "user": {
    "id": "user_saurav_01",
    "name": "Saurav",
    "email": "saurav@cybermentor.app",
    "digitalTrustScore": 88,
    "currentXP": 520,
    "updatedAt": 1758092640000
  }
}
```

---

### AI mentor & coaching

#### `POST /api/mentor/chat`

Body:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `question` | string | yes | `400` if missing or not a string |
| `context` | object | no | `{ score?, page?, name?, recentMission? }` used to personalize the reply |

Returns Byte's reply; `mood` is one of `happy`, `waving`, `thinking`, `detective`, `caution`, `cheering`, `excited`. On an internal error the handler responds `500` with a friendly fallback `reply`, `mood: "thinking"`, and `error`.

```json
{
  "reply": "Great question, Maya! Treat passwords like a treasure chest...",
  "technical": "Password hashing with a salt makes precomputed rainbow tables useless.",
  "mood": "happy"
}
```

#### `POST /api/scenario/feedback`

Body:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `missionTitle` | string | yes | `400` if missing |
| `userChoice` | string | yes | `400` if missing |
| `isOptimal` | boolean | no | Coerced with `!!` |
| `scenarioContext` | string | no | Extra situation detail for the prompt |

```json
{
  "coaching": "Outstanding detective work! You spotted the danger signs and kept your digital identity safe.",
  "detectiveTip": "Keep checking sender addresses and unexpected urgent demands."
}
```

---

### Skill check

#### `POST /api/skill-check/evaluate`

Body: `{ "answers": [{ "isOptimal": true, "category": "Phishing" }, ...] }`.

Scoring: start at **50**, add **+10** per answer with `isOptimal: true`, then clamp to **50–95**. Categories from optimal answers become `strengths`, the rest become `focusAreas` (both de-duplicated). `levelTitle` is `Cyber Sleuth` at ≥ 80, `Digital Defender` at ≥ 65, otherwise `Cyber Explorer`. A non-array `answers` value simply yields the base score.

```json
{
  "smartScore": 80,
  "strengths": ["Phishing", "Passwords"],
  "focusAreas": ["Privacy"],
  "levelTitle": "Cyber Sleuth"
}
```

---

### Leaderboard

#### `GET /api/leaderboard`

No parameters. Returns a static demo leaderboard.

```json
{
  "leaderboard": [
    { "id": "1", "name": "Maya S.", "avatar": "", "score": 94, "level": "Cyber Guardian", "xp": 1420 },
    { "id": "2", "name": "Liam K.", "avatar": "", "score": 91, "level": "Digital Defender", "xp": 1280 }
  ]
}
```

---

### Multiplayer

Unless noted, these endpoints return the **client room state** produced by `toClientState()`:

```json
{
  "code": "7KQD3M",
  "status": "in_round",
  "host": { "id": "user_1", "name": "Maya", "avatar": "", "score": 100, "correctCount": 1, "fastestResponseMs": 2140, "isConnected": true, "lastSeen": 1758092640000 },
  "guest": { "id": "user_2", "name": "Liam", "avatar": "", "score": 60, "correctCount": 1, "fastestResponseMs": null, "isConnected": true, "lastSeen": 1758092640000 },
  "currentRound": 2,
  "totalRounds": 8,
  "currentQuestion": {
    "id": "mp-q1",
    "roundNumber": 2,
    "totalRounds": 8,
    "category": "Scam & Phishing",
    "difficulty": "Beginner",
    "situation": "A DM says: \"You won 10,000 free Robux! Click right now!\"",
    "prompt": "What's the safe choice?",
    "options": [{ "id": "opt-a", "text": "Click the link fast" }, { "id": "opt-b", "text": "Report the message as a scam and delete it" }]
  },
  "roundStartTime": 1758092638000,
  "roundDurationSec": 10,
  "timeRemainingMs": 7400,
  "answeredPlayerIds": ["user_1"],
  "lastRoundResult": null,
  "roundHistory": [],
  "updatedAt": 1758092640000
}
```

`currentQuestion` is only populated while the status is `in_round` or `round_locked`, and it never includes `correctOptionId` — the answer is revealed only through `lastRoundResult` / `roundHistory` once the round locks.

#### `POST /api/rooms/create` · alias `POST /api/room/create`

Body: `{ "host": { "id": "user_1", "name": "Maya", "avatar": "" } }`. `400` if `host` or `host.id` is missing. Returns a room in status `waiting` with a fresh 6-character code and 8 randomly selected questions.

#### `POST /api/rooms/join` · alias `POST /api/room/join`

Body: `{ "code": "7KQD3M", "guest": { "id": "user_2", "name": "Liam", "avatar": "" } }`. `code`/`roomCode` and `guest`/`player` are both accepted. `400` with `"Hmm… I can’t find that game."` for an unknown code, or `"This game has ended."` for an expired room. If the joining ID equals the host ID (e.g. two tabs, same login), a disambiguated guest ID is generated.

#### `GET /api/rooms/:code?playerId=<id>` · alias `GET /api/room/:code`

Polling fallback for clients without SSE. The optional `playerId` query param refreshes that player's `lastSeen`/`isConnected`. `404` if the room does not exist.

#### `POST /api/rooms/:code/start` · alias `POST /api/room/:code/start`

Body: `{ "playerId": "user_1" }`. Resets scores and history, moves the room to `starting`. If no guest is attached yet, a placeholder "Friend" guest is auto-attached so the host is never blocked. `400` if the room is unknown.

#### `POST /api/rooms/:code/answer` · alias `POST /api/room/:code/answer`

Body: `{ "playerId": "user_2", "questionId": "mp-q1", "optionId": "opt-b" }`. Ignored (current state returned unchanged) when the room is not `in_round`, the `questionId` is stale, or the player already answered. `400` if the room is unknown, or if the player is not in the game (`"Player not in this game"`).

#### `POST /api/rooms/:code/restart` · alias `POST /api/room/:code/restart`

Body: `{ "playerId": "user_1" }`. Draws 8 new questions (excluding the previous set), zeroes scores and history, then goes to `starting` if both players are connected, otherwise back to `waiting`.

#### `GET /api/rooms/:code/events?playerId=<id>` · alias `GET /api/room/:code/events`

Server-Sent Events stream (`text/event-stream`, `Cache-Control: no-cache`, `Connection: keep-alive`). The current snapshot is sent immediately on connect, then every state change is pushed as `data: <RoomStateClient JSON>`. Responds `404 {"error":"Game not found"}` for an unknown code.

```
data: {"code":"7KQD3M","status":"in_round","currentRound":2,...}

```

```js
const es = new EventSource(`/api/rooms/${code}/events?playerId=${playerId}`);
es.onmessage = (e) => setRoom(JSON.parse(e.data));
```

#### `POST /api/rooms/:code/heartbeat` · alias `POST /api/room/:code/heartbeat`

Body: `{ "playerId": "user_2" }`. Refreshes `lastSeen` and marks the player connected.

```json
{ "ok": true }
```

Returns `{ "ok": false }` when the room does not exist.

#### `POST /api/rooms/:code/leave` · alias `POST /api/room/:code/leave`

Body: `{ "playerId": "user_2" }`. Marks the player disconnected and broadcasts the change.

```json
{ "left": true }
```

## Multiplayer engine

`src/server/roomService.ts` is the authoritative game engine; clients never decide outcomes.

- **Room codes** — 6 characters drawn from `23456789ABCDEFGHJKLMNPQRSTUVWXYZ` (no `0/O` or `1/I`), regenerated on collision. Lookups uppercase and trim the code.
- **Game shape** — 8 randomly selected questions per game, 10-second rounds (`roundDurationSec: 10`).
- **Scoring** — **100** points to the first player with the correct answer, **60** to the second; wrong answers score 0 with no penalty. A round locks early once every connected player has answered.
- **Statuses** — `waiting` → `starting` (2.5s countdown) → `in_round` → `round_locked` (3.2s reveal) → next `in_round` or `game_over`; `expired` rooms reject joins.
- **SSE broadcast** — each state change serializes the client snapshot once and writes it to every subscriber; dead responses are dropped from the subscriber set.
- **Authoritative tick** — a 250 ms `setInterval` advances countdowns, expires rounds, and builds round results independent of client requests.
- **Presence** — players are marked disconnected after **10 s** without a heartbeat, SSE connect, or state poll.
- **Cleanup** — rooms untouched for **15 minutes** are deleted from the in-memory map.
- **Answer secrecy** — `toClientState()` deliberately omits `correctOptionId` from `currentQuestion`; the correct option, its text, and the `whySafe` explanation appear only in `lastRoundResult` once the round has locked. This prevents clients from reading the answer out of the network payload mid-round.
