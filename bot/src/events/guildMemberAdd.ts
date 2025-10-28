import { Events, GuildMember } from 'discord.js';
import logger from '../utils/logger';

export default {
  name: Events.GuildMemberAdd,

  /**
   * Execute when a member joins a guild
   * @param member - Guild member that joined
   */
  async execute(member: GuildMember) {
    logger.info(`New member joined: ${member.user.tag} in guild ${member.guild.name}`);

    // TODO: Check for auto-role configuration
    // TODO: Check for welcome message configuration
    // TODO: Log to analytics
    // TODO: Check for raid protection

    try {
      // Example: Send welcome DM (if configured)
      // await member.send(`Welcome to ${member.guild.name}!`);
    } catch (error) {
      logger.error('Error handling member join:', error);
    }
  },
};
