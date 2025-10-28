import { Schema, model, Document } from 'mongoose';

/**
 * User permissions interface
 */
export interface IUserPermissions {
  isDeveloper: boolean;
  isSupport: boolean;
  guilds: {
    guildId: string;
    role: 'owner' | 'admin' | 'moderator' | 'viewer';
  }[];
}

/**
 * Two-factor authentication interface
 */
export interface ITwoFactor {
  enabled: boolean;
  secret?: string;
  backupCodes?: string[];
}

/**
 * User document interface
 */
export interface IUser extends Document {
  userId: string;
  username: string;
  discriminator: string;
  avatar?: string;
  email?: string;
  accessToken?: string;
  refreshToken?: string;
  twoFactor: ITwoFactor;
  permissions: IUserPermissions;
  preferences: {
    language: string;
    timezone: string;
    emailNotifications: boolean;
  };
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User schema
 */
const userSchema = new Schema<IUser>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
    },
    discriminator: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      lowercase: true,
      sparse: true,
      index: true,
    },
    accessToken: {
      type: String,
      select: false, // Don't include in queries by default
    },
    refreshToken: {
      type: String,
      select: false,
    },
    twoFactor: {
      enabled: {
        type: Boolean,
        default: false,
      },
      secret: {
        type: String,
        select: false,
      },
      backupCodes: {
        type: [String],
        select: false,
      },
    },
    permissions: {
      isDeveloper: {
        type: Boolean,
        default: false,
      },
      isSupport: {
        type: Boolean,
        default: false,
      },
      guilds: [
        {
          guildId: {
            type: String,
            required: true,
          },
          role: {
            type: String,
            enum: ['owner', 'admin', 'moderator', 'viewer'],
            required: true,
          },
        },
      ],
    },
    preferences: {
      language: {
        type: String,
        default: 'de',
        enum: ['de', 'en'],
      },
      timezone: {
        type: String,
        default: 'Europe/Berlin',
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
userSchema.index({ lastLogin: -1 });
userSchema.index({ 'permissions.guilds.guildId': 1 });

// Method to check if user has access to a guild
userSchema.methods.hasGuildAccess = function (guildId: string): boolean {
  return (
    this.permissions.isDeveloper ||
    this.permissions.guilds.some((g: any) => g.guildId === guildId)
  );
};

// Method to get user's role in a guild
userSchema.methods.getGuildRole = function (
  guildId: string
): 'owner' | 'admin' | 'moderator' | 'viewer' | null {
  const guild = this.permissions.guilds.find((g: any) => g.guildId === guildId);
  return guild ? guild.role : null;
};

export const User = model<IUser>('User', userSchema);
