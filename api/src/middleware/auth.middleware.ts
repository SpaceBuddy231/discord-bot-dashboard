import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import logger from '../utils/logger';

/**
 * Interface for JWT payload
 */
export interface JWTPayload {
  userId: string;
  username: string;
  email?: string;
  iat: number;
  exp: number;
}

/**
 * Extend Express Request to include user
 */
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Middleware to verify JWT token
 */
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header or cookie
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : req.cookies?.token;

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Kein Token gefunden. Authentifizierung erforderlich.',
      });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;

    // Attach user to request
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token abgelaufen. Bitte erneut anmelden.',
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Ungültiger Token.',
      });
      return;
    }

    logger.error('Error verifying token:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler bei der Token-Überprüfung.',
    });
  }
};

/**
 * Middleware to check if user has required permissions
 */
export const requirePermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentifizierung erforderlich.',
        });
        return;
      }

      // TODO: Check user permissions from database
      // For now, we'll implement basic permission checking

      next();
    } catch (error) {
      logger.error('Error checking permissions:', error);
      res.status(500).json({
        success: false,
        message: 'Fehler bei der Berechtigungsprüfung.',
      });
    }
  };
};

/**
 * Middleware to check if user has access to a guild
 */
export const requireGuildAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentifizierung erforderlich.',
      });
      return;
    }

    const guildId = req.params.guildId || req.body.guildId;

    if (!guildId) {
      res.status(400).json({
        success: false,
        message: 'Keine Guild-ID angegeben.',
      });
      return;
    }

    // TODO: Check if user has access to this guild from database
    // For now, we'll allow access

    next();
  } catch (error) {
    logger.error('Error checking guild access:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler bei der Zugriffsprüfung.',
    });
  }
};

/**
 * Generate JWT token
 */
export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};
