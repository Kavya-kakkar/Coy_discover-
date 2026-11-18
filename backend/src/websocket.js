import { WebSocketServer, WebSocket } from 'ws';

export class WebSocketHub {
  constructor() {
    this.rooms = new Map();
  }

  attach(server, chatService) {
    this.chatService = chatService;
    this.wss = new WebSocketServer({ server, path: '/ws' });

    this.wss.on('connection', (ws, req) => {
      let currentMatchId = null;

      try {
        const url = new URL(req.url, 'http://localhost');
        const matchIdParam = url.searchParams.get('matchId');
        if (matchIdParam) {
          currentMatchId = matchIdParam;
          this.addToRoom(currentMatchId, ws);
        }
      } catch {}

      ws.on('message', (data) => {
        try {
          const parsed = JSON.parse(data.toString());

          if (parsed.type === 'JOIN_MATCH' && parsed.matchId) {
            if (currentMatchId && currentMatchId !== parsed.matchId) {
              this.removeFromRoom(currentMatchId, ws);
            }
            currentMatchId = parsed.matchId;
            this.addToRoom(currentMatchId, ws);
            ws.send(JSON.stringify({ type: 'JOINED_MATCH', matchId: currentMatchId }));
          }

          if (parsed.type === 'SEND_MESSAGE' && parsed.matchId && parsed.content) {
            const senderId = parsed.userId || 'user_001';
            const result = this.chatService.sendMessage(senderId, parsed.matchId, parsed.content);

            this.broadcast(parsed.matchId, {
              type: 'NEW_MESSAGE',
              message: result.message
            });

            setTimeout(() => {
              this.broadcast(parsed.matchId, {
                type: 'TYPING',
                senderId: result.partnerId,
                isTyping: true
              });

              setTimeout(() => {
                const reply = this.chatService.generatePartnerReply(parsed.matchId, result.partnerId, parsed.content);
                this.broadcast(parsed.matchId, {
                  type: 'TYPING',
                  senderId: result.partnerId,
                  isTyping: false
                });
                this.broadcast(parsed.matchId, {
                  type: 'NEW_MESSAGE',
                  message: reply
                });
              }, 1400);
            }, 600);
          }
        } catch (err) {
          ws.send(JSON.stringify({ type: 'ERROR', error: err.message }));
        }
      });

      ws.on('close', () => {
        if (currentMatchId) {
          this.removeFromRoom(currentMatchId, ws);
        }
      });
    });

    return this.wss;
  }

  addToRoom(matchId, ws) {
    if (!this.rooms.has(matchId)) {
      this.rooms.set(matchId, new Set());
    }
    this.rooms.get(matchId).add(ws);
  }

  removeFromRoom(matchId, ws) {
    if (this.rooms.has(matchId)) {
      const set = this.rooms.get(matchId);
      set.delete(ws);
      if (set.size === 0) {
        this.rooms.delete(matchId);
      }
    }
  }

  broadcast(matchId, payload) {
    if (!this.rooms.has(matchId)) return;
    const data = JSON.stringify(payload);
    for (const client of this.rooms.get(matchId)) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    }
  }
}
