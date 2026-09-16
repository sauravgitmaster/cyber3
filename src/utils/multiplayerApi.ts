import { RoomStateClient } from '../types/multiplayer';

export interface PlayerInput {
  id: string;
  name: string;
  avatar: string;
}

async function handleResponse<T>(res: Response, defaultErrorMessage: string): Promise<T> {
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (!res.ok) {
    if (isJson) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || defaultErrorMessage);
    }
    throw new Error(defaultErrorMessage);
  }

  if (!isJson) {
    throw new Error('Game server response was not valid JSON.');
  }

  return res.json() as Promise<T>;
}

export const multiplayerApi = {
  async createRoom(host: PlayerInput): Promise<RoomStateClient> {
    const res = await fetch('/api/rooms/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ host }),
    });
    return handleResponse<RoomStateClient>(res, 'Failed to create room');
  },

  async joinRoom(code: string, guest: PlayerInput): Promise<RoomStateClient> {
    const res = await fetch('/api/rooms/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, guest }),
    });
    return handleResponse<RoomStateClient>(res, 'Hmm… I can’t find that game.');
  },

  async getRoomState(code: string, playerId?: string): Promise<RoomStateClient> {
    const url = `/api/rooms/${encodeURIComponent(code)}${playerId ? `?playerId=${encodeURIComponent(playerId)}` : ''}`;
    const res = await fetch(url);
    return handleResponse<RoomStateClient>(res, 'Game not found');
  },

  async startGame(code: string, playerId: string): Promise<RoomStateClient> {
    const res = await fetch(`/api/rooms/${encodeURIComponent(code)}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId }),
    });
    return handleResponse<RoomStateClient>(res, 'Failed to start game');
  },

  async submitAnswer(
    code: string,
    playerId: string,
    questionId: string,
    optionId: string
  ): Promise<RoomStateClient> {
    const res = await fetch(`/api/rooms/${encodeURIComponent(code)}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId, questionId, optionId, clientTime: Date.now() }),
    });
    return handleResponse<RoomStateClient>(res, 'Failed to submit answer');
  },

  async restartGame(code: string, playerId: string): Promise<RoomStateClient> {
    const res = await fetch(`/api/rooms/${encodeURIComponent(code)}/restart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId }),
    });
    return handleResponse<RoomStateClient>(res, 'Failed to restart game');
  },

  async heartbeat(code: string, playerId: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/rooms/${encodeURIComponent(code)}/heartbeat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async leaveRoom(code: string, playerId: string): Promise<void> {
    try {
      await fetch(`/api/rooms/${encodeURIComponent(code)}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId }),
      });
    } catch {
      // ignore
    }
  },
};
