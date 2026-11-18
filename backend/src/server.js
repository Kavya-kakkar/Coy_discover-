import 'dotenv/config';
import { createApp } from './app.js';
import { getDatabase } from './db/database.js';
import { seedDatabase } from './db/seed.js';

const PORT = process.env.PORT || 5000;
const db = getDatabase();

const existingUsers = db.prepare('SELECT COUNT(*) AS count FROM users').get();
if (existingUsers.count === 0) {
  seedDatabase(db);
}

const { app } = createApp(db);

app.listen(PORT, () => {
  console.log(`Coy Discover Backend running on http://localhost:${PORT}`);
});
