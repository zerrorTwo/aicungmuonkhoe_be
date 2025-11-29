import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersActiveLog } from 'src/entities/user-active-log.entity';
import { Repository } from 'typeorm';

export enum UserAction {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}

@Injectable()
export class UserActiveLogRepository {
  private repo: Repository<UsersActiveLog>;

  constructor(
    @InjectRepository(UsersActiveLog) repo: Repository<UsersActiveLog>,
  ) {
    this.repo = repo;
  }

  /**
   * Create a new activity log entry
   * @param userId - User ID
   * @param action - Action performed (LOGIN, LOGOUT, CHANGE_PASSWORD, FORGOT_PASSWORD)
   * @param device - Device information (optional)
   */
  async createLog(
    userId: number,
    action: UserAction,
    device?: string,
  ): Promise<UsersActiveLog> {
    const log = this.repo.create({
      USER_ID: userId,
      ACTION: action,
      DEVICE: device || 'Unknown',
    });
    return await this.repo.save(log);
  }

  /**
   * Get all activity logs for a specific user
   * @param userId - User ID
   * @param limit - Number of logs to retrieve (default: 50)
   */
  async getUserLogs(
    userId: number,
    limit: number = 50,
  ): Promise<UsersActiveLog[]> {
    return await this.repo.find({
      where: { USER_ID: userId },
      order: { CREATED_DATE: 'DESC' },
      take: limit,
    });
  }

  /**
   * Get logs by action type
   * @param userId - User ID
   * @param action - Action type
   * @param limit - Number of logs to retrieve (default: 20)
   */
  async getLogsByAction(
    userId: number,
    action: UserAction,
    limit: number = 20,
  ): Promise<UsersActiveLog[]> {
    return await this.repo.find({
      where: { USER_ID: userId, ACTION: action },
      order: { CREATED_DATE: 'DESC' },
      take: limit,
    });
  }

  /**
   * Get recent login logs for a user
   * @param userId - User ID
   * @param limit - Number of logs to retrieve (default: 10)
   */
  async getRecentLogins(
    userId: number,
    limit: number = 10,
  ): Promise<UsersActiveLog[]> {
    return await this.getLogsByAction(userId, UserAction.LOGIN, limit);
  }

  /**
   * Delete old logs (older than specified days)
   * @param days - Number of days to keep logs
   */
  async deleteOldLogs(days: number = 90): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    await this.repo
      .createQueryBuilder()
      .delete()
      .where('CREATED_DATE < :cutoffDate', { cutoffDate })
      .execute();
  }
}
