import { getDatabase, initializeDatabase } from './database.js';

export const mockUsers = [
  {
    id: 'user_001',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    bio: 'Product designer by day, indie film nerd by night. Always down for good matcha latte.',
    city: 'San Francisco',
    college: 'Stanford University',
    interests: ['Design', 'Film', 'Matcha', 'Vinyl Records', 'Running']
  },
  {
    id: 'user_002',
    name: 'Riya Sen',
    email: 'riya.sen@example.com',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    bio: 'Architect in training. Coffee fanatic and 35mm film photographer chasing golden hour.',
    city: 'Bengaluru',
    college: 'School of Planning and Architecture',
    interests: ['Architecture', 'Photography', 'Specialty Coffee', 'Jazz']
  },
  {
    id: 'user_003',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    bio: 'Ceramic artist & botanical illustrator. You can usually find me in a cozy studio or greenhouse.',
    city: 'New York',
    college: 'Parsons School of Design',
    interests: ['Ceramics', 'Plants', 'Art', 'Thrifting', 'Baking']
  },
  {
    id: 'user_004',
    name: 'Marcus Chen',
    email: 'marcus.chen@example.com',
    age: 26,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    bio: 'Software engineer building climate tech. Weekend hiker, marathon trainee, and sourdough baker.',
    city: 'Seattle',
    college: 'University of Washington',
    interests: ['Climate Tech', 'Hiking', 'Running', 'Cooking', 'Sci-Fi']
  },
  {
    id: 'user_005',
    name: 'Aisha Patel',
    email: 'aisha.patel@example.com',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    bio: 'Literature major and bookstore enthusiast. Looking for someone to swap book recommendations with.',
    city: 'London',
    college: 'King’s College London',
    interests: ['Literature', 'Poetry', 'Museums', 'Tea', 'Travel']
  },
  {
    id: 'user_006',
    name: 'David Kim',
    email: 'david.kim@example.com',
    age: 27,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    bio: 'Culinary school grad turned food truck owner. Tell me your top 3 comfort foods.',
    city: 'Austin',
    college: 'Culinary Institute of America',
    interests: ['Food', 'Cooking', 'Live Music', 'Biking', 'Dogs']
  },
  {
    id: 'user_007',
    name: 'Zoe Morales',
    email: 'zoe.morales@example.com',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    bio: 'Graphic designer with a weakness for typography, vintage posters, and road trips without maps.',
    city: 'Los Angeles',
    college: 'UCLA',
    interests: ['Graphic Design', 'Road Trips', 'Indie Rock', 'Podcasts']
  },
  {
    id: 'user_008',
    name: 'Liam Gallagher',
    email: 'liam.gallagher@example.com',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    bio: 'Wildlife biologist & documentary buff. If there are mountains involved, I am in.',
    city: 'Vancouver',
    college: 'UBC',
    interests: ['Wildlife', 'Kayaking', 'Snowboarding', 'Camping']
  },
  {
    id: 'user_009',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    bio: 'Classical dancer and UX researcher. Fascinated by human behavior and spicy ramen.',
    city: 'Mumbai',
    college: 'IIT Bombay',
    interests: ['Dance', 'Psychology', 'Ramen', 'Board Games']
  },
  {
    id: 'user_010',
    name: 'Julian Vance',
    email: 'julian.vance@example.com',
    age: 28,
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    bio: 'Acoustic guitar player and landscape photographer. Always exploring hidden lookouts.',
    city: 'Denver',
    college: 'Colorado State',
    interests: ['Guitar', 'Photography', 'Outdoors', 'Folk Music']
  },
  {
    id: 'user_011',
    name: 'Chloe Dubois',
    email: 'chloe.dubois@example.com',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    bio: 'Pastry chef and amateur astronomer. Let’s gaze at the stars and debate croissant lamination.',
    city: 'Paris',
    college: 'Ferrandi Paris',
    interests: ['Pastry', 'Astronomy', 'French Cinema', 'Wine Tasting']
  },
  {
    id: 'user_012',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@example.com',
    age: 26,
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    bio: 'Fintech strategist who loves weekend bouldering and obscure vinyl records.',
    city: 'Chicago',
    college: 'Northwestern University',
    interests: ['Bouldering', 'Vinyl Records', 'Coffee', 'Chess']
  },
  {
    id: 'user_013',
    name: 'Hannah Abbott',
    email: 'hannah.abbott@example.com',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80',
    bio: 'Florist and weekend potter. Believer in kindness, fresh flowers, and long Sunday walks.',
    city: 'Portland',
    college: 'Reed College',
    interests: ['Floristry', 'Pottery', 'Gardening', 'Farmers Markets']
  },
  {
    id: 'user_014',
    name: 'Mateo Silva',
    email: 'mateo.silva@example.com',
    age: 27,
    photo: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&w=800&q=80',
    bio: 'Urban planner and cycling advocate. Mapping bike lanes and seeking the best tacos in town.',
    city: 'Mexico City',
    college: 'UNAM',
    interests: ['Urbanism', 'Cycling', 'Tacos', 'Street Art']
  },
  {
    id: 'user_015',
    name: 'Maya Lin',
    email: 'maya.lin@example.com',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    bio: 'Journalist covering cultural stories. Equal parts curiosity and caffeine.',
    city: 'Toronto',
    college: 'University of Toronto',
    interests: ['Journalism', 'Documentaries', 'Coffee', 'Writing']
  },
  {
    id: 'user_016',
    name: 'Samir Al-Mansoor',
    email: 'samir.mansoor@example.com',
    age: 28,
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
    bio: 'Data scientist and amateur astronomer. Let me explain why Saturn’s rings are disappearing.',
    city: 'Boston',
    college: 'MIT',
    interests: ['Astrophysics', 'Data Science', 'Sailing', 'Sci-Fi']
  },
  {
    id: 'user_017',
    name: 'Nadia Becker',
    email: 'nadia.becker@example.com',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    bio: 'Industrial designer obsessed with minimalist home goods and analog synthesizers.',
    city: 'Berlin',
    college: 'Bauhaus University',
    interests: ['Industrial Design', 'Electronic Music', 'Architecture', 'Tea']
  },
  {
    id: 'user_018',
    name: 'Lucas Wright',
    email: 'lucas.wright@example.com',
    age: 26,
    photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
    bio: 'Marine biologist currently studying tide pools. Golden retriever energy.',
    city: 'San Diego',
    college: 'UC San Diego',
    interests: ['Surfing', 'Marine Biology', 'Beach Volleyball', 'Tacos']
  },
  {
    id: 'user_019',
    name: 'Ananya Rao',
    email: 'ananya.rao@example.com',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    bio: 'Product manager and avid podcast listener. Host of dinner parties that always run late.',
    city: 'San Jose',
    college: 'UC Berkeley',
    interests: ['Tech', 'Dinner Parties', 'Podcasts', 'Pilates']
  },
  {
    id: 'user_020',
    name: 'Oscar Lindqvist',
    email: 'oscar.lindqvist@example.com',
    age: 29,
    photo: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80',
    bio: 'Furniture maker crafting Scandinavian timber pieces. Cold plunge and sauna enthusiast.',
    city: 'Stockholm',
    college: 'Konstfack',
    interests: ['Woodworking', 'Sauna', 'Skiing', 'Design']
  },
  {
    id: 'user_021',
    name: 'Sofia Rossi',
    email: 'sofia.rossi@example.com',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
    bio: 'Fashion buyer and vintage curator. If it is thrifted or has history, I adore it.',
    city: 'Milan',
    college: 'Bocconi University',
    interests: ['Vintage Fashion', 'Art Galleries', 'Espresso', 'Film']
  },
  {
    id: 'user_022',
    name: 'Ethan Brooks',
    email: 'ethan.brooks@example.com',
    age: 27,
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    bio: 'Documentary cinematographer. Have luggage, will travel. Looking for the best rooftop views.',
    city: 'Brooklyn',
    college: 'NYU Tisch',
    interests: ['Cinematography', 'Live Jazz', 'Cocktails', 'Travel']
  },
  {
    id: 'user_023',
    name: 'Tara Kapoor',
    email: 'tara.kapoor@example.com',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
    bio: 'Speech therapist and dog foster parent. My foster pups are my whole personality right now.',
    city: 'Austin',
    college: 'UT Austin',
    interests: ['Dogs', 'Volunteering', 'Paddleboarding', 'Baking']
  },
  {
    id: 'user_024',
    name: 'Leo Fontaine',
    email: 'leo.fontaine@example.com',
    age: 26,
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    bio: 'Sommelier and bookstore owner. Let’s find a bottle of pinot noir and a good novel.',
    city: 'Montreal',
    college: 'McGill University',
    interests: ['Wine', 'Literature', 'Chess', 'Cooking']
  },
  {
    id: 'user_025',
    name: 'Mei Tanaka',
    email: 'mei.tanaka@example.com',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    bio: 'Game UI artist and synthesizer hoarder. Playing indie games and collecting retro consoles.',
    city: 'Tokyo',
    college: 'Waseda University',
    interests: ['Gaming', 'Pixel Art', 'Synthwave', 'Karaoke']
  },
  {
    id: 'user_026',
    name: 'Kabir Varma',
    email: 'kabir.varma@example.com',
    age: 27,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    bio: 'Cardiothoracic residency fellow. Finding calm in morning runs and acoustic playlists.',
    city: 'Philadelphia',
    college: 'Penn Medicine',
    interests: ['Medicine', 'Running', 'Cooking', 'Classical Music']
  },
  {
    id: 'user_027',
    name: 'Isla MacLeod',
    email: 'isla.macleod@example.com',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    bio: 'Environmental science student. Big fan of cold ocean dips and heavy wool sweaters.',
    city: 'Edinburgh',
    college: 'University of Edinburgh',
    interests: ['Hiking', 'Ocean', 'Sustainability', 'Folk Music']
  },
  {
    id: 'user_028',
    name: 'Andre Costa',
    email: 'andre.costa@example.com',
    age: 28,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    bio: 'Surf instructor and coffee roaster. Early mornings, good waves, and dark roasts.',
    city: 'Lisbon',
    college: 'Universidade de Lisboa',
    interests: ['Surfing', 'Coffee Roasting', 'Photography', 'Skateboarding']
  },
  {
    id: 'user_029',
    name: 'Grace O’Connor',
    email: 'grace.oconnor@example.com',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    bio: 'Biomedical engineer making prosthetics. Weekend climber and amateur baker.',
    city: 'Dublin',
    college: 'Trinity College Dublin',
    interests: ['Biomedical', 'Climbing', 'Baking', 'Board Games']
  },
  {
    id: 'user_030',
    name: 'Noah Sterling',
    email: 'noah.sterling@example.com',
    age: 26,
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    bio: 'Landscape architect designing green roofs. Coffee snob and tennis player.',
    city: 'Melbourne',
    college: 'University of Melbourne',
    interests: ['Landscape Architecture', 'Tennis', 'Coffee', 'Cycling']
  },
  {
    id: 'user_031',
    name: 'Sora Takahashi',
    email: 'sora.takahashi@example.com',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    bio: 'Fashion stylist and collector of rare art books. Searching for the world’s best ramen.',
    city: 'Kyoto',
    college: 'Kyoto Seika University',
    interests: ['Fashion', 'Art Books', 'Tea Ceremony', 'Film']
  },
  {
    id: 'user_032',
    name: 'Felix Bauer',
    email: 'felix.bauer@example.com',
    age: 27,
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    bio: 'Aerospace engineer with a secret talent for baking artisanal sourdough.',
    city: 'Munich',
    college: 'TU Munich',
    interests: ['Aviation', 'Sourdough', 'Cycling', 'Sci-Fi']
  },
  {
    id: 'user_033',
    name: 'Amara Diop',
    email: 'amara.diop@example.com',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
    bio: 'Creative director & poet. Thriving at the intersection of words, music, and community.',
    city: 'Paris',
    college: 'Sorbonne University',
    interests: ['Poetry', 'Creative Direction', 'Afrobeat', 'Fashion']
  },
  {
    id: 'user_034',
    name: 'Javier Morales',
    email: 'javier.morales@example.com',
    age: 28,
    photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
    bio: 'Photojournalist covering street culture. Always on the move with an Olympus OM-1.',
    city: 'Barcelona',
    college: 'Universitat de Barcelona',
    interests: ['Photojournalism', 'Street Photography', 'Tapas', 'Vinyl']
  },
  {
    id: 'user_035',
    name: 'Leila Farhan',
    email: 'leila.farhan@example.com',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    bio: 'Human rights lawyer and ceramicist. Finding balance between justice and clay.',
    city: 'Geneva',
    college: 'Graduate Institute Geneva',
    interests: ['Law', 'Ceramics', 'Hiking', 'International Food']
  },
  {
    id: 'user_036',
    name: 'Kiran Patel',
    email: 'kiran.patel@example.com',
    age: 26,
    photo: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&w=800&q=80',
    bio: 'Product manager and marathon runner. Always curious about how things work.',
    city: 'San Francisco',
    college: 'UC Berkeley',
    interests: ['Running', 'Tech', 'Coffee', 'Podcasts']
  }
];

