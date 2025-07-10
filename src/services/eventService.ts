import { EventRepository, eventRepository } from '@/repositories';

import type { Event } from '@/entities';
import type { FindManyOptions, QueryRunner } from 'typeorm';

export class EventService {
  constructor(private readonly eventRepository: EventRepository) {
    this.eventRepository = eventRepository;
  }

  async getAllEvents(findManyOptions: FindManyOptions<Event>): Promise<Event[]> {
    return this.eventRepository.getAllEvents(findManyOptions);
  }

  async getEventById(id: string, queryRunner?: QueryRunner): Promise<Event | null> {
    return this.eventRepository.getEventById(id, queryRunner);
  }

  async getEventByReferenceId(referenceId: string, queryRunner?: QueryRunner): Promise<Event | null> {
    return this.eventRepository.getEventByReferenceId(referenceId, queryRunner);
  }

  async createEvent(data: Partial<Event>, queryRunner?: QueryRunner): Promise<Event> {
    return this.eventRepository.createEvent(data, queryRunner);
  }

  async updateEvent(eventId: string, data: Partial<Event>, queryRunner?: QueryRunner): Promise<Event> {
    return this.eventRepository.updateEvent(eventId, data, queryRunner);
  }

  async createOrUpdateEventById(id: string, data: Partial<Event>, queryRunner?: QueryRunner): Promise<Event> {
    const eventExists: Event | null = await this.getEventById(id, queryRunner);

    if (eventExists) return this.updateEvent(eventExists.id, data, queryRunner);

    return this.createEvent(data, queryRunner);
  }
}

export const eventService: EventService = new EventService(eventRepository);
