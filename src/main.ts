import compression from 'compression';
import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { json } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import loadEnv from './utils/configs/configuration';
import initSwagger from './utils/configs/innit-swagger';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { LoggerService } from './services/logger.service';
import { getDynamicCorsConfig } from './utils/configs/cors.config';

async function bootstrap() {
  const env = loadEnv();
  const enableLogging = !!env.ENABLE_LOGGING;
  let appOptions = {};

  if (enableLogging) {
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const customLogger = new LoggerService();
    appOptions = { logger: customLogger };
  }

  const app = await NestFactory.create(AppModule, appOptions);

  // Configure CORS using external config
  app.enableCors(getDynamicCorsConfig());

  app.use(compression());
  app.use(cookieParser());

  // Configure body parser for large requests
  app.use(json({ limit: '50mb' }));

  app.setGlobalPrefix('v1/api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
      validationError: {
        target: false,
        value: false,
      },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  initSwagger(app);

  await app.listen(env.PORT);
  const logger = new Logger('Bootstrap');
  logger.log(`Server running port =====> ${env.PORT}`);
}
bootstrap();
