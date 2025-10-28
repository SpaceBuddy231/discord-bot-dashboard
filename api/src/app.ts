import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import config from './config/config';
import logger from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.middleware';
import { apiLimiter } from './middleware/rateLimiter.middleware';

/**
 * Create and configure Express application
 */
export function createApp(): Application {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(mongoSanitize());

  // CORS configuration
  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // Compression middleware
  app.use(compression());

  // Request logging
  app.use((req, _res, next) => {
    logger.info(`${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
    next();
  });

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'Server is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // API rate limiting
  app.use('/api', apiLimiter);

  // TODO: Import and use routes
  // app.use('/api/auth', authRoutes);
  // app.use('/api/guilds', guildsRoutes);
  // app.use('/api/analytics', analyticsRoutes);
  // app.use('/api/moderation', moderationRoutes);
  // app.use('/api/commands', commandsRoutes);

  // Placeholder for API routes
  app.get('/api', (_req, res) => {
    res.json({
      success: true,
      message: 'Discord Bot Dashboard API',
      version: '1.0.0',
      docs: '/api/docs',
    });
  });

  // Error handlers (must be last)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

/**
 * Create HTTP server and Socket.IO instance
 */
export function createHttpServer(app: Application) {
  const httpServer = createServer(app);

  // Socket.IO setup
  const io = new SocketServer(httpServer, {
    cors: {
      origin: config.corsOrigin,
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Socket.IO authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    // TODO: Verify JWT token
    next();
  });

  // Socket.IO connection handler
  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });

    // TODO: Add more socket event handlers
  });

  return { httpServer, io };
}
