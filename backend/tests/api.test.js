import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import fs from 'node:fs';
import path from 'node:path';
import { createApp } from '../src/app.js';
import { initializeDatabase, closeDatabase } from '../src/db/database.js';
import { seedDatabase } from '../src/db/seed.js';

describe('Coy Discover Backend API & Matching Engine', () => {
  let db;
  let app;

  beforeEach(() => {
    db = initializeDatabase(':memory:');
    seedDatabase(db);
    const setup = createApp(db);
    app = setup.app;
  });

  afterEach(() => {
    if (db) {
      closeDatabase(db);
    }
  });

  it('1. GET /feed returns eligible profiles', async () => {
    const res = await request(app).get('/feed');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('profiles');
    expect(Array.isArray(res.body.profiles)).toBe(true);
    expect(res.body.profiles.length).toBeGreaterThan(0);

    const first = res.body.profiles[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('name');
    expect(first).toHaveProperty('age');
    expect(first).toHaveProperty('photo');
    expect(first).toHaveProperty('bio');
    expect(first).toHaveProperty('city');
    expect(first).toHaveProperty('interests');
    expect(Array.isArray(first.interests)).toBe(true);
  });

  it('2. Current user is excluded from feed', async () => {
    const res = await request(app).get('/feed').set('x-user-id', 'user_001');
    expect(res.status).toBe(200);
    const ids = res.body.profiles.map((p) => p.id);
    expect(ids).not.toContain('user_001');
  });

  it('3. Previously liked profiles are excluded from feed', async () => {
    const feedBefore = await request(app).get('/feed').set('x-user-id', 'user_001');
    const target = feedBefore.body.profiles[0];

    const swipeRes = await request(app)
      .post('/swipe')
      .set('x-user-id', 'user_001')
      .send({ targetId: target.id, action: 'LIKE' });
    expect(swipeRes.status).toBe(200);

    const feedAfter = await request(app).get('/feed').set('x-user-id', 'user_001');
    const idsAfter = feedAfter.body.profiles.map((p) => p.id);
    expect(idsAfter).not.toContain(target.id);
    expect(feedAfter.body.profiles.length).toBe(feedBefore.body.profiles.length - 1);
  });

  it('4. Previously passed profiles are excluded from feed', async () => {
    const feedBefore = await request(app).get('/feed').set('x-user-id', 'user_001');
    const target = feedBefore.body.profiles[0];

    const swipeRes = await request(app)
      .post('/swipe')
      .set('x-user-id', 'user_001')
      .send({ targetId: target.id, action: 'PASS' });
    expect(swipeRes.status).toBe(200);

    const feedAfter = await request(app).get('/feed').set('x-user-id', 'user_001');
    const idsAfter = feedAfter.body.profiles.map((p) => p.id);
    expect(idsAfter).not.toContain(target.id);
    expect(feedAfter.body.profiles.length).toBe(feedBefore.body.profiles.length - 1);
  });

  it('5. POST /swipe LIKE saves a swipe', async () => {
    const targetId = 'user_004';
    const res = await request(app)
      .post('/swipe')
      .set('x-user-id', 'user_001')
      .send({ targetId, action: 'LIKE' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const saved = db
      .prepare('SELECT * FROM swipes WHERE swiperId = ? AND targetId = ?')
      .get('user_001', targetId);

    expect(saved).toBeDefined();
    expect(saved.action).toBe('LIKE');
  });

  it('6. POST /swipe PASS saves a swipe', async () => {
    const targetId = 'user_004';
    const res = await request(app)
      .post('/swipe')
      .set('x-user-id', 'user_001')
      .send({ targetId, action: 'PASS' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.matched).toBe(false);

    const saved = db
      .prepare('SELECT * FROM swipes WHERE swiperId = ? AND targetId = ?')
      .get('user_001', targetId);

    expect(saved).toBeDefined();
    expect(saved.action).toBe('PASS');
  });

  it('7. Duplicate swipes are rejected', async () => {
    const targetId = 'user_004';

    const firstSwipe = await request(app)
      .post('/swipe')
      .set('x-user-id', 'user_001')
      .send({ targetId, action: 'LIKE' });
    expect(firstSwipe.status).toBe(200);

    const duplicateSwipe = await request(app)
      .post('/swipe')
      .set('x-user-id', 'user_001')
      .send({ targetId, action: 'LIKE' });
    expect(duplicateSwipe.status).toBe(409);
    expect(duplicateSwipe.body.success).toBe(false);

    const oppositeSwipe = await request(app)
      .post('/swipe')
      .set('x-user-id', 'user_001')
      .send({ targetId, action: 'PASS' });
    expect(oppositeSwipe.status).toBe(409);
  });

  it('8. Self-swipes are rejected', async () => {
    const res = await request(app)
      .post('/swipe')
      .set('x-user-id', 'user_001')
      .send({ targetId: 'user_001', action: 'LIKE' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('9. One-sided LIKE does not create a match', async () => {
    const targetId = 'user_004';

    const res = await request(app)
      .post('/swipe')
      .set('x-user-id', 'user_001')
      .send({ targetId, action: 'LIKE' });

    expect(res.status).toBe(200);
    expect(res.body.matched).toBe(false);
    expect(res.body.match).toBeUndefined();

    const matchesCount = db
      .prepare('SELECT COUNT(*) AS count FROM matches WHERE userAId = ? OR userBId = ?')
      .get('user_001', 'user_001');
    expect(matchesCount.count).toBe(0);
  });

  it('10. Reciprocal LIKE creates a match', async () => {
    const targetId = 'user_002';

    const res = await request(app)
      .post('/swipe')
      .set('x-user-id', 'user_001')
      .send({ targetId, action: 'LIKE' });

    expect(res.status).toBe(200);
    expect(res.body.matched).toBe(true);
    expect(res.body.match).toBeDefined();
    expect(res.body.match.profile.id).toBe(targetId);
    expect(res.body.match.profile.name).toBe('Riya Sen');

    const canonicalA = 'user_001' < targetId ? 'user_001' : targetId;
    const canonicalB = 'user_001' < targetId ? targetId : 'user_001';

    const matchRecord = db
      .prepare('SELECT * FROM matches WHERE userAId = ? AND userBId = ?')
      .get(canonicalA, canonicalB);
    expect(matchRecord).toBeDefined();
  });

  it('11. Duplicate matches cannot be created', async () => {
    const targetId = 'user_003';

    const firstRes = await request(app)
      .post('/swipe')
      .set('x-user-id', 'user_001')
      .send({ targetId, action: 'LIKE' });
    expect(firstRes.status).toBe(200);
    expect(firstRes.body.matched).toBe(true);

    const canonicalA = 'user_001' < targetId ? 'user_001' : targetId;
    const canonicalB = 'user_001' < targetId ? targetId : 'user_001';

    expect(() => {
      db.prepare(
        'INSERT INTO matches (id, userAId, userBId, createdAt) VALUES (?, ?, ?, ?)'
      ).run('dup_match', canonicalA, canonicalB, new Date().toISOString());
    }).toThrow();

    const allMatches = db
      .prepare('SELECT COUNT(*) AS count FROM matches WHERE userAId = ? AND userBId = ?')
      .get(canonicalA, canonicalB);
    expect(allMatches.count).toBe(1);
  });

  it('12. GET /matches returns mutual matches only', async () => {
    const initialMatches = await request(app)
      .get('/matches')
      .set('x-user-id', 'user_001');
    expect(initialMatches.status).toBe(200);
    expect(initialMatches.body.matches).toHaveLength(0);

    await request(app)
      .post('/swipe')
      .set('x-user-id', 'user_001')
      .send({ targetId: 'user_004', action: 'LIKE' });

    const matchesAfterOneSided = await request(app)
      .get('/matches')
      .set('x-user-id', 'user_001');
    expect(matchesAfterOneSided.body.matches).toHaveLength(0);

    await request(app)
      .post('/swipe')
      .set('x-user-id', 'user_001')
      .send({ targetId: 'user_007', action: 'LIKE' });

    const matchesAfterReciprocal = await request(app)
      .get('/matches')
      .set('x-user-id', 'user_001');
    expect(matchesAfterReciprocal.body.matches).toHaveLength(1);
    expect(matchesAfterReciprocal.body.matches[0].profile.id).toBe('user_007');
    expect(matchesAfterReciprocal.body.matches[0].profile.name).toBe('Zoe Morales');
  });

  it('13. Incoming likes are never exposed in feed or profile endpoints', async () => {
    const res = await request(app).get('/feed').set('x-user-id', 'user_001');
    expect(res.status).toBe(200);

    for (const profile of res.body.profiles) {
      expect(profile).not.toHaveProperty('likedMe');
      expect(profile).not.toHaveProperty('incomingLike');
      expect(profile).not.toHaveProperty('hasLiked');
      expect(profile).not.toHaveProperty('swipes');
    }

    const jsonString = JSON.stringify(res.body);
    expect(jsonString).not.toContain('seed_swipe');
  });

  it('14. Swipe data persists after server restart', async () => {
    const testDbPath = path.join(process.cwd(), 'data', 'test_persistence.db');
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }

    let persistentDb = initializeDatabase(testDbPath);
    seedDatabase(persistentDb);
    let testSetup = createApp(persistentDb);

    const swipeRes = await request(testSetup.app)
      .post('/swipe')
      .set('x-user-id', 'user_001')
      .send({ targetId: 'user_005', action: 'LIKE' });
    expect(swipeRes.status).toBe(200);

    closeDatabase(persistentDb);

    persistentDb = initializeDatabase(testDbPath);
    testSetup = createApp(persistentDb);

    const feedRes = await request(testSetup.app)
      .get('/feed')
      .set('x-user-id', 'user_001');
    const ids = feedRes.body.profiles.map((p) => p.id);
    expect(ids).not.toContain('user_005');

    closeDatabase(persistentDb);
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  it('15. Simultaneous reciprocal likes result in exactly one match', async () => {
    const targetA = 'user_020';
    const targetB = 'user_021';

    const reqA = request(app)
      .post('/swipe')
      .set('x-user-id', targetA)
      .send({ targetId: targetB, action: 'LIKE' });

    const reqB = request(app)
      .post('/swipe')
      .set('x-user-id', targetB)
      .send({ targetId: targetA, action: 'LIKE' });

    const [resA, resB] = await Promise.all([reqA, reqB]);

    expect(resA.status).toBe(200);
    expect(resB.status).toBe(200);

    const matchesCreated = [resA.body.matched, resB.body.matched].filter(Boolean).length;
    expect(matchesCreated).toBeGreaterThanOrEqual(1);

    const canonicalA = targetA < targetB ? targetA : targetB;
    const canonicalB = targetA < targetB ? targetB : targetA;

    const matchesInDb = db
      .prepare('SELECT * FROM matches WHERE userAId = ? AND userBId = ?')
      .all(canonicalA, canonicalB);

    expect(matchesInDb).toHaveLength(1);
  });
});
