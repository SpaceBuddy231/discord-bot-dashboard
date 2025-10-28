import { Schema, model, Document } from 'mongoose';

/**
 * Analytics data types
 */
export type AnalyticsType =
  | 'message'
  | 'voice'
  | 'member_join'
  | 'member_leave'
  | 'command'
  | 'reaction'
  | 'channel_create'
  | 'channel_delete'
  | 'role_update';

/**
 * Analytics data interface
 */
export interface IAnalyticsData {
  [key: string]: any;
  messageCount?: number;
  characterCount?: number;
  voiceDuration?: number;
  commandName?: string;
  reactionEmoji?: string;
  channelName?: string;
  roleName?: string;
}

/**
 * Analytics document interface
 */
export interface IAnalytics extends Document {
  guildId: string;
  type: AnalyticsType;
  timestamp: Date;
  data: IAnalyticsData;
  userId?: string;
  channelId?: string;
  metadata?: {
    platform?: string;
    version?: string;
  };
  createdAt: Date;
}

/**
 * Analytics schema
 */
const analyticsSchema = new Schema<IAnalytics>(
  {
    guildId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'message',
        'voice',
        'member_join',
        'member_leave',
        'command',
        'reaction',
        'channel_create',
        'channel_delete',
        'role_update',
      ],
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    userId: {
      type: String,
      index: true,
    },
    channelId: {
      type: String,
      index: true,
    },
    metadata: {
      platform: String,
      version: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound indexes for complex queries
analyticsSchema.index({ guildId: 1, type: 1, timestamp: -1 });
analyticsSchema.index({ guildId: 1, userId: 1, timestamp: -1 });
analyticsSchema.index({ guildId: 1, channelId: 1, timestamp: -1 });

// TTL index to automatically delete old analytics data after 90 days
analyticsSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

// Static method to get analytics summary
analyticsSchema.statics.getSummary = async function (
  guildId: string,
  startDate: Date,
  endDate: Date
) {
  return this.aggregate([
    {
      $match: {
        guildId,
        timestamp: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
      },
    },
  ]);
};

export const Analytics = model<IAnalytics>('Analytics', analyticsSchema);
