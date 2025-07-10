import dateFns from 'date-fns';
import { QueryRunner } from 'typeorm';

import { AppDataSource } from '@/database/data-source';
import { Event, Order, Participant, Utm } from '@/entities';
import { eventService, orderService, participantService, utmService } from '@/services';
import { SymplaApiClient } from '@/services/api';
import { logger, parseDate } from '@/utils';

import type { SymplaOrder, SymplaOrderResponse, SymplaParticipant, SymplaParticipantResponse } from '@/types';

export class SymplaController {
  private async getSymplaApiClientByEventReferenceId(eventReferenceId: string): Promise<SymplaApiClient> {
    try {
      const event: Event | null = await eventService.getEventByReferenceId(eventReferenceId);

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
      const symplaApiClient: SymplaApiClient = await this.getSymplaApiClientByEventReferenceId(eventReferenceId);

      const orders: SymplaOrderResponse = await symplaApiClient.getOrders(eventReferenceId, page);

      return orders;
    } catch (error) {
      logger('ERROR', 'SYMPLA - GET ORDERS BY EVENT ID', `Error getting orders by eventReferenceId: ${eventReferenceId}`);
      throw error;
    }
  }

  async getOrderParticipants(eventReferenceId: string, orderId: string): Promise<SymplaParticipantResponse> {
    try {
      const symplaApiClient: SymplaApiClient = await this.getSymplaApiClientByEventReferenceId(eventReferenceId);

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
      const symplaApiClient: SymplaApiClient = await this.getSymplaApiClientByEventReferenceId(eventReferenceId);

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
      const orders: SymplaOrder[] = await this.fetchAllOrdersFromEvent(event.referenceId);

      return orders.filter((order: SymplaOrder) => dateFns.isAfter(parseDate(order.updated_date), event.lastUpdateDate));
    } catch (error) {
      logger('ERROR', 'SYMPLA - GET UPDATED ORDERS BY EVENT ID', `Error getting updated orders by eventId: ${event.id} - ${error}`);

      return [];
    }
  }

  async updateOrders(event: Event, orders: SymplaOrder[] | Order[]): Promise<void> {
    const queryRunner: QueryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      const updateOrderPromises: Promise<Order>[] = orders.map(async (order: SymplaOrder | Order | any) => {
        const participants: SymplaParticipant[] = await this.getParticipantsFromOrder(event.referenceId, order.id);

        const utmData: Partial<Utm> = {
          utmSource: (order as SymplaOrder).utm.utm_source,
          utmMedium: (order as SymplaOrder).utm.utm_medium,
          utmCampaign: (order as SymplaOrder).utm.utm_campaign,
          utmTerm: (order as SymplaOrder).utm.utm_term,
          utmContent: (order as SymplaOrder).utm.utm_content,
          userAgent: (order as SymplaOrder).utm.user_agent,
          referrer: (order as SymplaOrder).utm.referrer,
        };

        const newUtm: Utm = await utmService.createOrUpdateUtmById(order.id, utmData, queryRunner);

        const orderData: Partial<Order> = {
          referenceId: (order as SymplaOrder).id,
          orderDate: parseDate(order.order_date as string),
          orderStatus: order.order_status,
          updatedDate: parseDate(order.updated_date as string),
          approvedDate: parseDate(order.approved_date as string),
          transactionType: order.transaction_type,
          orderTotalSalePrice: order.order_total_sale_price,
          orderTotalNetValue: order.order_total_net_value,
          buyerFirstName: order.buyer_first_name,
          buyerLastName: order.buyer_last_name,
          buyerEmail: order.buyer_email,
          eventId: event.id,
          utm: newUtm,
        };

        const newOrder: Order = await orderService.createOrUpdateOrderByReferenceId(order.id, orderData, queryRunner);

        const updateParticipantPromises: Promise<Participant>[] = participants.map(
          async (participant: SymplaParticipant | Participant | any) => {
            const participantData: Partial<Participant> = {
              referenceId: String((participant as SymplaParticipant).id),
              orderStatus: participant.order_status,
              orderDate: parseDate(participant.order_date as string),
              orderUpdatedDate: parseDate(participant.order_updated_date as string),
              orderApprovedDate: parseDate(participant.order_approved_date as string),
              orderDiscount: participant.order_discount,
              firstName: participant.first_name,
              lastName: participant.last_name,
              email: participant.email,
              ticketNumber: participant.ticket_number,
              ticketNumQrCode: participant.ticket_num_qr_code,
              ticketName: participant.ticket_name,
              sectorName: participant.sector_name,
              markedPlaceName: participant.marked_place_name,
              accessInformation: participant.access_information,
              pdvUser: participant.pdv_user,
              ticketSalePrice: participant.ticket_sale_price,
              checkIn: (participant as SymplaParticipant).checkin?.check_in,
              checkInDate: parseDate((participant as SymplaParticipant).checkin?.check_in_date as string),
              ticketCreatedAt: participant.ticket_created_at,
              ticketUpdatedAt: participant.ticket_updated_at,
              presentationId: String(participant.presentation_id),
              orderId: newOrder.id,
            };

            return participantService.createOrUpdateParticipantByReferenceId(String(participant.id), participantData, queryRunner);
          },
        );

        await Promise.all(updateParticipantPromises);

        return newOrder;
      });

      await Promise.all(updateOrderPromises);

      const lastUpdateDate: Date = this.filterOrdersByLastUpdateDate(orders as SymplaOrder[]);

      await eventService.updateEvent(event.id, { lastUpdateDate }, queryRunner);
    } catch (error) {
      logger('ERROR', 'SYMPLA - UPDATE ORDERS', `Error updating orders for eventId: ${event.id}`);
      throw error;
    }
  }
}

export const symplaController: SymplaController = new SymplaController();
