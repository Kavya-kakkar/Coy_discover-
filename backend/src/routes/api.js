import { Router } from 'express';
import { createFeedController } from '../controllers/feedController.js';
import { createSwipeController } from '../controllers/swipeController.js';
import { createMatchesController } from '../controllers/matchesController.js';
import { createChatController } from '../controllers/chatController.js';
import { seedDatabase } from '../db/seed.js';

export function createApiRouter(discoveryService, chatService, wsHub, db) {
  const router = Router();

  const getFeed = createFeedController(discoveryService);
  const recordSwipe = createSwipeController(discoveryService);
  const getMatches = createMatchesController(discoveryService);
  const chatController = createChatController(chatService, wsHub);

  router.get('/feed', getFeed);
  router.post('/swipe', recordSwipe);
  router.get('/matches', getMatches);

  router.get('/matches/:matchId/messages', chatController.getMessages);
  router.post('/matches/:matchId/messages', chatController.postMessage);

  router.post('/reset', (req, res, next) => {
    try {
      const result = seedDatabase(db);
      res.json({
        success: true,
        message: 'Database reset and re-seeded successfully',
        ...result
      });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
