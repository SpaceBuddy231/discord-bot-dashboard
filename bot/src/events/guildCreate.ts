import { Events, Guild } from 'discord.js';
import logger from '../utils/logger';

export default {
  name: Events.GuildCreate,

  /**
   * Execute when bot joins a guild
   * @param guild - Guild that the bot joined
   */
  async execute(guild: Guild) {
    logger.info(`✅ Joined new guild: ${guild.name} (${guild.id})`);
    logger.info(`Guild has ${guild.memberCount} members`);

    // TODO: Create database entry for new guild
    // TODO: Send welcome message to guild owner or system channel

    try {
      // Try to find a suitable channel to send a welcome message
      const systemChannel = guild.systemChannel;
      
      if (systemChannel && systemChannel.permissionsFor(guild.members.me!)?.has('SendMessages')) {
        await systemChannel.send({
          content: [
            '👋 **Hallo! Danke, dass du mich zu deinem Server hinzugefügt hast!**',
            '',
            '🚀 **Los geht\'s:**',
            '• Verwende `/setup` um mich zu konfigurieren',
            '• Verwende `/stats` um Server-Statistiken zu sehen',
            '• Verwende `/help` um alle Befehle anzuzeigen',
            '',
            '📊 **Dashboard:** Besuche das Web-Dashboard für erweiterte Funktionen!',
            '💡 **Support:** Bei Fragen oder Problemen, kontaktiere den Support.',
          ].join('\n'),
        });
      }
    } catch (error) {
      logger.error('Error sending welcome message:', error);
    }
  },
};
