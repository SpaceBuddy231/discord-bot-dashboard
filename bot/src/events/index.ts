import { readdirSync } from 'fs';
import { join } from 'path';
import { BotClient } from './bot';
import logger from './utils/logger';

export interface Event {
  name: string;
  once?: boolean;
  execute: (...args: any[]) => Promise<void> | void;
}

/**
 * Load all event modules
 * @param client - Bot client instance
 */
export async function loadEvents(client: BotClient): Promise<void> {
  const eventsPath = join(__dirname, 'events');
  const eventFiles = readdirSync(eventsPath).filter(
    (file) => file.endsWith('.ts') || file.endsWith('.js')
  );

  let loadedCount = 0;

  for (const file of eventFiles) {
    if (file === 'index.ts' || file === 'index.js') continue;

    try {
      const filePath = join(eventsPath, file);
      const event = await import(filePath);
      const eventModule = event.default || event;

      if ('name' in eventModule && 'execute' in eventModule) {
        if (eventModule.once) {
          client.once(eventModule.name, (...args: any[]) => eventModule.execute(...args));
        } else {
          client.on(eventModule.name, (...args: any[]) => eventModule.execute(...args));
        }
        loadedCount++;
        logger.debug(`Loaded event: ${eventModule.name}`);
      } else {
        logger.warn(`Event ${file} is missing required "name" or "execute" property`);
      }
    } catch (error) {
      logger.error(`Error loading event ${file}:`, error);
    }
  }

  logger.info(`✅ Loaded ${loadedCount} events`);
}
