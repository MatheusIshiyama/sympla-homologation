import { BaseRepository } from '@/repositories/baseRepository';

import type { Order, Prisma } from '@prisma/client';

export class OrderRepository extends BaseRepository {
  async getAllOrders(tx?: Prisma.TransactionClient): Promise<Order[]> {
    return this.getPrismaClient(tx).order.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async getOrderById(id: string, tx?: Prisma.TransactionClient): Promise<Order | null> {
    return this.getPrismaClient(tx).order.findUnique({ where: { id } });
  }

  async getOrderBySymplaId(symplaId: string, tx?: Prisma.TransactionClient): Promise<Order | null> {
    return this.getPrismaClient(tx).order.findUnique({ where: { sympla_order_id: symplaId } });
  }

  async getOrderWithTickets(id: string, tx?: Prisma.TransactionClient): Promise<Order | null> {
    return this.getPrismaClient(tx).order.findUnique({
      where: { id },
      include: {
        participants: true,
      },
    });
  }

  async createOrder(data: Prisma.OrderCreateInput, tx?: Prisma.TransactionClient): Promise<Order> {
    return this.getPrismaClient(tx).order.create({
      data,
    });
  }

  async updateOrder(orderId: string, data: Prisma.OrderUpdateInput, tx?: Prisma.TransactionClient): Promise<Order> {
    return this.getPrismaClient(tx).order.update({
      where: { id: orderId },
      data,
    });
  }

  async createOrUpdateOrder(id: string, data: Prisma.OrderCreateInput, tx?: Prisma.TransactionClient): Promise<Order> {
    const orderExists: Order | null = await this.getOrderById(id, tx);

    if (orderExists) return this.updateOrder(orderExists.id, data, tx);

    return this.createOrder(data, tx);
  }

  async createOrUpdateOrderBySymplaId(symplaId: string, data: Prisma.OrderCreateInput, tx?: Prisma.TransactionClient): Promise<Order> {
    const orderExists: Order | null = await this.getOrderBySymplaId(symplaId, tx);

    if (orderExists) return this.updateOrder(orderExists.id, data, tx);

    return this.createOrder(data, tx);
  }
}

export const orderRepository: OrderRepository = new OrderRepository();
