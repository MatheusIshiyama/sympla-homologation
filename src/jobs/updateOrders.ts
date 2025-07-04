import { symplaController } from '@/controllers/api';
import { logger } from '@/utils';

import type { SymplaOrder, SymplaTicket } from '@/types';

export const updateOrders: (eventId: string) => Promise<void> = async (eventId: string): Promise<void> => {
  try {
    logger('INFO', 'JOBS - UPDATE ORDERS', `Updating orders for eventId: ${eventId}`);

    const updatedOrders: SymplaOrder[] = await symplaController.getUpdatedOrdersByEventId(eventId);

    const updatedOrdersIds: string[] = updatedOrders.map((order: SymplaOrder) => order.id);
    const validatedTickets: SymplaTicket[] = symplaController.getValidatedTicketsByEventId(eventId);
    const validatedTicketsWithoutUpdatedOrders: SymplaTicket[] = validatedTickets.filter(
      (ticket: SymplaTicket) => !updatedOrdersIds.includes(ticket.order_id),
    );
    // Essa é a lista de tickets que não foi afetada pela última atualização

    const validUpdatedOrdersIds: string[] = updatedOrders
      .filter((order: SymplaOrder) => order.order_status === 'A')
      .map((order: SymplaOrder) => order.id);
    const newValidatedTickets: SymplaTicket[][] = await Promise.all(
      validUpdatedOrdersIds.map((updatedOrderId: string) => symplaController.getTicketsFromOrder(eventId, updatedOrderId)),
    );
    // Essa é a lista dos tickets de novos orders *válidos*
    // Ou seja, se uma order passou de válida para cancelada, os tickets relacionados a ela não serão recuperados

    const data: {
      newUpdatedDate: Date | null;
      newValidatedTickets: SymplaTicket[];
      validTickets: SymplaTicket[];
    } = {
      newUpdatedDate: updatedOrders.length
        ? symplaController.filterOrdersByLastUpdateDate(updatedOrders)
        : symplaController.getLastUpdateDateByEventId(eventId),
      newValidatedTickets: newValidatedTickets.flat(),
      validTickets: [...newValidatedTickets.flat(), ...validatedTicketsWithoutUpdatedOrders],
    };

    symplaController.setLastUpdateDateByEventId(eventId, data.newUpdatedDate || new Date('1970-01-01T00:00:00.000Z'));
    symplaController.setValidatedTicketsByEventId(eventId, data.validTickets);

    return logger('INFO', 'JOBS - UPDATE ORDERS', `Updated orders for eventId: ${eventId}`);
  } catch (error) {
    logger('ERROR', 'JOBS - UPDATE ORDERS', `Error updating orders for eventId: ${eventId} - ${error}`);
    throw error;
  }
};
