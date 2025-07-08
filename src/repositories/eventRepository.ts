import { BaseRepository } from '@/repositories/baseRepository';

import type { Event, Prisma } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';

export class EventRepository extends BaseRepository {
  async getAllEvents(findManyArgs: Prisma.EventFindManyArgs<DefaultArgs>, tx?: Prisma.TransactionClient): Promise<Event[]> {
    return this.getPrismaClient(tx).event.findMany({
      orderBy: { created_at: 'desc' },
      ...findManyArgs,
    });
  }

  async getEventById(id: string, tx?: Prisma.TransactionClient): Promise<Event | null> {
    return this.getPrismaClient(tx).event.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { created_at: 'desc' },
        },
      },
    });
  }

  async getEventByReferenceId(referenceId: string, tx?: Prisma.TransactionClient): Promise<Event | null> {
    return this.getPrismaClient(tx).event.findUnique({
      where: { reference_id: referenceId },
      include: {
        orders: {
          orderBy: { created_at: 'desc' },
        },
      },
    });
  }

  async createEvent(data: Prisma.EventCreateInput, tx?: Prisma.TransactionClient): Promise<Event> {
    return this.getPrismaClient(tx).event.create({
      data,
    });
  }

  async updateEvent(eventId: string, data: Prisma.EventUpdateInput, tx?: Prisma.TransactionClient): Promise<Event> {
    return this.getPrismaClient(tx).event.update({
      where: { id: eventId },
      data,
    });
  }

  async createOrUpdateEvent(id: string, data: Prisma.EventCreateInput, tx?: Prisma.TransactionClient): Promise<Event> {
    const eventExists: Event | null = await this.getEventById(id, tx);

    if (eventExists) return this.updateEvent(eventExists.id, data, tx);

    return this.createEvent(data, tx);
  }

  async createOrUpdateEventByReferenceId(
    referenceId: string,
    data: Prisma.EventCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Event> {
    const eventExists: Event | null = await this.getEventByReferenceId(referenceId, tx);

    if (eventExists) return this.updateEvent(eventExists.id, data, tx);

    return this.createEvent(data, tx);
  }
}

export const eventRepository: EventRepository = new EventRepository();
