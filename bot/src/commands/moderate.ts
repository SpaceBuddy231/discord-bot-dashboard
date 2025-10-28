import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { isModerator } from '../utils/permissions';
import logger from '../utils/logger';

export default {
  data: new SlashCommandBuilder()
    .setName('moderate')
    .setDescription('Moderations-Tools für Server-Verwaltung')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('warn')
        .setDescription('Verwarnt einen Benutzer')
        .addUserOption((option) =>
          option.setName('user').setDescription('Der zu verwarnende Benutzer').setRequired(true)
        )
        .addStringOption((option) =>
          option.setName('reason').setDescription('Grund für die Verwarnung').setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('kick')
        .setDescription('Kickt einen Benutzer vom Server')
        .addUserOption((option) =>
          option.setName('user').setDescription('Der zu kickende Benutzer').setRequired(true)
        )
        .addStringOption((option) =>
          option.setName('reason').setDescription('Grund für den Kick').setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('ban')
        .setDescription('Bannt einen Benutzer vom Server')
        .addUserOption((option) =>
          option.setName('user').setDescription('Der zu bannende Benutzer').setRequired(true)
        )
        .addStringOption((option) =>
          option.setName('reason').setDescription('Grund für den Bann').setRequired(false)
        )
        .addIntegerOption((option) =>
          option
            .setName('delete_days')
            .setDescription('Anzahl der Tage, deren Nachrichten gelöscht werden sollen (0-7)')
            .setMinValue(0)
            .setMaxValue(7)
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('timeout')
        .setDescription('Gibt einem Benutzer einen Timeout')
        .addUserOption((option) =>
          option.setName('user').setDescription('Der Benutzer').setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName('duration')
            .setDescription('Dauer in Minuten')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(40320)
        )
        .addStringOption((option) =>
          option.setName('reason').setDescription('Grund für den Timeout').setRequired(false)
        )
    ),

  /**
   * Execute the moderate command
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

      if (!isModerator(interaction.member as any)) {
        await interaction.reply({
          content: '❌ Du benötigst Moderator-Rechte, um diesen Befehl zu verwenden.',
          ephemeral: true,
        });
        return;
      }

      await interaction.deferReply({ ephemeral: true });

      const subcommand = interaction.options.getSubcommand();
      const targetUser = interaction.options.getUser('user', true);
      const reason = interaction.options.getString('reason') || 'Kein Grund angegeben';

      // Prevent moderating bot owner or other bots
      if (targetUser.bot) {
        await interaction.editReply({
          content: '❌ Du kannst keine Bots moderieren.',
        });
        return;
      }

      const guild = interaction.guild;
      if (!guild) {
        await interaction.editReply({
          content: '❌ Dieser Befehl kann nur in einem Server verwendet werden.',
        });
        return;
      }

      const targetMember = await guild.members.fetch(targetUser.id).catch(() => null);
      if (!targetMember) {
        await interaction.editReply({
          content: '❌ Benutzer nicht gefunden oder nicht mehr im Server.',
        });
        return;
      }

      let embed: EmbedBuilder;

      switch (subcommand) {
        case 'warn':
          // TODO: Save warning to database
          embed = new EmbedBuilder()
            .setColor(0xffa500)
            .setTitle('⚠️ Benutzer verwarnt')
            .addFields(
              { name: 'Benutzer', value: `${targetUser.tag} (${targetUser.id})`, inline: true },
              { name: 'Moderator', value: interaction.user.tag, inline: true },
              { name: 'Grund', value: reason, inline: false }
            )
            .setTimestamp();

          await interaction.editReply({ embeds: [embed] });
          logger.info(
            `User ${targetUser.tag} warned by ${interaction.user.tag} in guild ${guild.id}`
          );
          break;

        case 'kick':
          if (!targetMember.kickable) {
            await interaction.editReply({
              content: '❌ Ich kann diesen Benutzer nicht kicken. Überprüfe meine Berechtigungen.',
            });
            return;
          }

          await targetMember.kick(reason);

          embed = new EmbedBuilder()
            .setColor(0xff6600)
            .setTitle('👢 Benutzer gekickt')
            .addFields(
              { name: 'Benutzer', value: `${targetUser.tag} (${targetUser.id})`, inline: true },
              { name: 'Moderator', value: interaction.user.tag, inline: true },
              { name: 'Grund', value: reason, inline: false }
            )
            .setTimestamp();

          await interaction.editReply({ embeds: [embed] });
          logger.info(
            `User ${targetUser.tag} kicked by ${interaction.user.tag} in guild ${guild.id}`
          );
          break;

        case 'ban':
          if (!targetMember.bannable) {
            await interaction.editReply({
              content: '❌ Ich kann diesen Benutzer nicht bannen. Überprüfe meine Berechtigungen.',
            });
            return;
          }

          const deleteDays = interaction.options.getInteger('delete_days') || 0;
          await targetMember.ban({ reason, deleteMessageSeconds: deleteDays * 86400 });

          embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('🔨 Benutzer gebannt')
            .addFields(
              { name: 'Benutzer', value: `${targetUser.tag} (${targetUser.id})`, inline: true },
              { name: 'Moderator', value: interaction.user.tag, inline: true },
              { name: 'Grund', value: reason, inline: false },
              { name: 'Nachrichten gelöscht', value: `${deleteDays} Tage`, inline: true }
            )
            .setTimestamp();

          await interaction.editReply({ embeds: [embed] });
          logger.info(
            `User ${targetUser.tag} banned by ${interaction.user.tag} in guild ${guild.id}`
          );
          break;

        case 'timeout':
          const duration = interaction.options.getInteger('duration', true);
          const timeoutMs = duration * 60 * 1000;

          await targetMember.timeout(timeoutMs, reason);

          embed = new EmbedBuilder()
            .setColor(0xffff00)
            .setTitle('⏰ Benutzer timeout gegeben')
            .addFields(
              { name: 'Benutzer', value: `${targetUser.tag} (${targetUser.id})`, inline: true },
              { name: 'Moderator', value: interaction.user.tag, inline: true },
              { name: 'Dauer', value: `${duration} Minuten`, inline: true },
              { name: 'Grund', value: reason, inline: false }
            )
            .setTimestamp();

          await interaction.editReply({ embeds: [embed] });
          logger.info(
            `User ${targetUser.tag} timed out by ${interaction.user.tag} in guild ${guild.id}`
          );
          break;
      }

      // TODO: Log moderation action to database and audit log channel
    } catch (error) {
      logger.error('Error executing moderate command:', error);

      const errorMessage = {
        content: '❌ Ein Fehler ist beim Ausführen der Moderation aufgetreten.',
      };

      if (interaction.deferred) {
        await interaction.editReply(errorMessage);
      } else {
        await interaction.reply({ ...errorMessage, ephemeral: true });
      }
    }
  },

  cooldown: 5, // 5 seconds cooldown
};
