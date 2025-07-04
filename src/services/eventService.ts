import { EventRepository, eventRepository } from '@/repositories';

import type { Event } from '@prisma/client';

export class EventService {
  constructor(private readonly eventRepository: EventRepository) {
    this.eventRepository = eventRepository;
  }

  async getAllEvents(): Promise<Event[]> {
    return this.eventRepository.getAllEvents();
  }

  async getEventById(id: string): Promise<Event | null> {
    return this.eventRepository.getEventById(id);
  }

  async getEventBySymplaId(symplaId: string): Promise<Event | null> {
    return this.eventRepository.getEventBySymplaId(symplaId);
  }
}

export const eventService: EventService = new EventService(eventRepository);
