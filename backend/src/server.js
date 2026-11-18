import 'dotenv/config';
import http from 'node:http';
import { createApp } from './app.js';
import { getDatabase } from './db/database.js';
import { seedDatabase } from './db/seed.js';
import { WebSocketHub } from './websocket.js';

const PORT = process.env.PORT || 5000;
const db = getDatabase();

const existingUsers = db.prepare('SELECT COUNT(*) AS count FROM users').get();
if (existingUsers.count === 0) {
  seedDatabase(db);
}

const wsHub = new WebSocketHub();
const { app, chatService } = createApp(db, wsHub);
const server = http.createServer(app);

wsHub.attach(server, chatService);

server.listen(PORT, () => {
  console.log(`Coy Discover Backend running on http://localhost:${PORT}`);
});
