import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../../**/*-entity.{js,ts}'],
  migrations: ['src/infrastructure/database/migrations/*.{js,ts}'],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
