import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { dbConfig } from './utils/configs/database';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { RouterModule } from '@nestjs/core';
import { AdminModule } from './controllers/admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from './controllers/client/client.module';
import loadEnv from './utils/configs/configuration';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [loadEnv],
    }),
    TypeOrmModule.forRoot(dbConfig()),
    AdminModule,
    ClientModule,
    RouterModule.register([
      {
        path: 'admin',
        module: AdminModule,
      },
      {
        path: '',
        module: ClientModule,
      },
    ]),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    // consumer
    //   .apply((req, res, next) => {
    //     const origin = req.headers.origin;
    //     if (origin) {
    //       res.setHeader('Access-Control-Allow-Origin', origin);
    //       res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    //       res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    //       res.setHeader('Access-Control-Allow-Credentials', 'true');
    //     }
    //     next();
    //   })
    //   .forRoutes('*');
  }
}
