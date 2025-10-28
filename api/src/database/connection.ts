import mongoose from 'mongoose';
import Redis from 'ioredis';
import config from '../config/config';
import logger from '../utils/logger';

let redisClient: Redis | null = null;

/**
 * Connect to MongoDB database
 */
export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(config.database.mongoUri);
    logger.info('✅ Connected to MongoDB');

    mongoose.connection.on('error', (error: Error) => {
      logger.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

/**
 * Connect to Redis cache
 */
export async function connectRedis(): Promise<Redis> {
  try {
    redisClient = new Redis(config.database.redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    redisClient.on('connect', () => {
      logger.info('✅ Connected to Redis');
    });

    redisClient.on('error', (error: Error) => {
      logger.error('Redis connection error:', error);
    });

    redisClient.on('reconnecting', () => {
      logger.warn('Redis reconnecting...');
    });

    return redisClient;
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    throw error;
  }
}

/**
 * Get Redis client instance
 */
export function getRedisClient(): Redis {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
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
  } catch (error) {
    logger.error('Error disconnecting from databases:', error);
    throw error;
  }
}
