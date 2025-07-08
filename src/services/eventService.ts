import { EventRepository, eventRepository } from '@/repositories';

import type { Event, Prisma } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';

export class EventService {
  constructor(private readonly eventRepository: EventRepository) {
    this.eventRepository = eventRepository;
  }

  async getAllEvents(findManyArgs: Prisma.EventFindManyArgs<DefaultArgs>): Promise<Event[]> {
    return this.eventRepository.getAllEvents(findManyArgs);
  }

  async getEventById(id: string): Promise<Event | null> {
    return this.eventRepository.getEventById(id);
  }

  async getEventByReferenceId(referenceId: string): Promise<Event | null> {
    return this.eventRepository.getEventByReferenceId(referenceId);
  }

  async createEvent(data: Prisma.EventCreateInput, tx?: Prisma.TransactionClient): Promise<Event> {
    return this.eventRepository.createEvent(data, tx);
  }

  async updateEvent(eventId: string, data: Prisma.EventUpdateInput, tx?: Prisma.TransactionClient): Promise<Event> {
    return this.eventRepository.updateEvent(eventId, data, tx);
  }

  async createOrUpdateEvent(id: string, data: Prisma.EventCreateInput, tx?: Prisma.TransactionClient): Promise<Event> {
    const eventExists: Event | null = await this.getEventById(id);

    if (eventExists) return this.updateEvent(eventExists.id, data, tx);

    return this.createEvent(data, tx);
  }
}

export const eventService: EventService = new EventService(eventRepository);
