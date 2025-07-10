import { FindManyOptions, QueryRunner, Repository } from 'typeorm';

import { AppDataSource } from '@/database/data-source';
import { Event } from '@/entities';

export class EventRepository {
  private repository: Repository<Event>;

  constructor() {
    this.repository = AppDataSource.getRepository(Event);
  }
  async getAllEvents(findManyOptions: FindManyOptions<Event>, queryRunner?: QueryRunner): Promise<Event[]> {
    if (queryRunner) return queryRunner.manager.find(Event, { order: { createdAt: 'DESC' }, ...findManyOptions });

    return this.repository.find({ order: { createdAt: 'DESC' }, ...findManyOptions });
  }

  async getEventById(id: string, queryRunner?: QueryRunner): Promise<Event | null> {
    if (queryRunner) return queryRunner.manager.findOne(Event, { where: { id } });

    return this.repository.findOne({ where: { id } });
  }

  async getEventByReferenceId(referenceId: string, queryRunner?: QueryRunner): Promise<Event | null> {
    if (queryRunner) return queryRunner.manager.findOne(Event, { where: { referenceId } });

    return this.repository.findOne({ where: { referenceId } });
  }

  async createEvent(data: Partial<Event>, queryRunner?: QueryRunner): Promise<Event> {
    if (queryRunner) return queryRunner.manager.save(Event, data);

    return this.repository.save(data);
  }

  async updateEvent(eventId: string, data: Partial<Event>, queryRunner?: QueryRunner): Promise<Event> {
    if (queryRunner) {
      await queryRunner.manager.update(Event, eventId, data);

      return this.getEventById(eventId, queryRunner) as Promise<Event>;
    }

    await this.repository.update(eventId, data);

    return this.getEventById(eventId) as Promise<Event>;
  }

  async createOrUpdateEventById(id: string, data: Partial<Event>, queryRunner?: QueryRunner): Promise<Event> {
    const eventExists: Event | null = await this.getEventById(id, queryRunner);

    if (eventExists) return this.updateEvent(eventExists.id, data, queryRunner);

    return this.createEvent(data, queryRunner);
  }

  async createOrUpdateEventByReferenceId(referenceId: string, data: Partial<Event>, queryRunner?: QueryRunner): Promise<Event> {
    const eventExists: Event | null = await this.getEventByReferenceId(referenceId, queryRunner);

    if (eventExists) return this.updateEvent(eventExists.id, data, queryRunner);

    return this.createEvent(data, queryRunner);
  }
}

export const eventRepository: EventRepository = new EventRepository();
