import { Injectable, Logger } from '@nestjs/common';
import {
  UserActiveLogRepository,
  UserAction,
} from 'src/repositories/user-active-log.repository';

@Injectable()
export class UserActiveLogService {
  private readonly logger = new Logger(UserActiveLogService.name);

  constructor(
    private readonly userActiveLogRepository: UserActiveLogRepository,
  ) {}

  /**
   * Log user login activity
   * @param userId - User ID
   * @param device - Device information (User-Agent, IP, etc.)
   */
  async logLogin(userId: number, device?: string): Promise<void> {
    try {
      await this.userActiveLogRepository.createLog(
        userId,
        UserAction.LOGIN,
        device,
      );
      this.logger.log(`User ${userId} logged in from ${device || 'Unknown'}`);
    } catch (error) {
      this.logger.error(`Failed to log login for user ${userId}`, error);
    }
  }

  /**
   * Log user logout activity
   * @param userId - User ID
   * @param device - Device information
   */
  async logLogout(userId: number, device?: string): Promise<void> {
    try {
      await this.userActiveLogRepository.createLog(
        userId,
        UserAction.LOGOUT,
        device,
      );
      this.logger.log(`User ${userId} logged out from ${device || 'Unknown'}`);
    } catch (error) {
      this.logger.error(`Failed to log logout for user ${userId}`, error);
    }
  }

  /**
   * Log password change activity
   * @param userId - User ID
   * @param device - Device information
   */
  async logChangePassword(userId: number, device?: string): Promise<void> {
    try {
      await this.userActiveLogRepository.createLog(
        userId,
        UserAction.CHANGE_PASSWORD,
        device,
      );
      this.logger.log(
        `User ${userId} changed password from ${device || 'Unknown'}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to log password change for user ${userId}`,
        error,
      );
    }
  }

  /**
   * Log forgot password activity
   * @param userId - User ID
   * @param device - Device information
   */
  async logForgotPassword(userId: number, device?: string): Promise<void> {
    try {
      await this.userActiveLogRepository.createLog(
        userId,
        UserAction.FORGOT_PASSWORD,
        device,
      );
      this.logger.log(
        `User ${userId} requested password reset from ${device || 'Unknown'}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to log forgot password for user ${userId}`,
        error,
      );
    }
  }

  /**
   * Get user activity history
   * @param userId - User ID
   * @param limit - Number of logs to retrieve
   */
  async getUserActivityHistory(userId: number, limit: number = 50) {
    return await this.userActiveLogRepository.getUserLogs(userId, limit);
  }

  /**
   * Get recent login history for a user
   * @param userId - User ID
   * @param limit - Number of logs to retrieve
   */
  async getRecentLogins(userId: number, limit: number = 10) {
    return await this.userActiveLogRepository.getRecentLogins(userId, limit);
  }

  /**
   * Clean up old logs (scheduled task)
   * @param days - Number of days to keep logs (default: 90)
   */
  async cleanupOldLogs(days: number = 90): Promise<void> {
    try {
      await this.userActiveLogRepository.deleteOldLogs(days);
      this.logger.log(`Cleaned up logs older than ${days} days`);
    } catch (error) {
      this.logger.error('Failed to cleanup old logs', error);
    }
  }
}
