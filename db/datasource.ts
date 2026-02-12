import { DataSourceOptions, DataSource } from 'typeorm';

export const getDataSourceOptions = (): DataSourceOptions => {
  const dataSourceOptions: Partial<DataSourceOptions> = {
    synchronize: false,
    migrations: [__dirname + '/migrations/*.{ts,js}'],
  };

  switch (process.env.NODE_ENV) {
    case 'development':
      Object.assign(dataSourceOptions, {
        type: 'sqlite',
        database: 'db.sqlite',
        entities: [__dirname + '/../src/**/*.entity.{ts,js}'],
      });
      break;
    case 'test':
      Object.assign(dataSourceOptions, {
        type: 'sqlite',
        database: 'test.sqlite',
        entities: [__dirname + '/../src/**/*.entity.ts'],
        migrationsRun: true,
      });
      break;
    case 'production':
      Object.assign(dataSourceOptions, {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [__dirname + '/../src/**/*.entity.js'],
        migrationsRun: true,
        ssl: {
          rejectUnauthorized: false,
        },
      });
      break;
    default:
      throw new Error('Unknown environment');
  }

  return dataSourceOptions as DataSourceOptions;
};

const dataSource = new DataSource(getDataSourceOptions());

export default dataSource;
