import { Events, Guild } from 'discord.js';
import logger from '../utils/logger';

export default {
  name: Events.GuildDelete,

  /**
   * Execute when bot is removed from a guild
   * @param guild - Guild that the bot left
   */
  async execute(guild: Guild) {
    logger.info(`❌ Left guild: ${guild.name} (${guild.id})`);

    // TODO: Mark guild as inactive in database (don't delete for data retention)
    // TODO: Implement data retention policy
  },
};
