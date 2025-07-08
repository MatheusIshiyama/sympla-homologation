import { OrderRepository, orderRepository } from '@/repositories';

import type { Order, Prisma } from '@prisma/client';

export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {
    this.orderRepository = orderRepository;
  }

  async getAllOrders(tx?: Prisma.TransactionClient): Promise<Order[]> {
    return this.orderRepository.getAllOrders(tx);
  }

  async getOrderById(id: string, tx?: Prisma.TransactionClient): Promise<Order | null> {
    return this.orderRepository.getOrderById(id, tx);
  }

  async getOrderByReferenceId(referenceId: string, tx?: Prisma.TransactionClient): Promise<Order | null> {
    return this.orderRepository.getOrderByReferenceId(referenceId, tx);
  }

  async getOrderWithTickets(id: string, tx?: Prisma.TransactionClient): Promise<Order | null> {
    return this.orderRepository.getOrderWithTickets(id, tx);
  }

  async createOrder(data: Prisma.OrderCreateInput, tx?: Prisma.TransactionClient): Promise<Order> {
    return this.orderRepository.createOrder(data, tx);
  }

  async updateOrderById(id: string, data: Prisma.OrderUpdateInput, tx?: Prisma.TransactionClient): Promise<Order> {
    return this.orderRepository.updateOrderById(id, data, tx);
  }

  async updateOrderByReferenceId(referenceId: string, data: Prisma.OrderUpdateInput, tx?: Prisma.TransactionClient): Promise<Order> {
    const orderExists: Order | null = await this.getOrderByReferenceId(referenceId, tx);

    if (!orderExists) throw new Error('Order not found');

    return this.updateOrderById(orderExists.id, data, tx);
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

export const orderService: OrderService = new OrderService(orderRepository);
