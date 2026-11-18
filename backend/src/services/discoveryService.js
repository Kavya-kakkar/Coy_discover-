import { randomUUID } from 'node:crypto';

export class DiscoveryService {
  constructor(db) {
    this.db = db;
  }

  getFeed(userId) {
    const query = `
      SELECT p.userId AS id, p.name, p.age, p.photo, p.bio, p.city, p.college, p.interests
      FROM profiles p
      WHERE p.userId != ?
        AND p.userId NOT IN (
          SELECT targetId FROM swipes WHERE swiperId = ?
        )
      ORDER BY p.id ASC
    `;

    const rows = this.db.prepare(query).all(userId, userId);

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      age: row.age,
      photo: row.photo,
      bio: row.bio,
      city: row.city,
      college: row.college,
      interests: JSON.parse(row.interests)
    }));
  }

  recordSwipe(swiperId, targetId, action) {
    if (!targetId || typeof targetId !== 'string') {
      const error = new Error('Target user ID is required');
      error.statusCode = 400;
      throw error;
    }

    if (action !== 'LIKE' && action !== 'PASS') {
      const error = new Error('Invalid swipe action. Must be LIKE or PASS');
      error.statusCode = 400;
      throw error;
    }

    if (swiperId === targetId) {
      const error = new Error('Users cannot swipe on themselves');
      error.statusCode = 400;
      throw error;
    }

    const targetUser = this.db
      .prepare('SELECT id FROM users WHERE id = ?')
      .get(targetId);

    if (!targetUser) {
      const error = new Error('Target profile not found');
      error.statusCode = 404;
      throw error;
    }

    this.db.exec('BEGIN IMMEDIATE TRANSACTION;');

    try {
      const existingSwipe = this.db
        .prepare('SELECT action FROM swipes WHERE swiperId = ? AND targetId = ?')
        .get(swiperId, targetId);

      if (existingSwipe) {
        const error = new Error('Profile has already been swiped');
        error.statusCode = 409;
        throw error;
      }

      const swipeId = `swipe_${randomUUID()}`;
      const now = new Date().toISOString();

      this.db
        .prepare(
          'INSERT INTO swipes (id, swiperId, targetId, action, createdAt) VALUES (?, ?, ?, ?, ?)'
        )
        .run(swipeId, swiperId, targetId, action, now);

      let matched = false;
      let matchData = null;

      if (action === 'LIKE') {
        const reciprocalSwipe = this.db
          .prepare(
            'SELECT action FROM swipes WHERE swiperId = ? AND targetId = ?'
          )
          .get(targetId, swiperId);

        if (reciprocalSwipe && reciprocalSwipe.action === 'LIKE') {
          const userAId = swiperId < targetId ? swiperId : targetId;
          const userBId = swiperId < targetId ? targetId : swiperId;

          let matchRecord = this.db
            .prepare(
              'SELECT id, createdAt FROM matches WHERE userAId = ? AND userBId = ?'
            )
            .get(userAId, userBId);

          if (!matchRecord) {
            const newMatchId = `match_${randomUUID()}`;
            this.db
              .prepare(
                'INSERT INTO matches (id, userAId, userBId, createdAt) VALUES (?, ?, ?, ?)'
              )
              .run(newMatchId, userAId, userBId, now);

            matchRecord = { id: newMatchId, createdAt: now };
          }

          const partnerProfile = this.db
            .prepare(
              'SELECT userId AS id, name, age, photo, bio, city, college, interests FROM profiles WHERE userId = ?'
            )
            .get(targetId);

          matched = true;
          matchData = {
            id: matchRecord.id,
            createdAt: matchRecord.createdAt,
            profile: {
              id: partnerProfile.id,
              name: partnerProfile.name,
              age: partnerProfile.age,
              photo: partnerProfile.photo,
              bio: partnerProfile.bio,
              city: partnerProfile.city,
              college: partnerProfile.college,
              interests: JSON.parse(partnerProfile.interests)
            }
          };
        }
      }

      this.db.exec('COMMIT;');

      if (matched) {
        return {
          success: true,
          matched: true,
          match: matchData
        };
      }

      return {
        success: true,
        matched: false
      };
    } catch (err) {
      try {
        this.db.exec('ROLLBACK;');
      } catch {}
      throw err;
    }
  }

  getMatches(userId) {
    const query = `
      SELECT m.id AS matchId, m.createdAt AS matchedAt,
             p.userId AS id, p.name, p.age, p.photo, p.bio, p.city, p.college, p.interests
      FROM matches m
      JOIN profiles p ON (
        CASE
          WHEN m.userAId = ? THEN m.userBId = p.userId
          ELSE m.userAId = p.userId
        END
      )
      WHERE m.userAId = ? OR m.userBId = ?
      ORDER BY m.createdAt DESC
    `;

    const rows = this.db.prepare(query).all(userId, userId, userId);

    return rows.map((row) => ({
      matchId: row.matchId,
      matchedAt: row.matchedAt,
      profile: {
        id: row.id,
        name: row.name,
        age: row.age,
        photo: row.photo,
        bio: row.bio,
        city: row.city,
        college: row.college,
        interests: JSON.parse(row.interests)
      }
    }));
  }
}
