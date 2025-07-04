import { TicketRepository, ticketRepository } from '@/repositories';

import type { Ticket } from '@prisma/client';

export class TicketService {
  constructor(private readonly ticketRepository: TicketRepository) {
    this.ticketRepository = ticketRepository;
  }

  async getAllTickets(): Promise<Ticket[]> {
    return this.ticketRepository.getAllTickets();
  }

  async getTicketById(id: string): Promise<Ticket | null> {
    return this.ticketRepository.getTicketById(id);
  }

  async getTicketByOrderId(orderId: string): Promise<Ticket[]> {
    return this.ticketRepository.getTicketByOrderId(orderId);
  }
}

export const ticketService: TicketService = new TicketService(ticketRepository);
