import { FindManyOptions, QueryRunner, Repository } from 'typeorm';

import { AppDataSource } from '@/database/data-source';
import { Participant } from '@/entities';

export class ParticipantRepository {
  private repository: Repository<Participant>;

  constructor() {
    this.repository = AppDataSource.getRepository(Participant);
  }

  async getAllParticipants(findManyOptions: FindManyOptions<Participant>, queryRunner?: QueryRunner): Promise<Participant[]> {
    if (queryRunner) return queryRunner.manager.find(Participant, { order: { createdAt: 'DESC' }, ...findManyOptions });

    return this.repository.find({ order: { createdAt: 'DESC' }, ...findManyOptions });
  }

  async getParticipantById(id: string, queryRunner?: QueryRunner): Promise<Participant | null> {
    if (queryRunner) return queryRunner.manager.findOne(Participant, { where: { id } });

    return this.repository.findOne({ where: { id } });
  }

  async getParticipantByReferenceId(referenceId: string, queryRunner?: QueryRunner): Promise<Participant | null> {
    if (queryRunner) return queryRunner.manager.findOne(Participant, { where: { referenceId } });

    return this.repository.findOne({ where: { referenceId } });
  }

  async createParticipant(participant: Partial<Participant>, queryRunner?: QueryRunner): Promise<Participant> {
    if (queryRunner) return queryRunner.manager.save(Participant, participant);

    return this.repository.save(participant);
  }

  async updateParticipant(participantId: string, data: Partial<Participant>, queryRunner?: QueryRunner): Promise<Participant> {
    if (queryRunner) {
      await queryRunner.manager.update(Participant, participantId, data);

      return this.getParticipantById(participantId, queryRunner) as Promise<Participant>;
    }

    await this.repository.update(participantId, data);

    return this.getParticipantById(participantId) as Promise<Participant>;
  }

  async createOrUpdateParticipantById(id: string, data: Partial<Participant>, queryRunner?: QueryRunner): Promise<Participant> {
    const participantExists: Participant | null = await this.getParticipantById(id, queryRunner);

    if (participantExists) return this.updateParticipant(participantExists.id, data, queryRunner);

    return this.createParticipant(data, queryRunner);
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

export const participantRepository: ParticipantRepository = new ParticipantRepository();
