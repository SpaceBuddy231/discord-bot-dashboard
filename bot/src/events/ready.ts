import { Client, Events } from 'discord.js';
import logger from '../utils/logger';

export default {
  name: Events.ClientReady,
  once: true,

  /**
   * Execute when bot is ready
   * @param client - Discord client instance
   */
  execute(client: Client) {
    if (!client.user) {
      logger.error('Client user is not available');
      return;
    }

    logger.info(`✅ Bot logged in as ${client.user.tag}`);
    logger.info(`📊 Connected to ${client.guilds.cache.size} guilds`);
    logger.info(`👥 Serving ${client.users.cache.size} users`);

    // Set bot presence
    client.user.setPresence({
      activities: [
        {
          name: 'Server verwalten | /help',
          type: 3, // Watching
        },
      ],
      status: 'online',
    });

    logger.info('🟢 Bot is now online and ready');
  },
};
