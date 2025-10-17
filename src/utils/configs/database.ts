import { DataSource, DataSourceOptions } from 'typeorm';
import loadEnv from './configuration';
import * as path from 'path';

export const dbConfig = (): DataSourceOptions => {
  const env = loadEnv();

  return {
    type: 'mysql',
    host: env.HOST,
    port: Number(env.PORT_DB),
    username: env.USERNAME,
    password: env.PASSWORD,
    database: env.NAME,
    entities: [path.join(__dirname, '../../entities/**/*.entity.{js,ts}')],
    synchronize: true, // nhớ để true khi dev, false khi prod
    logging: false, // log query khi dev
    // Performance optimization
    extra: {
      connectionLimit: 10,
      acquireTimeout: 60000,
      timeout: 60000,
      charset: 'utf8mb4',
    },
    poolSize: 10,
    connectTimeout: 60000,
  };
};

export const dataSource = new DataSource(dbConfig());
