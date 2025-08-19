import {
  Injectable,
  LoggerService as NestLoggerService,
  LogLevel,
} from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor() {
    const fileRotateTransport = new winston.transports.DailyRotateFile({
      dirname: path.join(process.cwd(), 'logs'),
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    });

    this.logger = winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
      ),
      defaultMeta: { service: 'aicungmuonkhoe_be' },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
        fileRotateTransport,
      ],
    });
  }

  log(message: any, context?: string): void {
    this.logger.info(message, { context });
  }

  error(message: any, stack?: string, context?: string): void {
    this.logger.error(message, { stack, context });
  }

  warn(message: any, context?: string): void {
    this.logger.warn(message, { context });
  }

  debug(message: any, context?: string): void {
    this.logger.debug(message, { context });
  }

  verbose(message: any, context?: string): void {
    this.logger.verbose(message, { context });
  }

  setLogLevels(levels: LogLevel[]) {}

  logSystem(level: string, message: any, meta?: any) {
    if (level === 'error') {
      this.error(message, meta?.stack, meta?.context);
    } else if (level === 'warn') {
      this.warn(message, meta?.context);
    } else if (level === 'debug') {
      this.debug(message, meta?.context);
    } else if (level === 'verbose') {
      this.verbose(message, meta?.context);
    } else {
      this.log(message, meta?.context);
    }
  }
}
