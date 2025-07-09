import dateFns from 'date-fns';

import { prisma } from '@/database/prisma';
import { SymplaApiClient } from '@/services/api';
import { eventService } from '@/services/eventService';
import { orderService } from '@/services/orderService';
import { participantService } from '@/services/participantService';
import { logger, parseDate } from '@/utils';

import type { SymplaOrder, SymplaOrderResponse, SymplaParticipant, SymplaParticipantResponse } from '@/types';
import type { Event, Integration, Order, Participant, Prisma } from '@prisma/client';

export class SymplaController {
  private async getSymplaApiClientByEventReferenceId(eventReferenceId: string): Promise<SymplaApiClient> {
    try {
      const event: (Event & { integration: Integration }) | null = (await eventService.getEventByReferenceId(eventReferenceId)) as
        | (Event & {
            integration: Integration;
          })
        | null;

      if (!event) {
        throw new Error(`Event not found for eventReferenceId: ${eventReferenceId}`);
      }

      return new SymplaApiClient(event.integration.token);
    } catch (error) {
      logger(
        'ERROR',
        'SYMPLA - GET SYMPLA API CLIENT BY EVENT REFERENCE ID',
        `Error getting sympla api client by eventReferenceId: ${eventReferenceId}`,
      );
      throw error;
    }
  }

  async getOrdersByEventReferenceId(eventReferenceId: string, page: number = 1): Promise<SymplaOrderResponse> {
    try {
      const symplaApiClient = await this.getSymplaApiClientByEventReferenceId(eventReferenceId);

      const orders: SymplaOrderResponse = await symplaApiClient.getOrders(eventReferenceId, page);

      return orders;
    } catch (error) {
      logger('ERROR', 'SYMPLA - GET ORDERS BY EVENT ID', `Error getting orders by eventReferenceId: ${eventReferenceId}`);
      throw error;
    }
  }

  async getOrderParticipants(eventReferenceId: string, orderId: string): Promise<SymplaParticipantResponse> {
    try {
      const symplaApiClient = await this.getSymplaApiClientByEventReferenceId(eventReferenceId);

      const participants: SymplaParticipantResponse = await symplaApiClient.getOrderParticipants(eventReferenceId, orderId);

      return participants;
    } catch (error) {
      logger(
        'ERROR',
        'SYMPLA - GET ORDER PARTICIPANTS',
        `Error getting order participants by eventReferenceId: ${eventReferenceId} and orderId: ${orderId}`,
      );
      throw error;
    }
  }

  async getParticipantsFromOrder(eventReferenceId: string, orderId: string): Promise<SymplaParticipant[]> {
    const { data: participants } = await this.getOrderParticipants(eventReferenceId, orderId);

    return participants.map(
      (participant: SymplaParticipant): SymplaParticipant => ({
        ...participant,
        reference_id: String(participant.id),
      }),
    );
  }

  async fetchAllOrdersFromEvent(eventReferenceId: string, prevResults: SymplaOrder[] = [], page: number = 1): Promise<SymplaOrder[]> {
    try {
      const symplaApiClient = await this.getSymplaApiClientByEventReferenceId(eventReferenceId);

      const response: SymplaOrderResponse = await symplaApiClient.getOrders(eventReferenceId, page);
      const results: SymplaOrder[] = [...prevResults, ...response.data];
      const hasNextPage: boolean = response.pagination.has_next;

      return hasNextPage ? this.fetchAllOrdersFromEvent(eventReferenceId, results, page + 1) : results;
    } catch (error) {
      logger('ERROR', 'SYMPLA - FETCH ALL ORDERS FROM EVENT', `Error fetching all orders from eventReferenceId: ${eventReferenceId}`);
      throw error;
    }
  }

  filterOrdersByLastUpdateDate(orders: SymplaOrder[]): Date {
    const updateDates: Date[] = orders.map((order: SymplaOrder) => parseDate(order.updated_date));

    return dateFns.max(updateDates);
  }

