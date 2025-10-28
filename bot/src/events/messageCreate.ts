import { Events, Message } from 'discord.js';
import logger from '../utils/logger';

export default {
  name: Events.MessageCreate,

  /**
   * Execute when a message is created
   * @param message - Message that was created
   */
  async execute(message: Message) {
    // Ignore bot messages
    if (message.author.bot) return;

    // Ignore DMs
    if (!message.guild) return;

    try {
      // TODO: Check for auto-moderation rules
      // TODO: Log message to analytics
      // TODO: Check for custom commands
      // TODO: Check for profanity filter
      // TODO: Check for spam detection

      logger.debug(`Message from ${message.author.tag} in ${message.guild.name}: ${message.content}`);
    } catch (error) {
      logger.error('Error handling message:', error);
    }
  },
};
