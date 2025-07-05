import dateFns from 'date-fns';

import { prisma } from '@/database/prisma';
import { SymplaApiClient } from '@/services/api';
import { eventService } from '@/services/eventService';
import { orderService } from '@/services/orderService';
import { participantService } from '@/services/participantService';
import { logger, parseDate } from '@/utils';

import type { SymplaOrder, SymplaOrderResponse, SymplaParticipant, SymplaParticipantCheckin, SymplaParticipantResponse } from '@/types';
import type { Event, Order, Participant, Prisma } from '@prisma/client';

export class SymplaController {
  private symplaClient: SymplaApiClient;

  constructor() {
    this.symplaClient = new SymplaApiClient();
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

  async getOrderParticipants(eventId: string, orderId: string): Promise<SymplaParticipantResponse> {
    try {
      const participants: SymplaParticipantResponse = await this.symplaClient.getOrderParticipants(eventId, orderId);

      return participants;
    } catch (error) {
      logger('ERROR', 'SYMPLA - GET ORDER PARTICIPANTS', `Error getting order participants by eventId: ${eventId} and orderId: ${orderId}`);
      throw error;
    }
  }

  async getParticipantsFromOrder(eventId: string, orderId: string): Promise<SymplaParticipant[]> {
    const { data: participants } = await this.getOrderParticipants(eventId, orderId);

    return participants.map(
      (participant: SymplaParticipant): SymplaParticipant => ({
        id: participant.id,
        sympla_participant_id: participant.id,
        order_id: participant.order_id,
        order_status: participant.order_status,
        ticket_num_qr_code: participant.ticket_num_qr_code,
        checkin: participant.checkin as SymplaParticipantCheckin,
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

  async getNewOrdersByEvent(event: Event): Promise<SymplaOrder[]> {
    try {
      const orders: SymplaOrder[] = await this.fetchAllOrdersFromEvent(event.sympla_event_id);

      return orders.filter((order: SymplaOrder) => dateFns.isAfter(parseDate(order.updated_date), event.last_update_date));
    } catch (error) {
      logger('ERROR', 'SYMPLA - GET UPDATED ORDERS BY EVENT ID', `Error getting updated orders by eventId: ${event.id} - ${error}`);

      return [];
    }
  }

  async updateOrders(event: Event, orders: SymplaOrder[]): Promise<void> {
    try {
      await prisma.$transaction(
        async (tx: Prisma.TransactionClient): Promise<void> => {
          const updateOrderPromises: Promise<Order>[] = orders.map(async (order: SymplaOrder) => {
            const participants: SymplaParticipant[] = await this.getParticipantsFromOrder(event.sympla_event_id, order.id);

            const newOrder: Order = await orderService.createOrUpdateOrderBySymplaId(
              order.sympla_order_id,
              {
                sympla_order_id: order.sympla_order_id,
                event: { connect: { id: event.id } },
              },
              tx,
            );

            const updateParticipantPromises: Promise<Participant>[] = participants.map(async (participant: SymplaParticipant) => {
              const participantData: Prisma.ParticipantCreateInput = {
                sympla_participant_id: String(participant.id),
                number: participant.ticket_num_qr_code,
                qr_code: participant.ticket_num_qr_code,
                checked_in: participant.checkin.check_in,
                order: { connect: { id: newOrder.id } },
              };

              return participantService.createOrUpdateParticipantBySymplaId(String(participant.id), participantData, tx);
            });

            await Promise.all(updateParticipantPromises);

            return newOrder;
          });

          await Promise.all(updateOrderPromises);

          const lastUpdateDate: Date = this.filterOrdersByLastUpdateDate(orders);

          await eventService.updateEvent(event.id, { last_update_date: lastUpdateDate }, tx);
        },
        {
          timeout: 30000,
          maxWait: 10000, // 10 seconds max wait for transaction to start
        },
      );
    } catch (error) {
      logger('ERROR', 'SYMPLA - UPDATE ORDERS', `Error updating orders for eventId: ${event.id}`);
      throw error;
    }
  }
}

export const symplaController: SymplaController = new SymplaController();
