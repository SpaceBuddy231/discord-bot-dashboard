/**
 * In-Memory Fallback Database
 * Wird verwendet wenn MongoDB nicht verfügbar ist
 */

import logger from '../utils/logger';

interface InMemoryStore {
  guilds: Map<string, any>;
  users: Map<string, any>;
  analytics: Map<string, any[]>;
  moderationLogs: Map<string, any[]>;
  customCommands: Map<string, any[]>;
}

class InMemoryDatabase {
  private store: InMemoryStore;
  private isActive: boolean = false;

  constructor() {
    this.store = {
      guilds: new Map(),
      users: new Map(),
      analytics: new Map(),
      moderationLogs: new Map(),
      customCommands: new Map(),
    };
  }

  activate() {
    this.isActive = true;
    logger.warn('⚠️  Using IN-MEMORY database (data will be lost on restart)');
    logger.info('💡 To persist data, configure MongoDB connection');
  }

  isEnabled() {
    return this.isActive;
  }

  // Guild Operations
  async findGuild(guildId: string) {
    return this.store.guilds.get(guildId) || null;
  }

  async createGuild(guildId: string, data: any) {
    const guild = {
      guildId,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.store.guilds.set(guildId, guild);
    return guild;
  }

  async updateGuild(guildId: string, data: any) {
    const existing = this.store.guilds.get(guildId);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    this.store.guilds.set(guildId, updated);
    return updated;
  }

  async findOrCreateGuild(guildId: string, defaults: any) {
    let guild = await this.findGuild(guildId);
    if (!guild) {
      guild = await this.createGuild(guildId, defaults);
    }
    return guild;
  }

  // User Operations
  async findUser(userId: string) {
    return this.store.users.get(userId) || null;
  }

  async createUser(userId: string, data: any) {
    const user = {
      userId,
      ...data,
      createdAt: new Date(),
    };
    this.store.users.set(userId, user);
    return user;
  }

  async updateUser(userId: string, data: any) {
    const existing = this.store.users.get(userId);
    if (!existing) return null;

    const updated = { ...existing, ...data };
    this.store.users.set(userId, updated);
    return updated;
  }

  // Analytics Operations
  async createAnalytics(guildId: string, data: any) {
    const logs = this.store.analytics.get(guildId) || [];
    const entry = {
      ...data,
      guildId,
      timestamp: new Date(),
    };
    logs.push(entry);
    
    // Keep only last 10000 entries per guild
    if (logs.length > 10000) {
      logs.shift();
    }
    
    this.store.analytics.set(guildId, logs);
    return entry;
  }

  async getAnalytics(guildId: string, eventType?: string, limit = 100) {
    const logs = this.store.analytics.get(guildId) || [];
    let filtered = eventType 
      ? logs.filter(log => log.eventType === eventType)
      : logs;
    
    return filtered.slice(-limit).reverse();
  }

  async getAnalyticsStats(guildId: string, days = 7) {
    const logs = this.store.analytics.get(guildId) || [];
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const recent = logs.filter(log => new Date(log.timestamp) > cutoff);

    return {
      totalEvents: recent.length,
      messageCount: recent.filter(l => l.eventType === 'message').length,
      memberJoins: recent.filter(l => l.eventType === 'member_join').length,
      memberLeaves: recent.filter(l => l.eventType === 'member_leave').length,
    };
  }

  // Moderation Log Operations
  async createModerationLog(guildId: string, data: any) {
    const logs = this.store.moderationLogs.get(guildId) || [];
    const caseId = logs.length + 1;
    
    const log = {
      ...data,
      guildId,
      caseId,
      createdAt: new Date(),
    };
    
    logs.push(log);
    this.store.moderationLogs.set(guildId, logs);
    return log;
  }

  async getModerationLogs(guildId: string, limit = 50) {
    const logs = this.store.moderationLogs.get(guildId) || [];
    return logs.slice(-limit).reverse();
  }

  async getModerationLog(guildId: string, caseId: number) {
    const logs = this.store.moderationLogs.get(guildId) || [];
    return logs.find(log => log.caseId === caseId) || null;
  }

  async getActiveWarnings(guildId: string, userId: string) {
    const logs = this.store.moderationLogs.get(guildId) || [];
    return logs.filter(log => 
      log.userId === userId && 
      log.action === 'warn' && 
      (!log.expiresAt || new Date(log.expiresAt) > new Date())
    );
  }

  // Custom Commands Operations
  async createCustomCommand(guildId: string, data: any) {
    const commands = this.store.customCommands.get(guildId) || [];
    const command = {
      ...data,
      guildId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    commands.push(command);
    this.store.customCommands.set(guildId, commands);
    return command;
  }

  async findCustomCommand(guildId: string, trigger: string) {
    const commands = this.store.customCommands.get(guildId) || [];
    return commands.find(cmd => 
      cmd.trigger.toLowerCase() === trigger.toLowerCase() && cmd.enabled
    ) || null;
  }

  async getCustomCommands(guildId: string) {
    return this.store.customCommands.get(guildId) || [];
  }

  async deleteCustomCommand(guildId: string, trigger: string) {
    const commands = this.store.customCommands.get(guildId) || [];
    const filtered = commands.filter(cmd => cmd.trigger !== trigger);
    this.store.customCommands.set(guildId, filtered);
    return commands.length !== filtered.length;
  }

  // Utility Methods
  getStats() {
    return {
      guilds: this.store.guilds.size,
      users: this.store.users.size,
      analyticsEvents: Array.from(this.store.analytics.values()).reduce(
        (sum, logs) => sum + logs.length, 0
      ),
      moderationLogs: Array.from(this.store.moderationLogs.values()).reduce(
        (sum, logs) => sum + logs.length, 0
      ),
      customCommands: Array.from(this.store.customCommands.values()).reduce(
        (sum, cmds) => sum + cmds.length, 0
      ),
    };
  }

  clear() {
    this.store.guilds.clear();
    this.store.users.clear();
    this.store.analytics.clear();
    this.store.moderationLogs.clear();
    this.store.customCommands.clear();
    logger.info('🗑️  In-memory database cleared');
  }

  // Export/Import for persistence (optional)
  export() {
    return {
      guilds: Array.from(this.store.guilds.entries()),
      users: Array.from(this.store.users.entries()),
      analytics: Array.from(this.store.analytics.entries()),
      moderationLogs: Array.from(this.store.moderationLogs.entries()),
      customCommands: Array.from(this.store.customCommands.entries()),
      exportedAt: new Date().toISOString(),
    };
  }

  import(data: any) {
    try {
      this.store.guilds = new Map(data.guilds);
      this.store.users = new Map(data.users);
      this.store.analytics = new Map(data.analytics);
      this.store.moderationLogs = new Map(data.moderationLogs);
      this.store.customCommands = new Map(data.customCommands);
      logger.info('✅ Data imported successfully');
    } catch (error) {
      logger.error('❌ Failed to import data:', error);
    }
  }
}

export const inMemoryDB = new InMemoryDatabase();
