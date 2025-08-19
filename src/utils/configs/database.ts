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
    logging: env.NODE_ENV !== 'prod', // log query khi dev
  };
};

export const dataSource = new DataSource(dbConfig());
