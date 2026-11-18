import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { authMiddleware } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { DiscoveryService } from './services/discoveryService.js';
import { ChatService } from './services/chatService.js';
import { createApiRouter } from './routes/api.js';
import { getDatabase } from './db/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../../frontend/dist');

export function createApp(database = getDatabase(), wsHub = null) {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(authMiddleware);

  const discoveryService = new DiscoveryService(database);
  const chatService = new ChatService(database);
  const apiRouter = createApiRouter(discoveryService, chatService, wsHub, database);

  app.use('/api', apiRouter);
  app.use('/', apiRouter);

  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (req.path === '/feed' || req.path === '/swipe' || req.path === '/matches' || req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.use(errorHandler);

  return { app, discoveryService, chatService, database, wsHub };
}
