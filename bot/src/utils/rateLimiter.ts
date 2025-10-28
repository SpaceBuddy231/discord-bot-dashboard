import { Collection } from 'discord.js';
import logger from './logger';

interface RateLimitData {
  count: number;
  resetTime: number;
}

/**
 * Rate limiter to prevent spam and abuse
 */
export class RateLimiter {
  private limits: Collection<string, RateLimitData>;
  private maxRequests: number;
  private windowMs: number;

  /**
   * Create a new rate limiter
   * @param maxRequests - Maximum requests per window
   * @param windowMs - Time window in milliseconds
   */
  constructor(maxRequests: number = 5, windowMs: number = 60000) {
    this.limits = new Collection();
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;

    // Cleanup expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Check if a user is rate limited
   * @param userId - User ID to check
   * @returns Whether the user is rate limited
   */
  public isLimited(userId: string): boolean {
    const now = Date.now();
    const limit = this.limits.get(userId);

    if (!limit || now > limit.resetTime) {
      // No limit or expired, create new entry
      this.limits.set(userId, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return false;
    }

    if (limit.count >= this.maxRequests) {
      logger.warn(`Rate limit exceeded for user ${userId}`);
      return true;
    }

    // Increment count
    limit.count++;
    return false;
  }

  /**
   * Get remaining requests for a user
   * @param userId - User ID to check
   * @returns Remaining requests
   */
  public getRemaining(userId: string): number {
    const limit = this.limits.get(userId);
    if (!limit || Date.now() > limit.resetTime) {
      return this.maxRequests;
    }
    return Math.max(0, this.maxRequests - limit.count);
  }

  /**
   * Get reset time for a user
   * @param userId - User ID to check
   * @returns Reset time in milliseconds
   */
  public getResetTime(userId: string): number {
    const limit = this.limits.get(userId);
    if (!limit) {
      return Date.now();
    }
    return limit.resetTime;
  }

  /**
   * Reset rate limit for a user
   * @param userId - User ID to reset
   */
  public reset(userId: string): void {
    this.limits.delete(userId);
    logger.info(`Rate limit reset for user ${userId}`);
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [userId, limit] of this.limits.entries()) {
      if (now > limit.resetTime) {
        this.limits.delete(userId);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.debug(`Cleaned up ${cleaned} expired rate limit entries`);
    }
  }

  /**
   * Get current limits collection size
   * @returns Number of active limits
   */
  public size(): number {
    return this.limits.size;
  }
}

// Export default rate limiter instances
export const commandRateLimiter = new RateLimiter(5, 10000); // 5 commands per 10 seconds
export const globalRateLimiter = new RateLimiter(20, 60000); // 20 actions per minute
