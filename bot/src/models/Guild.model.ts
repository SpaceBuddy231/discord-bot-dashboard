import { Schema, model, Document } from 'mongoose';

/**
 * Guild configuration settings interface
 */
interface IGuildSettings {
  prefix: string;
  language: string;
  timezone: string;
  features: {
    autoMod: boolean;
    analytics: boolean;
    customCommands: boolean;
    welcomeMessages: boolean;
    auditLog: boolean;
  };
  moderation: {
    mutedRole?: string;
    modLogChannel?: string;
    autoModSettings: {
      enabled: boolean;
      spamProtection: boolean;
      profanityFilter: boolean;
      linkFilter: boolean;
      raidProtection: boolean;
    };
  };
  logging: {
    messageDelete: boolean;
    messageEdit: boolean;
    memberJoin: boolean;
    memberLeave: boolean;
    roleChanges: boolean;
    channelChanges: boolean;
    logChannel?: string;
  };
}

/**
 * Premium subscription interface
 */
interface IPremium {
  active: boolean;
  tier: 'free' | 'basic' | 'premium' | 'enterprise';
  expiresAt?: Date;
  features: string[];
}

/**
 * Guild document interface
 */
export interface IGuild extends Document {
  guildId: string;
  name: string;
  icon?: string;
  ownerId: string;
  settings: IGuildSettings;
  premium: IPremium;
  active: boolean;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Guild schema
 */
const guildSchema = new Schema<IGuild>(
  {
    guildId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: null,
    },
    ownerId: {
      type: String,
      required: true,
    },
    settings: {
      prefix: {
        type: String,
        default: '!',
      },
      language: {
        type: String,
        default: 'de',
        enum: ['de', 'en'],
      },
      timezone: {
        type: String,
        default: 'Europe/Berlin',
      },
      features: {
        autoMod: {
          type: Boolean,
          default: false,
        },
        analytics: {
          type: Boolean,
          default: true,
        },
        customCommands: {
          type: Boolean,
          default: false,
        },
        welcomeMessages: {
          type: Boolean,
          default: false,
        },
        auditLog: {
          type: Boolean,
          default: true,
        },
      },
      moderation: {
        mutedRole: String,
        modLogChannel: String,
        autoModSettings: {
          enabled: {
            type: Boolean,
            default: false,
          },
          spamProtection: {
            type: Boolean,
            default: false,
          },
          profanityFilter: {
            type: Boolean,
            default: false,
          },
          linkFilter: {
            type: Boolean,
            default: false,
          },
          raidProtection: {
            type: Boolean,
            default: false,
          },
        },
      },
      logging: {
        messageDelete: {
          type: Boolean,
          default: false,
        },
        messageEdit: {
          type: Boolean,
          default: false,
        },
        memberJoin: {
          type: Boolean,
          default: false,
        },
        memberLeave: {
          type: Boolean,
          default: false,
        },
        roleChanges: {
          type: Boolean,
          default: false,
        },
        channelChanges: {
          type: Boolean,
          default: false,
        },
        logChannel: String,
      },
    },
    premium: {
      active: {
        type: Boolean,
        default: false,
      },
      tier: {
        type: String,
        enum: ['free', 'basic', 'premium', 'enterprise'],
        default: 'free',
      },
      expiresAt: Date,
      features: {
        type: [String],
        default: [],
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
guildSchema.index({ active: 1, 'premium.active': 1 });
guildSchema.index({ createdAt: -1 });

export const Guild = model<IGuild>('Guild', guildSchema);
