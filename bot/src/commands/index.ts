import { readdirSync } from 'fs';
import { join } from 'path';
import { BotClient } from './bot';
import logger from './utils/logger';

export interface Command {
  data: any;
  execute: (interaction: any) => Promise<void>;
  cooldown?: number;
}

/**
 * Load all command modules
 * @param client - Bot client instance
 */
export async function loadCommands(client: BotClient): Promise<void> {
  const commandsPath = join(__dirname, 'commands');
  const commandFiles = readdirSync(commandsPath).filter(
    (file) => file.endsWith('.ts') || file.endsWith('.js')
  );

  let loadedCount = 0;

  for (const file of commandFiles) {
    if (file === 'index.ts' || file === 'index.js') continue;

    try {
      const filePath = join(commandsPath, file);
      const command = await import(filePath);
      const commandModule = command.default || command;

      if ('data' in commandModule && 'execute' in commandModule) {
        client.commands.set(commandModule.data.name, commandModule);
        loadedCount++;
        logger.debug(`Loaded command: ${commandModule.data.name}`);
      } else {
        logger.warn(`Command ${file} is missing required "data" or "execute" property`);
      }
    } catch (error) {
      logger.error(`Error loading command ${file}:`, error);
    }
  }

  logger.info(`✅ Loaded ${loadedCount} commands`);
}
