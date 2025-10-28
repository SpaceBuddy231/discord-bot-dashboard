import { Schema, model, Document } from 'mongoose';

/**
 * Trigger type for custom commands
 */
export type TriggerType = 'text' | 'regex' | 'slash';

/**
 * Response type for custom commands
 */
export type ResponseType = 'text' | 'embed' | 'reaction' | 'dm' | 'role';

/**
 * Command response interface
 */
export interface ICommandResponse {
  type: ResponseType;
  content?: string;
  embed?: {
    title?: string;
    description?: string;
    color?: string;
    fields?: Array<{ name: string; value: string; inline?: boolean }>;
    footer?: string;
    thumbnail?: string;
    image?: string;
  };
  reactions?: string[];
  roleId?: string;
}

/**
 * Command conditions interface
 */
export interface ICommandConditions {
  requiredRoles?: string[];
  requiredPermissions?: string[];
  allowedChannels?: string[];
  deniedChannels?: string[];
  requiredLevel?: number;
}

/**
 * Custom command document interface
 */
export interface ICustomCommand extends Document {
  guildId: string;
  name: string;
  description: string;
  trigger: string;
  triggerType: TriggerType;
  response: ICommandResponse;
  conditions?: ICommandConditions;
  variables: {
    [key: string]: string;
  };
  cooldown: number; // in seconds
  enabled: boolean;
  uses: number;
  lastUsed?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Custom command schema
 */
const customCommandSchema = new Schema<ICustomCommand>(
  {
    guildId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 200,
      default: '',
    },
    trigger: {
      type: String,
      required: true,
    },
    triggerType: {
      type: String,
      required: true,
      enum: ['text', 'regex', 'slash'],
      default: 'text',
    },
    response: {
      type: {
        type: String,
        required: true,
        enum: ['text', 'embed', 'reaction', 'dm', 'role'],
      },
      content: String,
      embed: {
        title: String,
        description: String,
        color: String,
        fields: [
          {
            name: String,
            value: String,
            inline: Boolean,
          },
        ],
        footer: String,
        thumbnail: String,
        image: String,
      },
      reactions: [String],
      roleId: String,
    },
    conditions: {
      requiredRoles: [String],
      requiredPermissions: [String],
      allowedChannels: [String],
      deniedChannels: [String],
      requiredLevel: Number,
    },
    variables: {
      type: Map,
      of: String,
      default: {},
    },
    cooldown: {
      type: Number,
      default: 0,
      min: 0,
      max: 86400, // 24 hours
    },
    enabled: {
      type: Boolean,
      default: true,
      index: true,
    },
    uses: {
      type: Number,
      default: 0,
    },
    lastUsed: {
      type: Date,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
customCommandSchema.index({ guildId: 1, name: 1 }, { unique: true });
customCommandSchema.index({ guildId: 1, enabled: 1 });
customCommandSchema.index({ uses: -1 });

// Method to increment usage counter
customCommandSchema.methods.incrementUses = function () {
  this.uses += 1;
  this.lastUsed = new Date();
  return this.save();
};

// Static method to get most used commands
customCommandSchema.statics.getMostUsed = function (guildId: string, limit: number = 10) {
  return this.find({ guildId, enabled: true })
    .sort({ uses: -1 })
    .limit(limit)
    .select('name uses lastUsed');
};

// Static method to search commands
customCommandSchema.statics.searchCommands = function (guildId: string, query: string) {
  return this.find({
    guildId,
    enabled: true,
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
    ],
  });
};

export const CustomCommand = model<ICustomCommand>('CustomCommand', customCommandSchema);
