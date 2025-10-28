import { bot } from './bot';
import logger from './utils/logger';
import { disconnectDatabases } from './database/connection';

/**
 * Main entry point for the Discord bot
 */
async function main() {
  try {
    // Initialize the bot
    await bot.initialize();

    // Handle process signals for graceful shutdown
    process.on('SIGINT', handleShutdown);
    process.on('SIGTERM', handleShutdown);
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      handleShutdown();
    });
  } catch (error) {
    logger.error('Failed to start bot:', error);
    process.exit(1);
  }
}

/**
 * Handle graceful shutdown
 */
async function handleShutdown() {
  logger.info('Received shutdown signal');
  
  try {
    await bot.shutdown();
    await disconnectDatabases();
    logger.info('Graceful shutdown complete');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
}

// Start the bot
main();
