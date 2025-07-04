import { prisma } from '@/database/prisma';

import type { Ticket } from '@prisma/client';

export class TicketRepository {
  async getAllTickets(): Promise<Ticket[]> {
    return prisma.ticket.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async getTicketById(id: string): Promise<Ticket | null> {
    return prisma.ticket.findUnique({ where: { id } });
  }

  async getTicketByOrderId(orderId: string): Promise<Ticket[]> {
    return prisma.ticket.findMany({ where: { order_id: orderId } });
  }
}

export const ticketRepository: TicketRepository = new TicketRepository();
