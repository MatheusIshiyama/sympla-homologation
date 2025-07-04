import { prisma } from '@/database/prisma';

import type { Order } from '@prisma/client';

export class OrderRepository {
  async getAllOrders(): Promise<Order[]> {
    return prisma.order.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async getOrderById(id: string): Promise<Order | null> {
    return prisma.order.findUnique({ where: { id } });
  }

  async getOrderBySymplaId(symplaId: string): Promise<Order | null> {
    return prisma.order.findUnique({ where: { sympla_id: symplaId } });
  }

  async getOrderWithTickets(id: string): Promise<Order | null> {
    return prisma.order.findUnique({
      where: { id },
      include: {
        tickets: true,
      },
    });
  }
}

export const orderRepository: OrderRepository = new OrderRepository();
