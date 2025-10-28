import { Events, Interaction } from 'discord.js';
import { BotClient } from '../bot';
import { commandRateLimiter } from '../utils/rateLimiter';
import logger from '../utils/logger';

export default {
  name: Events.InteractionCreate,

  /**
   * Execute when an interaction is created
   * @param interaction - Discord interaction
   */
  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const client = interaction.client as BotClient;
    const command = client.commands.get(interaction.commandName);

    if (!command) {
      logger.warn(`Command ${interaction.commandName} not found`);
      return;
    }

    // Check rate limit
    if (commandRateLimiter.isLimited(interaction.user.id)) {
      const resetTime = commandRateLimiter.getResetTime(interaction.user.id);
      const resetTimestamp = Math.floor(resetTime / 1000);

      await interaction.reply({
        content: `⏱️ Du bist zu schnell! Bitte warte bis <t:${resetTimestamp}:R>.`,
        ephemeral: true,
      });
      return;
    }

    // Check cooldown
    if (command.cooldown) {
      const { cooldowns } = client;
      
      if (!cooldowns.has(command.data.name)) {
        cooldowns.set(command.data.name, new Map());
      }

      const now = Date.now();
      const timestamps = cooldowns.get(command.data.name)!;
      const cooldownAmount = command.cooldown * 1000;

      if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id)! + cooldownAmount;

        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          await interaction.reply({
            content: `⏰ Bitte warte ${timeLeft.toFixed(1)} Sekunden bevor du \`${command.data.name}\` erneut verwendest.`,
            ephemeral: true,
          });
          return;
        }
      }

      timestamps.set(interaction.user.id, now);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
    }

    // Execute command
    try {
      logger.info(
        `Command ${interaction.commandName} executed by ${interaction.user.tag} in guild ${interaction.guildId}`
      );
      await command.execute(interaction);
    } catch (error) {
      logger.error(`Error executing command ${interaction.commandName}:`, error);

      const errorMessage = {
        content: '❌ Ein Fehler ist beim Ausführen dieses Befehls aufgetreten!',
        ephemeral: true,
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    }
  },
};
