import { FindManyOptions, QueryRunner, Repository, UpdateResult } from 'typeorm';

import { AppDataSource } from '@/database/data-source';
import { Utm } from '@/entities';

export class UtmRepository {
  private repository: Repository<Utm>;

  constructor() {
    this.repository = AppDataSource.getRepository(Utm);
  }

  async getAllUtms(findManyOptions: FindManyOptions<Utm>, queryRunner?: QueryRunner): Promise<Utm[]> {
    if (queryRunner) return queryRunner.manager.find(Utm, { order: { createdAt: 'DESC' }, ...findManyOptions });

    return this.repository.find({ order: { createdAt: 'DESC' }, ...findManyOptions });
  }

  async getUtmById(id: string, queryRunner?: QueryRunner): Promise<Utm | null> {
    if (queryRunner) return queryRunner.manager.findOne(Utm, { where: { id } });

    return this.repository.findOne({ where: { id } });
  }

  async createUtm(utm: Partial<Utm>, queryRunner?: QueryRunner): Promise<Utm> {
    if (queryRunner) return queryRunner.manager.save(Utm, utm);

    return this.repository.save(utm);
  }

  async updateUtm(utmId: string, data: Partial<Utm>, queryRunner?: QueryRunner): Promise<Utm> {
    if (queryRunner) {
      await queryRunner.manager.update(Utm, utmId, data);

      return this.getUtmById(utmId, queryRunner) as Promise<Utm>;
    }

    await this.repository.update(utmId, data);

    return this.getUtmById(utmId) as Promise<Utm>;
  }

  async createOrUpdateUtmById(id: string, data: Partial<Utm>, queryRunner?: QueryRunner): Promise<Utm | UpdateResult> {
    const utmExists: Utm | null = await this.getUtmById(id, queryRunner);

    if (utmExists) return this.updateUtm(utmExists.id, data, queryRunner);

    return this.createUtm(data, queryRunner);
  }
}

export const utmRepository: UtmRepository = new UtmRepository();
