// MongoDB initialization script
db = db.getSiblingDB('discord-bot-dashboard');

// Create collections with validation
db.createCollection('guilds', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['guildId', 'name', 'ownerId'],
      properties: {
        guildId: {
          bsonType: 'string',
          description: 'Discord Guild ID - required'
        },
        name: {
          bsonType: 'string',
          description: 'Guild name - required'
        },
        ownerId: {
          bsonType: 'string',
          description: 'Guild owner ID - required'
        }
      }
    }
  }
});

db.createCollection('users');
db.createCollection('analytics');
db.createCollection('moderationlogs');
db.createCollection('customcommands');

// Create indexes
db.guilds.createIndex({ guildId: 1 }, { unique: true });
db.guilds.createIndex({ ownerId: 1 });
db.guilds.createIndex({ active: 1 });

db.users.createIndex({ userId: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { sparse: true });

db.analytics.createIndex({ guildId: 1, timestamp: -1 });
db.analytics.createIndex({ guildId: 1, type: 1, timestamp: -1 });
db.analytics.createIndex({ timestamp: 1 }, { expireAfterSeconds: 7776000 }); // 90 days

db.moderationlogs.createIndex({ guildId: 1, caseId: 1 }, { unique: true });
db.moderationlogs.createIndex({ guildId: 1, userId: 1, timestamp: -1 });

db.customcommands.createIndex({ guildId: 1, name: 1 }, { unique: true });
db.customcommands.createIndex({ guildId: 1, enabled: 1 });

print('✅ MongoDB initialized successfully!');
