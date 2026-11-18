import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

export function initializeDatabase(dbPath = process.env.DATABASE_PATH || './data/coy_discover.db') {
  if (dbPath !== ':memory:') {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const db = new DatabaseSync(dbPath);
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec('PRAGMA journal_mode = WAL;');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      photo TEXT NOT NULL,
      bio TEXT NOT NULL,
      city TEXT NOT NULL,
      college TEXT,
      interests TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS swipes (
      id TEXT PRIMARY KEY,
      swiperId TEXT NOT NULL,
      targetId TEXT NOT NULL,
      action TEXT NOT NULL CHECK(action IN ('LIKE', 'PASS')),
      createdAt TEXT NOT NULL,
      UNIQUE(swiperId, targetId),
      FOREIGN KEY (swiperId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (targetId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      userAId TEXT NOT NULL,
      userBId TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      UNIQUE(userAId, userBId),
      FOREIGN KEY (userAId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (userBId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  return db;
}

let defaultDbInstance = null;

export function getDatabase() {
  if (!defaultDbInstance) {
    defaultDbInstance = initializeDatabase();
  }
  return defaultDbInstance;
}

export function closeDatabase(db = defaultDbInstance) {
  if (db) {
    db.close();
    if (db === defaultDbInstance) {
      defaultDbInstance = null;
    }
  }
}
