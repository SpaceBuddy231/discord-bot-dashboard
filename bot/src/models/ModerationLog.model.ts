import { Schema, model, Document } from 'mongoose';

/**
 * Moderation action types
 */
export type ModerationAction = 'warn' | 'kick' | 'ban' | 'unban' | 'mute' | 'unmute' | 'timeout';

/**
 * Appeal status types
 */
export type AppealStatus = 'none' | 'pending' | 'approved' | 'rejected';

/**
 * Moderation log document interface
 */
export interface IModerationLog extends Document {
  guildId: string;
  caseId: number;
  userId: string;
  username: string;
  moderatorId: string;
  moderatorName: string;
  action: ModerationAction;
  reason: string;
  duration?: number; // in seconds
  expiresAt?: Date;
  active: boolean;
  appealStatus: AppealStatus;
  appealMessage?: string;
  appealReviewedBy?: string;
  appealReviewedAt?: Date;
  metadata?: {
    deletedMessages?: number;
    previousWarnings?: number;
    autoMod?: boolean;
  };
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Moderation log schema
 */
const moderationLogSchema = new Schema<IModerationLog>(
  {
    guildId: {
      type: String,
      required: true,
      index: true,
    },
    caseId: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
    },
    moderatorId: {
      type: String,
      required: true,
      index: true,
    },
    moderatorName: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: ['warn', 'kick', 'ban', 'unban', 'mute', 'unmute', 'timeout'],
      index: true,
    },
    reason: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    duration: {
      type: Number,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    appealStatus: {
      type: String,
      enum: ['none', 'pending', 'approved', 'rejected'],
      default: 'none',
      index: true,
    },
    appealMessage: {
      type: String,
      maxlength: 2000,
    },
    appealReviewedBy: {
      type: String,
    },
    appealReviewedAt: {
      type: Date,
    },
    metadata: {
      deletedMessages: Number,
      previousWarnings: Number,
      autoMod: {
        type: Boolean,
        default: false,
      },
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
moderationLogSchema.index({ guildId: 1, caseId: 1 }, { unique: true });
moderationLogSchema.index({ guildId: 1, userId: 1, timestamp: -1 });
moderationLogSchema.index({ guildId: 1, active: 1, expiresAt: 1 });

// Pre-save hook to auto-increment caseId
moderationLogSchema.pre('save', async function (next) {
  if (this.isNew) {
    const lastCase = await (this.constructor as any)
      .findOne({ guildId: this.guildId })
      .sort({ caseId: -1 })
      .select('caseId');
    
    this.caseId = lastCase ? lastCase.caseId + 1 : 1;
  }
  next();
});

// Static method to get active warnings for a user
moderationLogSchema.statics.getActiveWarnings = function (guildId: string, userId: string) {
  return this.find({
    guildId,
    userId,
    action: 'warn',
    active: true,
  }).sort({ timestamp: -1 });
};

// Static method to get moderation history
moderationLogSchema.statics.getModerationHistory = function (
  guildId: string,
  userId: string,
  limit: number = 10
) {
  return this.find({
    guildId,
    userId,
  })
    .sort({ timestamp: -1 })
    .limit(limit);
};

export const ModerationLog = model<IModerationLog>('ModerationLog', moderationLogSchema);
