import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import logger from '../utils/logger';

export default {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Zeigt Server-Statistiken an'),

  /**
   * Execute the stats command
   * @param interaction - Discord slash command interaction
   */
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply();

      const guild = interaction.guild;
      if (!guild) {
        await interaction.editReply({
          content: '❌ Dieser Befehl kann nur in einem Server verwendet werden.',
        });
        return;
      }

      // Fetch guild data
      await guild.members.fetch();
      await guild.channels.fetch();

      // Calculate statistics
      const totalMembers = guild.memberCount;
      const onlineMembers = guild.members.cache.filter(
        (member) => member.presence?.status === 'online'
      ).size;
      const botCount = guild.members.cache.filter((member) => member.user.bot).size;
      const humanCount = totalMembers - botCount;

      const textChannels = guild.channels.cache.filter(
        (channel) => channel.type === 0
      ).size;
      const voiceChannels = guild.channels.cache.filter(
        (channel) => channel.type === 2
      ).size;
      const categories = guild.channels.cache.filter(
        (channel) => channel.type === 4
      ).size;

      const roleCount = guild.roles.cache.size;
      const emojiCount = guild.emojis.cache.size;

      const createdAt = Math.floor(guild.createdTimestamp / 1000);
      const owner = await guild.fetchOwner();

      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle(`📊 Statistiken für ${guild.name}`)
        .setThumbnail(guild.iconURL({ size: 256 }))
        .addFields(
          {
            name: '👥 Mitglieder',
            value: [
              `Gesamt: **${totalMembers}**`,
              `Online: **${onlineMembers}**`,
              `Menschen: **${humanCount}**`,
              `Bots: **${botCount}**`,
            ].join('\n'),
            inline: true,
          },
          {
            name: '📝 Kanäle',
            value: [
              `Text: **${textChannels}**`,
              `Voice: **${voiceChannels}**`,
              `Kategorien: **${categories}**`,
              `Gesamt: **${textChannels + voiceChannels}**`,
            ].join('\n'),
            inline: true,
          },
          {
            name: '🎭 Weitere Stats',
            value: [
              `Rollen: **${roleCount}**`,
              `Emojis: **${emojiCount}**`,
              `Boost Level: **${guild.premiumTier}**`,
              `Boosts: **${guild.premiumSubscriptionCount || 0}**`,
            ].join('\n'),
            inline: true,
          },
          {
            name: '👑 Server-Info',
            value: [
              `Besitzer: ${owner.user.tag}`,
              `Erstellt: <t:${createdAt}:R>`,
              `Verifizierungslevel: **${guild.verificationLevel}**`,
            ].join('\n'),
            inline: false,
          }
        )
        .setFooter({
          text: `Server ID: ${guild.id}`,
        })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

      logger.info(
        `Stats command executed by ${interaction.user.tag} in guild ${interaction.guildId}`
      );
    } catch (error) {
      logger.error('Error executing stats command:', error);

      const errorMessage = {
        content: '❌ Ein Fehler ist beim Abrufen der Statistiken aufgetreten.',
      };

      if (interaction.deferred) {
        await interaction.editReply(errorMessage);
      } else {
        await interaction.reply({ ...errorMessage, ephemeral: true });
      }
    }
  },

  cooldown: 10, // 10 seconds cooldown
};
