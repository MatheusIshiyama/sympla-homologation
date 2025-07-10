import { symplaController } from '@/controllers/api';
import { Event } from '@/entities';
import { eventService } from '@/services';
import { logger } from '@/utils';

import type { SymplaOrder } from '@/types';

// ? Return just the orders that are valid (status "A")
const getValidNewOrdersIds: (newOrders: SymplaOrder[]) => string[] = (newOrders: SymplaOrder[]): string[] => {
  return newOrders.filter((order: SymplaOrder) => order.order_status === 'A').map((order: SymplaOrder) => String(order.id));
};

// ? Filter orders to update
const filterOrdersToUpdate: (newOrders: SymplaOrder[], validNewOrdersIds: string[]) => SymplaOrder[] = (
  newOrders: SymplaOrder[],
  validNewOrdersIds: string[],
): SymplaOrder[] => {
  return newOrders
    .filter((order: SymplaOrder) => validNewOrdersIds.includes(String(order.id)))
    .map((order: SymplaOrder) => ({ ...order, sympla_order_id: order.id }));
};

export const updateOrders: (eventId: string) => Promise<void> = async (eventId: string): Promise<void> => {
  try {
    const event: Event | null = await eventService.getEventById(eventId);

    if (!event) throw new Error(`Event not found for eventId: ${eventId}`);

    const newOrders: SymplaOrder[] = await symplaController.getNewOrdersByEvent(event);

    const validNewOrdersIds: string[] = getValidNewOrdersIds(newOrders);

    const ordersToUpdate: SymplaOrder[] = filterOrdersToUpdate(newOrders, validNewOrdersIds);

    if (ordersToUpdate.length) await symplaController.updateOrders(event, ordersToUpdate);
  } catch (error) {
    logger('ERROR', 'JOBS - UPDATE ORDERS', `Error updating orders for eventId: ${eventId} - ${error}`);
    throw error;
  }
};
