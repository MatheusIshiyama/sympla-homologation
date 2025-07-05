import { BaseRepository } from '@/repositories/baseRepository';

import type { Participant, Prisma } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';

export class ParticipantRepository extends BaseRepository {
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

  async getParticipantBySymplaId(symplaId: string, tx?: Prisma.TransactionClient): Promise<Participant | null> {
    return this.getPrismaClient(tx).participant.findUnique({ where: { sympla_participant_id: symplaId } });
  }

  async createParticipant(participant: Prisma.ParticipantCreateInput, tx?: Prisma.TransactionClient): Promise<Participant> {
    return this.getPrismaClient(tx).participant.create({
      data: participant,
    });
  }

  async updateParticipant(participantId: string, data: Prisma.ParticipantUpdateInput, tx?: Prisma.TransactionClient): Promise<Participant> {
    return this.getPrismaClient(tx).participant.update({
      where: { id: participantId },
      data,
    });
  }

  async createOrUpdateParticipant(id: string, data: Prisma.ParticipantCreateInput, tx?: Prisma.TransactionClient): Promise<Participant> {
    const participantExists: Participant | null = await this.getParticipantById(id, tx);

    if (participantExists) return this.updateParticipant(participantExists.id, data, tx);

    return this.createParticipant(data, tx);
  }

  async createOrUpdateParticipantBySymplaId(
    symplaId: string,
    data: Prisma.ParticipantCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Participant> {
    const participantExists: Participant | null = await this.getParticipantBySymplaId(symplaId, tx);

    if (participantExists) return this.updateParticipant(participantExists.id, data, tx);

    return this.createParticipant(data, tx);
  }
}

export const participantRepository: ParticipantRepository = new ParticipantRepository();
