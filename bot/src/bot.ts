import {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
  SlashCommandBuilder,
} from 'discord.js';
import logger from './utils/logger';
import config from './config/config';
import { connectDatabase, connectRedis } from './database/connection';
import { loadCommands } from './commands';
import { loadEvents } from './events';

/**
 * Extended Discord Client with custom properties
 */
export class BotClient extends Client {
  public commands: Collection<string, any>;
  public cooldowns: Collection<string, Collection<string, number>>;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.commands = new Collection();
    this.cooldowns = new Collection();
  }

  /**
   * Initialize the bot
   */
  public async initialize(): Promise<void> {
    try {
      logger.info('🚀 Initializing Discord Bot...');

      // Connect to databases
      await connectDatabase();
      await connectRedis();

      // Load commands and events
      await loadCommands(this);
      await loadEvents(this);

      // Register slash commands
      await this.registerCommands();

      // Login to Discord
      await this.login(config.discord.token);

      logger.info('✅ Bot initialization complete');
    } catch (error) {
      logger.error('Failed to initialize bot:', error);
      throw error;
    }
  }

  /**
   * Register slash commands with Discord API
   */
  private async registerCommands(): Promise<void> {
    try {
      const rest = new REST({ version: '10' }).setToken(config.discord.token);

      const commandsData = Array.from(this.commands.values()).map((command) =>
        command.data.toJSON()
      );

      logger.info(`Started refreshing ${commandsData.length} application (/) commands.`);

      // Register commands globally
      const data = await rest.put(Routes.applicationCommands(config.discord.clientId), {
        body: commandsData,
      }) as any[];

      logger.info(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
      logger.error('Error registering commands:', error);
      throw error;
    }
  }

  /**
   * Graceful shutdown
   */
  public async shutdown(): Promise<void> {
    logger.info('Shutting down bot...');
    
    try {
      this.destroy();
      logger.info('Bot disconnected from Discord');
    } catch (error) {
      logger.error('Error during shutdown:', error);
    }
  }
}

// Create bot instance
export const bot = new BotClient();
