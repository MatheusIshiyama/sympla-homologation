import { prisma } from '@/database/prisma';

import type { Prisma } from '@prisma/client';

export abstract class BaseRepository {
  protected getPrismaClient(tx?: Prisma.TransactionClient): Prisma.TransactionClient {
    return tx || prisma;
  }
}
