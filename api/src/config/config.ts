import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env' });

interface Config {
  port: number;
  env: string;
  frontendUrl: string;
  corsOrigin: string[];
  discord: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    botToken: string;
  };
  database: {
    mongoUri: string;
    redisUrl: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
  session: {
    secret: string;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    password: string;
    from: string;
  };
  encryption: {
    key: string;
  };
}

/**
 * Configuration object for the API
 */
const config: Config = {
  port: parseInt(process.env.API_PORT || '5000', 10),
  env: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  corsOrigin: [
    process.env.CORS_ORIGIN || 'http://localhost:5173',
    'http://localhost:3000',
  ],
  discord: {
    clientId: process.env.DISCORD_CLIENT_ID || '',
    clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
    redirectUri: process.env.DISCORD_REDIRECT_URI || 'http://localhost:3000/auth/callback',
    botToken: process.env.DISCORD_TOKEN || '',
  },
  database: {
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/discord-bot-dashboard',
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  session: {
    secret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'noreply@example.com',
  },
  encryption: {
    key: process.env.ENCRYPTION_KEY || 'your-32-char-encryption-key-here',
  },
};

// Validate required configuration
const requiredFields = [
  'discord.clientId',
  'discord.clientSecret',
  'jwt.secret',
  'session.secret',
];

for (const field of requiredFields) {
  const keys = field.split('.');
  let value: any = config;
  
  for (const key of keys) {
    value = value[key];
  }
  
  if (!value || value === 'your-secret-key-change-in-production' || 
      value === 'your-session-secret-change-in-production') {
    if (config.env === 'production') {
      throw new Error(`Missing or invalid required configuration: ${field}`);
    }
    console.warn(`⚠️  Warning: ${field} is using default value. Set it in production!`);
  }
}

export default config;
