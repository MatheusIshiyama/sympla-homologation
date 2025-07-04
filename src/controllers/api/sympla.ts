import dateFns from 'date-fns';

import { SymplaApiClient } from '@/services/api';
import { logger, parseDate } from '@/utils';

import type { Order, OrderResponse, Ticket, TicketCheckin, TicketResponse } from '@/types';

export class SymplaController {
  private symplaClient: SymplaApiClient;
  private lastUpdateDate: Record<string, Date | null> = {};
  private validatedTickets: Record<string, Ticket[]> = {};

  constructor() {
    this.symplaClient = new SymplaApiClient();
  }

  getLastUpdateDateByEventId(eventId: string): Date | null {
    return this.lastUpdateDate[eventId] || null;
  }

  setLastUpdateDateByEventId(eventId: string, date: Date): void {
    this.lastUpdateDate[eventId] = date;
  }

  getValidatedTicketsByEventId(eventId: string): Ticket[] {
    return this.validatedTickets[eventId] || [];
  }

  setValidatedTicketsByEventId(eventId: string, tickets: Ticket[]): void {
    this.validatedTickets[eventId] = tickets;
  }

  async getOrdersByEventId(eventId: string, page: number = 1): Promise<OrderResponse> {
    try {
      const orders: OrderResponse = await this.symplaClient.getOrders(eventId, page);

      return orders;
    } catch (error) {
      logger('ERROR', 'SYMPLA - GET ORDERS BY EVENT ID', `Error getting orders by eventId: ${eventId}`);
      throw error;
    }
  }

  async getOrderParticipants(eventId: string, orderId: string): Promise<TicketResponse> {
    try {
      const participants: TicketResponse = await this.symplaClient.getOrderParticipants(eventId, orderId);

      return participants;
    } catch (error) {
      logger('ERROR', 'SYMPLA - GET ORDER PARTICIPANTS', `Error getting order participants by eventId: ${eventId} and orderId: ${orderId}`);
      throw error;
    }
  }

  async getTicketsFromOrder(eventId: string, orderId: string): Promise<Ticket[]> {
    const { data: participants } = await this.getOrderParticipants(eventId, orderId);

    return participants.map(
      (participant: Ticket): Ticket => ({
        order_id: participant.order_id,
        order_status: participant.order_status,
        ticket_num_qr_code: participant.ticket_num_qr_code,
        checkin: participant.checkin as TicketCheckin,
      }),
    );
  }

  async fetchAllOrdersFromEvent(eventId: string, prevResults: Order[] = [], page: number = 1): Promise<Order[]> {
    try {
      const response: OrderResponse = await this.symplaClient.getOrders(eventId, page);
      const results: Order[] = [...prevResults, ...response.data];
      const hasNextPage: boolean = response.pagination.has_next;

      return hasNextPage ? this.fetchAllOrdersFromEvent(eventId, results, page + 1) : results;
    } catch (error) {
      logger('ERROR', 'SYMPLA - FETCH ALL ORDERS FROM EVENT', `Error fetching all orders from eventId: ${eventId}`);
      throw error;
    }
  }

  filterOrdersByLastUpdateDate(orders: Order[]): Date {
    const updateDates: Date[] = orders.map((order: Order) => parseDate(order.updated_date));

    return dateFns.max(updateDates);
  }

  async getUpdatedOrdersByEventId(eventId: string): Promise<Order[]> {
    try {
      const orders: Order[] = await this.fetchAllOrdersFromEvent(eventId);

      return orders.filter((order: Order) =>
        dateFns.isAfter(parseDate(order.updated_date), this.lastUpdateDate[eventId] || new Date('1970-01-01T00:00:00.000Z')),
      );
    } catch (error) {
      logger('ERROR', 'SYMPLA - GET UPDATED ORDERS BY EVENT ID', `Error getting updated orders by eventId: ${eventId} - ${error}`);

      return [];
    }
  }
}

export const symplaController: SymplaController = new SymplaController();
