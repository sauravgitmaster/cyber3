import { Peer, DataConnection } from 'peerjs';
import { RoomStateClient, PlayerProfileState } from '../types/multiplayer';

export interface P2PHostSession {
  peer: Peer;
  broadcastState: (room: RoomStateClient) => void;
  broadcastAction: (action: any) => void;
  close: () => void;
}

export interface P2PGuestSession {
  peer: Peer;
  connection: DataConnection;
  sendAction: (action: any) => void;
  close: () => void;
}

function getHostPeerId(code: string): string {
  return `cm-host-${code.trim().toUpperCase()}`;
}

export const p2pRelay = {
  /**
   * Host starts listening for Guest P2P connection
   */
  startHost(
    code: string,
    callbacks: {
      onGuestJoin: (guest: PlayerProfileState) => void;
      onGuestAction: (action: any) => void;
      onGuestDisconnect?: () => void;
    }
  ): P2PHostSession {
    const peerId = getHostPeerId(code);
    let activeConn: DataConnection | null = null;

    const peer = new Peer(peerId, {
      debug: 0,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
        ],
      },
    });

    peer.on('connection', (conn) => {
      activeConn = conn;

      conn.on('data', (data: any) => {
        if (!data || typeof data !== 'object') return;

        if (data.type === 'GUEST_JOIN' && data.guest) {
          callbacks.onGuestJoin(data.guest);
        } else if (data.type === 'ACTION' && data.action) {
          callbacks.onGuestAction(data.action);
        } else if (data.type === 'PLAYER_ANSWER') {
          callbacks.onGuestAction(data);
        }
      });

      conn.on('close', () => {
        if (activeConn === conn) {
          activeConn = null;
        }
        callbacks.onGuestDisconnect?.();
      });

      conn.on('error', () => {
        // silent error handling
      });
    });

    peer.on('error', (err) => {
      // If host peer ID is already taken (e.g. reload), ignore or let it reset
      console.warn('P2P Host Peer notification:', err.type);
    });

    return {
      peer,
      broadcastState: (room: RoomStateClient) => {
        if (activeConn && activeConn.open) {
          try {
            activeConn.send({ type: 'ROOM_STATE', room });
          } catch {
            // ignore send failure
          }
        }
      },
      broadcastAction: (action: any) => {
        if (activeConn && activeConn.open) {
          try {
            activeConn.send({ type: 'ACTION', action });
          } catch {
            // ignore send failure
          }
        }
      },
      close: () => {
        if (activeConn) {
          try {
            activeConn.close();
          } catch {
            // ignore
          }
          activeConn = null;
        }
        try {
          peer.destroy();
        } catch {
          // ignore
        }
      },
    };
  },

  /**
   * Guest connects to Host via P2P
   */
  connectAsGuest(
    code: string,
    guest: PlayerProfileState,
    callbacks: {
      onRoomState: (room: RoomStateClient) => void;
      onHostAction: (action: any) => void;
      onConnected?: () => void;
      onFailed?: (err: any) => void;
    },
    timeoutMs = 6000
  ): Promise<P2PGuestSession> {
    return new Promise((resolve, reject) => {
      const hostPeerId = getHostPeerId(code);
      const guestPeerId = `cm-gst-${code.toUpperCase()}-${Math.random().toString(36).slice(2, 7)}`;

      let isSettled = false;
      const timer = setTimeout(() => {
        if (!isSettled) {
          isSettled = true;
          try {
            peer.destroy();
          } catch {
            // ignore
          }
          reject(new Error('P2P connection timeout'));
        }
      }, timeoutMs);

      const peer = new Peer(guestPeerId, {
        debug: 0,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
          ],
        },
      });

      let conn: DataConnection | null = null;

      peer.on('open', () => {
        try {
          conn = peer.connect(hostPeerId, {
            reliable: true,
          });

          conn.on('open', () => {
            if (!isSettled) {
              isSettled = true;
              clearTimeout(timer);
              callbacks.onConnected?.();
              // Send guest info to host immediately
              conn!.send({ type: 'GUEST_JOIN', guest });
              resolve({
                peer,
                connection: conn!,
                sendAction: (action: any) => {
                  if (conn && conn.open) {
                    try {
                      conn.send({ type: 'ACTION', action });
                    } catch {
                      // ignore
                    }
                  }
                },
                close: () => {
                  try {
                    conn?.close();
                    peer.destroy();
                  } catch {
                    // ignore
                  }
                },
              });
            }
          });

          conn.on('data', (data: any) => {
            if (!data || typeof data !== 'object') return;
            if (data.type === 'ROOM_STATE' && data.room) {
              callbacks.onRoomState(data.room);
            } else if (data.type === 'ACTION' && data.action) {
              callbacks.onHostAction(data.action);
            }
          });

          conn.on('error', (err) => {
            if (!isSettled) {
              isSettled = true;
              clearTimeout(timer);
              reject(err);
            }
          });
        } catch (err) {
          if (!isSettled) {
            isSettled = true;
            clearTimeout(timer);
            reject(err);
          }
        }
      });

      peer.on('error', (err) => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timer);
          reject(err);
        }
      });
    });
  },
};
