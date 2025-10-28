/**
 * Environment configuration for different deployment environments
 */

// Check if we're in development mode
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || (isDev 
  ? 'http://localhost:5000/api' 
  : 'https://your-backend.railway.app/api'
);

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || (isDev
  ? 'ws://localhost:5000'
  : 'wss://your-backend.railway.app'
);

// Discord OAuth
const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID || '';

/**
 * Application environment configuration
 */
export const env = {
  // Environment
  isDev,
  isProd,
  
  // API Endpoints
  apiUrl: API_URL,
  wsUrl: WEBSOCKET_URL,
  
  // Discord
  discordClientId: DISCORD_CLIENT_ID,
  discordAuthUrl: `${API_URL}/auth/discord`,
  
  // Features
  features: {
    analytics: true,
    customCommands: true,
    autoMod: true,
    realTimeUpdates: isProd, // Only in production with proper backend
  },
} as const;

// Validate required environment variables in production
if (isProd) {
  const required = ['VITE_API_URL', 'VITE_WEBSOCKET_URL'];
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    console.error('Please configure these in your Vercel dashboard');
  }
}

// Log configuration in development
if (isDev) {
  console.log('🔧 Environment Configuration:', {
    mode: isDev ? 'development' : 'production',
    apiUrl: env.apiUrl,
    wsUrl: env.wsUrl,
  });
}
