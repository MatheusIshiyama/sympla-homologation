import { DataSource } from 'typeorm';

import { logger } from '@/utils';

export const AppDataSource: DataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../entities/*.{js,ts}'],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  ...(process.env.NODE_ENV !== 'development' && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
});

export const initializeDataSource: () => Promise<void> = async (): Promise<void> => {
  try {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();

    logger('SUCCESS', 'DATABASE', 'Data source initialized');
  } catch (error) {
    logger('ERROR', 'DATABASE', `Error initializing data source: ${error}`);
    throw error;
  }
};
