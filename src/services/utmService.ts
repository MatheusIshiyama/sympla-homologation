import { UtmRepository, utmRepository } from '@/repositories';

import type { Utm } from '@/entities';
import type { FindManyOptions, QueryRunner } from 'typeorm';

export class UtmService {
  constructor(private readonly utmRepository: UtmRepository) {
    this.utmRepository = utmRepository;
  }

  async getAllUtms(findManyOptions: FindManyOptions<Utm>, queryRunner?: QueryRunner): Promise<Utm[]> {
    return this.utmRepository.getAllUtms(findManyOptions, queryRunner);
  }

  async getUtmById(id: string, queryRunner?: QueryRunner): Promise<Utm | null> {
    return this.utmRepository.getUtmById(id, queryRunner);
  }

  async createUtm(data: Partial<Utm>, queryRunner?: QueryRunner): Promise<Utm> {
    return this.utmRepository.createUtm(data, queryRunner);
  }

  async updateUtm(utmId: string, data: Partial<Utm>, queryRunner?: QueryRunner): Promise<Utm> {
    return this.utmRepository.updateUtm(utmId, data, queryRunner);
  }

  async createOrUpdateUtmById(id: string, data: Partial<Utm>, queryRunner?: QueryRunner): Promise<Utm> {
    const utmExists: Utm | null = await this.getUtmById(id, queryRunner);

    if (utmExists) return this.updateUtm(utmExists.id, data, queryRunner);

    return this.createUtm(data, queryRunner);
  }
}

export const utmService: UtmService = new UtmService(utmRepository);
