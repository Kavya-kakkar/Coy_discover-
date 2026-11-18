import { randomUUID } from 'node:crypto';

export class ChatService {
  constructor(db) {
    this.db = db;
  }

  getMatchForUser(userId, matchId) {
    const match = this.db
      .prepare('SELECT id, userAId, userBId, createdAt FROM matches WHERE id = ?')
      .get(matchId);

    if (!match) {
      const error = new Error('Match not found');
      error.statusCode = 404;
      throw error;
    }

    if (match.userAId !== userId && match.userBId !== userId) {
      const error = new Error('Unauthorized to access this private conversation');
      error.statusCode = 403;
      throw error;
    }

    const partnerId = match.userAId === userId ? match.userBId : match.userAId;
    const partnerRow = this.db
      .prepare('SELECT userId AS id, name, age, photo, bio, city, college, interests FROM profiles WHERE userId = ?')
      .get(partnerId);

    const partner = partnerRow ? {
      id: partnerRow.id,
      name: partnerRow.name,
      age: partnerRow.age,
      photo: partnerRow.photo,
      bio: partnerRow.bio,
      city: partnerRow.city,
      college: partnerRow.college,
      interests: JSON.parse(partnerRow.interests)
    } : null;

    return { match, partnerId, partner };
  }

  getMessages(userId, matchId) {
    const { match, partner } = this.getMatchForUser(userId, matchId);

    const rows = this.db
      .prepare('SELECT id, matchId, senderId, content, createdAt FROM messages WHERE matchId = ? ORDER BY createdAt ASC')
      .all(matchId);

    return {
      matchId,
      partner,
      messages: rows
    };
  }

  sendMessage(userId, matchId, rawContent) {
    const content = (rawContent || '').trim();
    if (!content) {
      const error = new Error('Message content cannot be empty');
      error.statusCode = 400;
      throw error;
    }

    const { partnerId, partner } = this.getMatchForUser(userId, matchId);

    const messageId = `msg_${randomUUID()}`;
    const now = new Date().toISOString();

    this.db
      .prepare('INSERT INTO messages (id, matchId, senderId, content, createdAt) VALUES (?, ?, ?, ?, ?)')
      .run(messageId, matchId, userId, content, now);

    const message = {
      id: messageId,
      matchId,
      senderId: userId,
      content,
      createdAt: now
    };

    return {
      message,
      partnerId,
      partner
    };
  }

  generatePartnerReply(matchId, partnerId, userContent) {
    const partnerRow = this.db
      .prepare('SELECT name, bio, interests FROM profiles WHERE userId = ?')
      .get(partnerId);

    const partnerName = partnerRow ? partnerRow.name.split(' ')[0] : 'Match';
    let interests = [];
    try {
      interests = JSON.parse(partnerRow.interests);
    } catch {}

    const text = (userContent || '').toLowerCase();
    let replyText = `Hey! So good to connect on Coy 😊 How is your week going?`;

    if (text.includes('hi') || text.includes('hello') || text.includes('hey')) {
      if (interests.includes('Specialty Coffee') || interests.includes('Coffee')) {
        replyText = `Hey Alex! Great to match with you. I was just grabbing a flat white. How are you doing?`;
      } else if (interests.includes('Design') || interests.includes('Architecture')) {
        replyText = `Hey Alex! So happy we matched! Love your vibe and taste in design.`;
      } else {
        replyText = `Hey Alex! Really excited we matched! What are you up to today?`;
      }
    } else if (text.includes('coffee') || text.includes('cafe')) {
      replyText = `I know an amazing little spot nearby with the best pour-over! Would love to check it out together sometime.`;
    } else if (text.includes('weekend') || text.includes('plan')) {
      replyText = `Mostly relaxing, exploring new music, and getting outdoors if the weather holds! What about you?`;
    } else if (text.includes('music') || text.includes('song')) {
      replyText = `I have been listening to so much indie and vinyl lately! What kind of genres are you usually into?`;
    } else {
      const interestTopic = interests.length > 0 ? interests[0].toLowerCase() : 'our interests';
      replyText = `I love that! I was actually just thinking about ${interestTopic} earlier today. Coy matching us was such a great surprise!`;
    }

    const messageId = `msg_${randomUUID()}`;
    const now = new Date().toISOString();

    this.db
      .prepare('INSERT INTO messages (id, matchId, senderId, content, createdAt) VALUES (?, ?, ?, ?, ?)')
      .run(messageId, matchId, partnerId, replyText, now);

    return {
      id: messageId,
      matchId,
      senderId: partnerId,
      content: replyText,
      createdAt: now
    };
  }
}
