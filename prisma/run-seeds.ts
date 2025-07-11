import { Permission, PrismaClient } from '@prisma/client';
import { ITXClientDenyList } from '@prisma/client/runtime/client';

import { logger } from '../src/utils/logger';

import { syncPermissions, syncRoles } from './seeds';

const prisma: PrismaClient = new PrismaClient();

async function runSeeds(): Promise<void> {
  try {
    logger('INFO', 'RUN SEEDS', 'Running seeds');

    logger('INFO', 'RUN SEEDS', 'Connecting to database');
    await prisma.$connect();

    logger('INFO', 'RUN SEEDS', 'Syncing permissions');
    await prisma.$transaction(
      async (tx: Omit<PrismaClient, ITXClientDenyList>) => {
        const permissions: Permission[] = await syncPermissions(tx);
        await syncRoles(tx, permissions);
      },
      {
        timeout: 60000,
        maxWait: 10000,
      },
    );

    logger('SUCCESS', 'RUN SEEDS', 'Seeds synced successfully');
  } catch (error) {
    logger('ERROR', 'RUN SEEDS', error);
  } finally {
    await prisma.$disconnect();
  }
}

runSeeds();
