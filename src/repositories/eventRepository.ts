import { prisma } from '@/database/prisma';

import type { Event } from '@prisma/client';

export class EventRepository {
  async getAllEvents(): Promise<Event[]> {
    return prisma.event.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async getEventById(id: string): Promise<Event | null> {
    return prisma.event.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { created_at: 'desc' },
        },
      },
    });
  }

  async getEventBySymplaId(symplaId: string): Promise<Event | null> {
    return prisma.event.findUnique({
      where: { sympla_id: symplaId },
      include: {
        orders: {
          orderBy: { created_at: 'desc' },
        },
      },
    });
  }
}

export const eventRepository: EventRepository = new EventRepository();
