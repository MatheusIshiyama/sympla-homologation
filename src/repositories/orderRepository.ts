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

  async getOrderByReferenceId(referenceId: string, tx?: Prisma.TransactionClient): Promise<Order | null> {
    return this.getPrismaClient(tx).order.findUnique({ where: { reference_id: referenceId } });
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

  async updateOrderById(orderId: string, data: Prisma.OrderUpdateInput, tx?: Prisma.TransactionClient): Promise<Order> {
    return this.getPrismaClient(tx).order.update({
      where: { id: orderId },
      data,
    });
  }

  async createOrUpdateOrder(id: string, data: Prisma.OrderCreateInput, tx?: Prisma.TransactionClient): Promise<Order> {
    const orderExists: Order | null = await this.getOrderById(id, tx);

    if (orderExists) return this.updateOrderById(orderExists.id, data, tx);

    return this.createOrder(data, tx);
  }

  async createOrUpdateOrderByReferenceId(
    referenceId: string,
    data: Prisma.OrderCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Order> {
    const orderExists: Order | null = await this.getOrderByReferenceId(referenceId, tx);

    if (orderExists) return this.updateOrderById(orderExists.id, data, tx);

    return this.createOrder(data, tx);
  }
}

export const orderRepository: OrderRepository = new OrderRepository();
