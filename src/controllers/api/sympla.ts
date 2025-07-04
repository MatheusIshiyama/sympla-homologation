import dateFns from 'date-fns';

import { SymplaApiClient } from '@/services/api';
import { logger, parseDate } from '@/utils';

import type { SymplaOrder, SymplaOrderResponse, SymplaTicket, SymplaTicketCheckin, SymplaTicketResponse } from '@/types';

export class SymplaController {
  private symplaClient: SymplaApiClient;
  private lastUpdateDate: Record<string, Date | null> = {};
  private validatedTickets: Record<string, SymplaTicket[]> = {};

  constructor() {
    this.symplaClient = new SymplaApiClient();
  }

  getLastUpdateDateByEventId(eventId: string): Date | null {
    return this.lastUpdateDate[eventId] || null;
  }

  setLastUpdateDateByEventId(eventId: string, date: Date): void {
    this.lastUpdateDate[eventId] = date;
  }

  getValidatedTicketsByEventId(eventId: string): SymplaTicket[] {
    return this.validatedTickets[eventId] || [];
  }

  setValidatedTicketsByEventId(eventId: string, tickets: SymplaTicket[]): void {
    this.validatedTickets[eventId] = tickets;
  }

  async getOrdersByEventId(eventId: string, page: number = 1): Promise<SymplaOrderResponse> {
    try {
      const orders: SymplaOrderResponse = await this.symplaClient.getOrders(eventId, page);

      return orders;
    } catch (error) {
      logger('ERROR', 'SYMPLA - GET ORDERS BY EVENT ID', `Error getting orders by eventId: ${eventId}`);
      throw error;
    }
  }

  async getOrderParticipants(eventId: string, orderId: string): Promise<SymplaTicketResponse> {
    try {
      const participants: SymplaTicketResponse = await this.symplaClient.getOrderParticipants(eventId, orderId);

      return participants;
    } catch (error) {
      logger('ERROR', 'SYMPLA - GET ORDER PARTICIPANTS', `Error getting order participants by eventId: ${eventId} and orderId: ${orderId}`);
      throw error;
    }
  }

  async getTicketsFromOrder(eventId: string, orderId: string): Promise<SymplaTicket[]> {
    const { data: participants } = await this.getOrderParticipants(eventId, orderId);

    return participants.map(
      (participant: SymplaTicket): SymplaTicket => ({
        order_id: participant.order_id,
        order_status: participant.order_status,
        ticket_num_qr_code: participant.ticket_num_qr_code,
        checkin: participant.checkin as SymplaTicketCheckin,
      }),
    );
  }

  async fetchAllOrdersFromEvent(eventId: string, prevResults: SymplaOrder[] = [], page: number = 1): Promise<SymplaOrder[]> {
    try {
      const response: SymplaOrderResponse = await this.symplaClient.getOrders(eventId, page);
      const results: SymplaOrder[] = [...prevResults, ...response.data];
      const hasNextPage: boolean = response.pagination.has_next;

      return hasNextPage ? this.fetchAllOrdersFromEvent(eventId, results, page + 1) : results;
    } catch (error) {
      logger('ERROR', 'SYMPLA - FETCH ALL ORDERS FROM EVENT', `Error fetching all orders from eventId: ${eventId}`);
      throw error;
    }
  }

  filterOrdersByLastUpdateDate(orders: SymplaOrder[]): Date {
    const updateDates: Date[] = orders.map((order: SymplaOrder) => parseDate(order.updated_date));

    return dateFns.max(updateDates);
  }

  async getUpdatedOrdersByEventId(eventId: string): Promise<SymplaOrder[]> {
    try {
      const orders: SymplaOrder[] = await this.fetchAllOrdersFromEvent(eventId);

      return orders.filter((order: SymplaOrder) =>
        dateFns.isAfter(parseDate(order.updated_date), this.lastUpdateDate[eventId] || new Date('1970-01-01T00:00:00.000Z')),
      );
    } catch (error) {
      logger('ERROR', 'SYMPLA - GET UPDATED ORDERS BY EVENT ID', `Error getting updated orders by eventId: ${eventId} - ${error}`);

      return [];
    }
  }
}

export const symplaController: SymplaController = new SymplaController();
