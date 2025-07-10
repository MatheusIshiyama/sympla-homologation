import { Participant } from '@/entities';
import { participantRepository, ParticipantRepository } from '@/repositories';

import type { FindManyOptions, QueryRunner } from 'typeorm';

export class ParticipantService {
  constructor(private readonly participantRepository: ParticipantRepository) {
    this.participantRepository = participantRepository;
  }

  async getAllParticipants(findManyOptions: FindManyOptions<Participant>, queryRunner?: QueryRunner): Promise<Participant[]> {
    return this.participantRepository.getAllParticipants(findManyOptions, queryRunner);
  }

  async getParticipantById(id: string, queryRunner?: QueryRunner): Promise<Participant | null> {
    return this.participantRepository.getParticipantById(id, queryRunner);
  }

  async getParticipantByReferenceId(referenceId: string, queryRunner?: QueryRunner): Promise<Participant | null> {
    return this.participantRepository.getParticipantByReferenceId(referenceId, queryRunner);
  }

  async createParticipant(data: Partial<Participant>, queryRunner?: QueryRunner): Promise<Participant> {
    return this.participantRepository.createParticipant(data, queryRunner);
  }

  async updateParticipant(id: string, data: Partial<Participant>, queryRunner?: QueryRunner): Promise<Participant> {
    return this.participantRepository.updateParticipant(id, data, queryRunner);
  }

  async createOrUpdateParticipantById(id: string, data: Partial<Participant>, queryRunner?: QueryRunner): Promise<Participant> {
    return this.participantRepository.createOrUpdateParticipantById(id, data, queryRunner);
  }

  async createOrUpdateParticipantByReferenceId(
    referenceId: string,
    data: Partial<Participant>,
    queryRunner?: QueryRunner,
  ): Promise<Participant> {
    const participantExists: Participant | null = await this.getParticipantByReferenceId(referenceId, queryRunner);

    if (participantExists) return this.updateParticipant(participantExists.id, data, queryRunner);

    return this.createParticipant(data, queryRunner);
  }
}

export const participantService: ParticipantService = new ParticipantService(participantRepository);
