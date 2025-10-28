import mongoose from 'mongoose';
import Redis from 'ioredis';
import config from '../config/config';
import logger from '../utils/logger';
import { inMemoryDB } from './fallback';

let redisClient: Redis | null = null;
let useInMemoryDB = false;

/**
 * Connect to MongoDB database with fallback to in-memory
 */
export async function connectDatabase(): Promise<void> {
  // Skip if MongoDB URI not configured or using default
  if (!config.database.mongoUri || config.database.mongoUri === 'mongodb://localhost:27017/discord-bot-dashboard') {
    logger.warn('⚠️  MongoDB URI not configured or using default');
    logger.info('🔄 Switching to IN-MEMORY database (no persistence)');
    useInMemoryDB = true;
    inMemoryDB.activate();
    return;
  }

  try {
    await mongoose.connect(config.database.mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    logger.info('✅ Connected to MongoDB');

    // MongoDB connection events
    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
      logger.warn('🔄 Switching to IN-MEMORY database');
      useInMemoryDB = true;
      inMemoryDB.activate();
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Using in-memory fallback...');
      useInMemoryDB = true;
      inMemoryDB.activate();
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
      useInMemoryDB = false;
    });
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    logger.warn('🔄 Switching to IN-MEMORY database (no persistence)');
    useInMemoryDB = true;
    inMemoryDB.activate();
  }
}

/**
 * Check if using in-memory database
 */
export function isUsingInMemoryDB(): boolean {
  return useInMemoryDB || inMemoryDB.isEnabled();
}

/**
 * Connect to Redis cache with fallback to in-memory
 */
export async function connectRedis(): Promise<Redis | null> {
  // Skip if Redis URL not configured or using default
  if (!config.database.redisUrl || config.database.redisUrl === 'redis://localhost:6379') {
    logger.warn('⚠️  Redis URL not configured or using default');
    logger.info('💡 Using IN-MEMORY cache (no session persistence)');
    return null;
  }

  try {
    redisClient = new Redis(config.database.redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => {
        if (times > 3) {
          logger.warn('💡 Redis unavailable, using in-memory cache');
          return null;
        }
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      connectTimeout: 5000,
    });

    redisClient.on('connect', () => {
      logger.info('✅ Connected to Redis');
    });

    redisClient.on('error', (error) => {
      logger.error('Redis connection error:', error);
      logger.warn('💡 Using in-memory cache as fallback');
    });

    redisClient.on('reconnecting', () => {
      logger.warn('Redis reconnecting...');
    });

    // Test connection
    await redisClient.ping();
    return redisClient;
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    logger.warn('💡 Using IN-MEMORY cache (sessions will be lost on restart)');
    redisClient = null;
    return null;
  }
}

/**
 * In-memory cache fallback
 */
const memoryCache = new Map<string, { value: string; expiry?: number }>();

/**
 * Get Redis client instance (can be null if using in-memory)
 */
export function getRedisClient(): Redis | null {
  return redisClient;
}

/**
 * Set cache value (works with or without Redis)
 */
export async function setCache(key: string, value: string, ttlSeconds?: number): Promise<void> {
  if (redisClient) {
    try {
      if (ttlSeconds) {
        await redisClient.setex(key, ttlSeconds, value);
      } else {
        await redisClient.set(key, value);
      }
      return;
    } catch (error) {
      logger.error('Redis set error:', error);
    }
  }

  // Fallback to memory
  const expiry = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
  memoryCache.set(key, { value, expiry });
}

/**
 * Get cache value (works with or without Redis)
 */
export async function getCache(key: string): Promise<string | null> {
  if (redisClient) {
    try {
      return await redisClient.get(key);
    } catch (error) {
      logger.error('Redis get error:', error);
    }
  }

  // Fallback to memory
  const cached = memoryCache.get(key);
  if (!cached) return null;

  if (cached.expiry && Date.now() > cached.expiry) {
    memoryCache.delete(key);
    return null;
  }

  return cached.value;
}

/**
 * Delete cache value (works with or without Redis)
 */
export async function deleteCache(key: string): Promise<void> {
  if (redisClient) {
    try {
      await redisClient.del(key);
      return;
    } catch (error) {
      logger.error('Redis delete error:', error);
    }
  }

  // Fallback to memory
  memoryCache.delete(key);
}

/**
 * Disconnect from all databases
 */
export async function disconnectDatabases(): Promise<void> {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      logger.info('Disconnected from MongoDB');
    }

    if (redisClient) {
      await redisClient.quit();
      logger.info('Disconnected from Redis');
    }

    // Clear in-memory caches
    memoryCache.clear();
    
    if (useInMemoryDB) {
      const data = inMemoryDB.export();
      logger.info('💾 In-memory data exported:', {
        guilds: data.guilds.length,
        users: data.users.length,
      });
    }
  } catch (error) {
    logger.error('Error disconnecting from databases:', error);
    throw error;
  }
}
