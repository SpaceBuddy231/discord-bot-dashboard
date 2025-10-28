import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { isAdmin } from '../utils/permissions';
import logger from '../utils/logger';

export default {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Initiale Bot-Konfiguration für diesen Server')
    .addStringOption((option) =>
      option
        .setName('language')
        .setDescription('Sprache für den Bot')
        .setRequired(false)
        .addChoices(
          { name: 'Deutsch', value: 'de' },
          { name: 'English', value: 'en' }
        )
    )
    .addStringOption((option) =>
      option
        .setName('timezone')
        .setDescription('Zeitzone für den Server')
        .setRequired(false)
    ),

  /**
   * Execute the setup command
   * @param interaction - Discord slash command interaction
   */
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      // Check permissions
      if (!interaction.member || !('permissions' in interaction.member)) {
        await interaction.reply({
          content: '❌ Fehler beim Überprüfen der Berechtigungen.',
          ephemeral: true,
        });
        return;
      }

      if (!isAdmin(interaction.member as any)) {
        await interaction.reply({
          content: '❌ Du benötigst Administrator-Rechte, um diesen Befehl zu verwenden.',
          ephemeral: true,
        });
        return;
      }

      await interaction.deferReply();

      const language = interaction.options.getString('language') || 'de';
      const timezone = interaction.options.getString('timezone') || 'Europe/Berlin';

      // TODO: Save configuration to database
      // This will be implemented when we create the database models

      const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle('✅ Bot erfolgreich konfiguriert')
        .setDescription('Der Bot wurde für diesen Server eingerichtet.')
        .addFields(
          { name: '🌍 Sprache', value: language === 'de' ? 'Deutsch' : 'English', inline: true },
          { name: '🕒 Zeitzone', value: timezone, inline: true },
          { name: '📊 Server ID', value: interaction.guildId || 'Unbekannt', inline: true }
        )
        .setFooter({
          text: `Konfiguriert von ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

      logger.info(
        `Setup command executed by ${interaction.user.tag} in guild ${interaction.guildId}`
      );
    } catch (error) {
      logger.error('Error executing setup command:', error);

      const errorMessage = {
        content: '❌ Ein Fehler ist beim Ausführen des Befehls aufgetreten.',
        ephemeral: true,
      };

      if (interaction.deferred) {
        await interaction.editReply(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    }
  },

  cooldown: 30, // 30 seconds cooldown
};
