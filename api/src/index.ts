import { createApp, createHttpServer } from './app';
import { connectDatabase, connectRedis, disconnectDatabases } from './database/connection';
import config from './config/config';
import logger from './utils/logger';

/**
 * Main entry point for the API server
 */
async function main() {
  try {
    logger.info('🚀 Starting Discord Bot Dashboard API...');

    // Connect to databases
    await connectDatabase();
    await connectRedis();

    // Create Express app
    const app = createApp();

    // Create HTTP server with Socket.IO
    const { httpServer, io } = createHttpServer(app);

    // Make io available globally
    (global as any).io = io;

    // Start server
    httpServer.listen(config.port, () => {
      logger.info(`✅ API server running on port ${config.port}`);
      logger.info(`🌍 Environment: ${config.env}`);
      logger.info(`📊 Health check: http://localhost:${config.port}/health`);
      logger.info(`🔌 WebSocket server ready`);
    });

    // Handle process signals for graceful shutdown
    process.on('SIGINT', () => handleShutdown(httpServer));
    process.on('SIGTERM', () => handleShutdown(httpServer));
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      handleShutdown(httpServer);
    });
  } catch (error) {
    logger.error('Failed to start API server:', error);
    process.exit(1);
  }
}

/**
 * Handle graceful shutdown
 */
async function handleShutdown(server: any) {
  logger.info('Received shutdown signal');
  
  try {
    // Close server
    server.close(() => {
      logger.info('HTTP server closed');
    });

    // Disconnect from databases
    await disconnectDatabases();

    logger.info('Graceful shutdown complete');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
}

// Start the server
main();
