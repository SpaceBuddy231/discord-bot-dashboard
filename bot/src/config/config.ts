import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env' });

interface Config {
  discord: {
    token: string;
    clientId: string;
    clientSecret: string;
  };
  database: {
    mongoUri: string;
    redisUrl: string;
  };
  api: {
    baseUrl: string;
  };
  environment: string;
  logLevel: string;
}

/**
 * Configuration object for the bot
 * Contains all environment variables and settings
 */
const config: Config = {
  discord: {
    token: process.env.DISCORD_TOKEN || '',
    clientId: process.env.DISCORD_CLIENT_ID || '',
    clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
  },
  database: {
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/discord-bot-dashboard',
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  api: {
    baseUrl: process.env.API_URL || 'http://localhost:5000',
  },
  environment: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
};

// Validate required configuration
const requiredFields = [
  'discord.token',
  'discord.clientId',
  'database.mongoUri',
];

for (const field of requiredFields) {
  const keys = field.split('.');
  let value: any = config;
  
  for (const key of keys) {
    value = value[key];
  }
  
  if (!value) {
    throw new Error(`Missing required configuration: ${field}`);
  }
}

export default config;
