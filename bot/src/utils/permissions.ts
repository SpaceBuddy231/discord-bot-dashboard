import { PermissionFlagsBits, GuildMember, User, PermissionResolvable } from 'discord.js';
import logger from './logger';

/**
 * Permission levels for the bot
 */
export enum PermissionLevel {
  USER = 0,
  MODERATOR = 1,
  ADMIN = 2,
  OWNER = 3,
}

/**
 * Check if a member has a specific permission
 * @param member - Guild member to check
 * @param permission - Permission to check
 * @returns Whether the member has the permission
 */
export function hasPermission(
  member: GuildMember,
  permission: PermissionResolvable
): boolean {
  try {
    return member.permissions.has(permission);
  } catch (error) {
    logger.error('Error checking permission:', error);
    return false;
  }
}

/**
 * Check if a member has admin permissions
 * @param member - Guild member to check
 * @returns Whether the member is an admin
 */
export function isAdmin(member: GuildMember): boolean {
  return hasPermission(member, PermissionFlagsBits.Administrator);
}

/**
 * Check if a member has moderator permissions
 * @param member - Guild member to check
 * @returns Whether the member is a moderator
 */
export function isModerator(member: GuildMember): boolean {
  return (
    hasPermission(member, PermissionFlagsBits.ModerateMembers) ||
    hasPermission(member, PermissionFlagsBits.KickMembers) ||
    hasPermission(member, PermissionFlagsBits.BanMembers) ||
    isAdmin(member)
  );
}

/**
 * Check if a user is the guild owner
 * @param member - Guild member to check
 * @returns Whether the member is the owner
 */
export function isOwner(member: GuildMember): boolean {
  return member.guild.ownerId === member.id;
}

/**
 * Get the permission level of a member
 * @param member - Guild member to check
 * @returns The permission level
 */
export function getPermissionLevel(member: GuildMember): PermissionLevel {
  if (isOwner(member)) {
    return PermissionLevel.OWNER;
  }
  if (isAdmin(member)) {
    return PermissionLevel.ADMIN;
  }
  if (isModerator(member)) {
    return PermissionLevel.MODERATOR;
  }
  return PermissionLevel.USER;
}

/**
 * Format permission level to string
 * @param level - Permission level
 * @returns Formatted string
 */
export function formatPermissionLevel(level: PermissionLevel): string {
  const levels = {
    [PermissionLevel.USER]: 'User',
    [PermissionLevel.MODERATOR]: 'Moderator',
    [PermissionLevel.ADMIN]: 'Administrator',
    [PermissionLevel.OWNER]: 'Owner',
  };
  return levels[level] || 'Unknown';
}

/**
 * Check if member has required permission level
 * @param member - Guild member to check
 * @param requiredLevel - Required permission level
 * @returns Whether the member has the required level
 */
export function hasRequiredLevel(
  member: GuildMember,
  requiredLevel: PermissionLevel
): boolean {
  const memberLevel = getPermissionLevel(member);
  return memberLevel >= requiredLevel;
}
