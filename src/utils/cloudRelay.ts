import { RoomStateClient } from '../types/multiplayer';

const RELAY_BASE = 'https://ntfy.sh';
const PREFIX = 'cybermentor_game_';

function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 4000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).finally(() => clearTimeout(id));
}

export const cloudRelay = {
  /**
   * Publish updated room state to cloud relay
   */
  async publishRoomState(code: string, room: RoomStateClient): Promise<boolean> {
    try {
      const clean = code.trim().toUpperCase();
      const topic = `${PREFIX}room_${clean}`;
      const res = await fetchWithTimeout(`${RELAY_BASE}/${topic}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Title': `room_state_${clean}`,
          'X-Cache': 'yes',
        },
        body: JSON.stringify(room),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Fetch the latest room state from cloud relay
   */
  async fetchRoomState(code: string): Promise<RoomStateClient | null> {
    try {
      const clean = code.trim().toUpperCase();
      const topic = `${PREFIX}room_${clean}`;
      const res = await fetchWithTimeout(`${RELAY_BASE}/${topic}/json?poll=1`, {}, 3500);
      if (!res.ok) return null;

      const text = await res.text();
      if (!text || !text.trim()) return null;

      const lines = text.trim().split('\n');
      // Iterate from newest to oldest
      for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i].trim();
        if (!line) continue;
        try {
          const wrapper = JSON.parse(line);
          const rawMessage = wrapper.message;
          const parsed = typeof rawMessage === 'string' ? JSON.parse(rawMessage) : rawMessage;
          if (parsed && parsed.code && parsed.status && parsed.host) {
            return parsed as RoomStateClient;
          }
        } catch {
          // ignore individual line parse error
        }
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Publish action event (e.g. GUEST_JOINED, GAME_STARTED, PLAYER_ANSWER, ROUND_ADVANCE)
   */
  async publishAction(code: string, action: any): Promise<boolean> {
    try {
      const clean = code.trim().toUpperCase();
      const topic = `${PREFIX}act_${clean}`;
      const payload = {
        ...action,
        timestamp: action.timestamp || Date.now(),
      };
      const res = await fetchWithTimeout(`${RELAY_BASE}/${topic}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Title': `act_${clean}`,
          'X-Cache': 'yes',
        },
        body: JSON.stringify(payload),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Fetch recent actions for this room
   */
  async fetchLatestActions(code: string, sinceSeconds = 30): Promise<any[]> {
    try {
      const clean = code.trim().toUpperCase();
      const topic = `${PREFIX}act_${clean}`;
      const res = await fetchWithTimeout(`${RELAY_BASE}/${topic}/json?poll=1&since=${sinceSeconds}s`, {}, 3000);
      if (!res.ok) return [];

      const text = await res.text();
      if (!text || !text.trim()) return [];

      const lines = text.trim().split('\n');
      const actions: any[] = [];
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const wrapper = JSON.parse(line);
          const rawMessage = wrapper.message;
          const parsed = typeof rawMessage === 'string' ? JSON.parse(rawMessage) : rawMessage;
          if (parsed && parsed.type) {
            actions.push(parsed);
          }
        } catch {
          // ignore
        }
      }
      return actions;
    } catch {
      return [];
    }
  },

  /**
   * Subscribe to real-time events via Server-Sent Events (SSE)
   */
  subscribe(
    code: string,
    callbacks: {
      onRoomState?: (room: RoomStateClient) => void;
      onAction?: (action: any) => void;
    }
  ): () => void {
    const clean = code.trim().toUpperCase();
    let roomEs: EventSource | null = null;
    let actEs: EventSource | null = null;

    try {
      const roomTopic = `${PREFIX}room_${clean}`;
      roomEs = new EventSource(`${RELAY_BASE}/${roomTopic}/sse`);
      roomEs.onmessage = (event) => {
        try {
          const wrapper = JSON.parse(event.data);
          const rawMessage = wrapper.message;
          const parsed = typeof rawMessage === 'string' ? JSON.parse(rawMessage) : rawMessage;
          if (parsed && parsed.code && parsed.status && parsed.host && callbacks.onRoomState) {
            callbacks.onRoomState(parsed);
          }
        } catch {
          // ignore
        }
      };
    } catch {
      // ignore
    }

    try {
      const actTopic = `${PREFIX}act_${clean}`;
      actEs = new EventSource(`${RELAY_BASE}/${actTopic}/sse`);
      actEs.onmessage = (event) => {
        try {
          const wrapper = JSON.parse(event.data);
          const rawMessage = wrapper.message;
          const parsed = typeof rawMessage === 'string' ? JSON.parse(rawMessage) : rawMessage;
          if (parsed && parsed.type && callbacks.onAction) {
            callbacks.onAction(parsed);
          }
        } catch {
          // ignore
        }
      };
    } catch {
      // ignore
    }

    return () => {
      if (roomEs) {
        roomEs.close();
        roomEs = null;
      }
      if (actEs) {
        actEs.close();
        actEs = null;
      }
    };
  },
};
