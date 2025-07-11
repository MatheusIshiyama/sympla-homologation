import { BaseRepository } from '@/repositories';

import type { Participant, Prisma } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';

export class ParticipantService extends BaseRepository {
  async getAllParticipants(
    findManyArgs: Prisma.ParticipantFindManyArgs<DefaultArgs>,
    tx?: Prisma.TransactionClient,
  ): Promise<Participant[]> {
    return this.getPrismaClient(tx).participant.findMany({
      orderBy: { created_at: 'desc' },
      ...findManyArgs,
    });
  }

  async getParticipantById(id: string, tx?: Prisma.TransactionClient): Promise<Participant | null> {
    return this.getPrismaClient(tx).participant.findUnique({ where: { id } });
  }

  async getParticipantByReferenceId(referenceId: string, tx?: Prisma.TransactionClient): Promise<Participant | null> {
    return this.getPrismaClient(tx).participant.findUnique({ where: { reference_id: referenceId } });
  }

  async createParticipant(data: Prisma.ParticipantCreateInput, tx?: Prisma.TransactionClient): Promise<Participant> {
    return this.getPrismaClient(tx).participant.create({ data });
  }

  async updateParticipant(id: string, data: Prisma.ParticipantUpdateInput, tx?: Prisma.TransactionClient): Promise<Participant> {
    return this.getPrismaClient(tx).participant.update({ where: { id }, data });
  }

  async createOrUpdateParticipant(id: string, data: Prisma.ParticipantCreateInput, tx?: Prisma.TransactionClient): Promise<Participant> {
    const participantExists: Participant | null = await this.getParticipantById(id, tx);

    if (participantExists) return this.updateParticipant(participantExists.id, data, tx);

    return this.createParticipant(data, tx);
  }

  async createOrUpdateParticipantByReferenceId(
    referenceId: string,
    data: Prisma.ParticipantCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Participant> {
    const participantExists: Participant | null = await this.getParticipantByReferenceId(referenceId, tx);

    if (participantExists) return this.updateParticipant(participantExists.id, data, tx);

    return this.createParticipant(data, tx);
  }
}

export const participantService: ParticipantService = new ParticipantService();
