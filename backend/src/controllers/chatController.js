export function createChatController(chatService, wsHub) {
  return {
    getMessages(req, res, next) {
      try {
        const { matchId } = req.params;
        const result = chatService.getMessages(req.user.id, matchId);
        res.json(result);
      } catch (err) {
        next(err);
      }
    },

    postMessage(req, res, next) {
      try {
        const { matchId } = req.params;
        const { content } = req.body || {};
        const result = chatService.sendMessage(req.user.id, matchId, content);

        if (wsHub) {
          wsHub.broadcast(matchId, {
            type: 'NEW_MESSAGE',
            message: result.message
          });

          setTimeout(() => {
            if (wsHub) {
              wsHub.broadcast(matchId, {
                type: 'TYPING',
                senderId: result.partnerId,
                isTyping: true
              });
            }

            setTimeout(() => {
              const reply = chatService.generatePartnerReply(matchId, result.partnerId, content);
              if (wsHub) {
                wsHub.broadcast(matchId, {
                  type: 'TYPING',
                  senderId: result.partnerId,
                  isTyping: false
                });
                wsHub.broadcast(matchId, {
                  type: 'NEW_MESSAGE',
                  message: reply
                });
              }
            }, 1400);
          }, 600);
        }

        res.status(201).json({
          success: true,
          message: result.message
        });
      } catch (err) {
        next(err);
      }
    }
  };
}