export const seededIncomingLikes = [
  'user_002',
  'user_003',
  'user_007',
  'user_011',
  'user_015',
  'user_023',
  'user_033'
];

export function seedDatabase(db = getDatabase()) {
  db.exec('PRAGMA foreign_keys = OFF;');
  db.exec('DELETE FROM matches;');
  db.exec('DELETE FROM swipes;');
  db.exec('DELETE FROM profiles;');
  db.exec('DELETE FROM users;');
  db.exec('PRAGMA foreign_keys = ON;');

  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, createdAt)
    VALUES (?, ?, ?, ?)
  `);

  const insertProfile = db.prepare(`
    INSERT INTO profiles (id, userId, name, age, photo, bio, city, college, interests)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const now = new Date().toISOString();

  for (const user of mockUsers) {
    insertUser.run(user.id, user.name, user.email, now);
    insertProfile.run(
      `prof_${user.id}`,
      user.id,
      user.name,
      user.age,
      user.photo,
      user.bio,
      user.city,
      user.college,
      JSON.stringify(user.interests)
    );
  }

  const insertSwipe = db.prepare(`
    INSERT INTO swipes (id, swiperId, targetId, action, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `);

  let swipeIndex = 1;
  for (const senderId of seededIncomingLikes) {
    const swipeId = `seed_swipe_${String(swipeIndex++).padStart(3, '0')}`;
    insertSwipe.run(swipeId, senderId, 'user_001', 'LIKE', new Date(Date.now() - swipeIndex * 3600000).toISOString());
  }

  return {
    usersCount: mockUsers.length,
    seededLikesCount: seededIncomingLikes.length
  };
}

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  const db = initializeDatabase();
  const result = seedDatabase(db);
  console.log(`Seeded ${result.usersCount} users and ${result.seededLikesCount} incoming likes.`);
  process.exit(0);
}