  async getNewOrdersByEvent(event: Event): Promise<SymplaOrder[]> {
    try {
      const orders: SymplaOrder[] = await this.fetchAllOrdersFromEvent(event.reference_id);

      return orders.filter((order: SymplaOrder) => dateFns.isAfter(parseDate(order.updated_date), event.last_update_date));
    } catch (error) {
      logger('ERROR', 'SYMPLA - GET UPDATED ORDERS BY EVENT ID', `Error getting updated orders by eventId: ${event.id} - ${error}`);

      return [];
    }
  }

  async updateOrders(event: Event, orders: SymplaOrder[] | Order[]): Promise<void> {
    try {
      await prisma.$transaction(
        async (tx: Prisma.TransactionClient): Promise<void> => {
          const updateOrderPromises: Promise<Order>[] = orders.map(async (order: SymplaOrder | Order) => {
            const participants: SymplaParticipant[] = await this.getParticipantsFromOrder(event.reference_id, order.id);

            const newOrder: Order = await orderService.createOrUpdateOrderByReferenceId(
              order.id,
              {
                reference_id: order.id,
                order_date: parseDate(order.order_date as string),
                order_status: order.order_status,
                updated_date: parseDate(order.updated_date as string),
                approved_date: parseDate(order.approved_date as string),
                transaction_type: order.transaction_type,
                order_total_sale_price: order.order_total_sale_price,
                order_total_net_value: order.order_total_net_value,
                buyer_first_name: order.buyer_first_name,
                buyer_last_name: order.buyer_last_name,
                buyer_email: order.buyer_email,
                event: { connect: { id: event.id } },
                utm: {
                  connectOrCreate: {
                    where: {
                      order_id: (order as SymplaOrder).id,
                      referrer: (order as SymplaOrder).utm.referrer,
                    },
                    create: {
                      utm_source: (order as SymplaOrder).utm.utm_source,
                      utm_medium: (order as SymplaOrder).utm.utm_medium,
                      utm_campaign: (order as SymplaOrder).utm.utm_campaign,
                      utm_term: (order as SymplaOrder).utm.utm_term,
                      utm_content: (order as SymplaOrder).utm.utm_content,
                      user_agent: (order as SymplaOrder).utm.user_agent,
                      referrer: (order as SymplaOrder).utm.referrer,
                    },
                  },
                },
              },
              tx,
            );

            const updateParticipantPromises: Promise<Participant>[] = participants.map(
              async (participant: SymplaParticipant | Participant) => {
                const participantData: Prisma.ParticipantCreateInput = {
                  reference_id: String(participant.id),
                  order_status: participant.order_status,
                  order_date: parseDate(participant.order_date as string),
                  order_updated_date: parseDate(participant.order_updated_date as string),
                  order_approved_date: parseDate(participant.order_approved_date as string),
                  order_discount: participant.order_discount,
                  first_name: participant.first_name,
                  last_name: participant.last_name,
                  email: participant.email,
                  ticket_number: participant.ticket_number,
                  ticket_num_qr_code: participant.ticket_num_qr_code,
                  ticket_name: participant.ticket_name,
                  sector_name: participant.sector_name,
                  marked_place_name: participant.marked_place_name,
                  access_information: participant.access_information,
                  pdv_user: participant.pdv_user,
                  ticket_sale_price: participant.ticket_sale_price,
                  check_in: (participant as SymplaParticipant).checkin?.check_in,
                  check_in_date: (participant as SymplaParticipant).checkin?.check_in_date,
                  ticket_created_at: participant.ticket_created_at,
                  ticket_updated_at: participant.ticket_updated_at,
                  presentation_id: String(participant.presentation_id),
                  order: { connect: { id: newOrder.id } },
                };

                return participantService.createOrUpdateParticipantByReferenceId(String(participant.id), participantData, tx);
              },
            );

            await Promise.all(updateParticipantPromises);

            return newOrder;
          });

          await Promise.all(updateOrderPromises);

          const lastUpdateDate: Date = this.filterOrdersByLastUpdateDate(orders as SymplaOrder[]);

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
