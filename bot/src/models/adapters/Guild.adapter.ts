/**
 * Guild Data Adapter - Works with both MongoDB and In-Memory DB
 */

import { Guild as MongooseGuild } from '../Guild.model';
import { inMemoryDB } from '../../database/fallback';
import { isUsingInMemoryDB } from '../../database/connection';

export interface GuildData {
  guildId: string;
  name?: string;
  settings?: {
    prefix?: string;
    language?: string;
    timezone?: string;
    features?: {
      welcome?: boolean;
      farewell?: boolean;
      autoRole?: boolean;
      leveling?: boolean;
      tickets?: boolean;
    };
    moderation?: {
      enabled?: boolean;
      logChannelId?: string;
      muteRoleId?: string;
      autoModSettings?: any;
    };
    logging?: any;
  };
  premium?: {
    active?: boolean;
    tier?: number;
    expiresAt?: Date;
  };
  active?: boolean;
}

export class GuildAdapter {
  /**
   * Find guild by ID
   */
  static async findByGuildId(guildId: string) {
    if (isUsingInMemoryDB()) {
      return await inMemoryDB.findGuild(guildId);
    }
    return await MongooseGuild.findOne({ guildId });
  }

  /**
   * Create new guild
   */
  static async create(data: GuildData) {
    if (isUsingInMemoryDB()) {
      return await inMemoryDB.createGuild(data.guildId, data);
    }
    return await MongooseGuild.create(data);
  }

  /**
   * Update guild
   */
  static async update(guildId: string, data: Partial<GuildData>) {
    if (isUsingInMemoryDB()) {
      return await inMemoryDB.updateGuild(guildId, data);
    }
    return await MongooseGuild.findOneAndUpdate(
      { guildId },
      { $set: data, updatedAt: new Date() },
      { new: true }
    );
  }

  /**
   * Find or create guild
   */
  static async findOrCreate(guildId: string, defaults: GuildData) {
    if (isUsingInMemoryDB()) {
      return await inMemoryDB.findOrCreateGuild(guildId, defaults);
    }

    let guild = await MongooseGuild.findOne({ guildId });
    if (!guild) {
      guild = await MongooseGuild.create({ guildId, ...defaults });
    }
    return guild;
  }

  /**
   * Delete guild
   */
  static async delete(guildId: string) {
    if (isUsingInMemoryDB()) {
      return await inMemoryDB.updateGuild(guildId, { active: false });
    }
    return await MongooseGuild.findOneAndUpdate(
      { guildId },
      { active: false },
      { new: true }
    );
  }

  /**
   * Get all active guilds
   */
  static async findActive() {
    if (isUsingInMemoryDB()) {
      const stats = inMemoryDB.getStats();
      return { count: stats.guilds };
    }
    return await MongooseGuild.find({ active: true });
  }
}
