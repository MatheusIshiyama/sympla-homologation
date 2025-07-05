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

  async getOrderBySymplaId(symplaId: string, tx?: Prisma.TransactionClient): Promise<Order | null> {
    return this.orderRepository.getOrderBySymplaId(symplaId, tx);
  }

  async getOrderWithTickets(id: string, tx?: Prisma.TransactionClient): Promise<Order | null> {
    return this.orderRepository.getOrderWithTickets(id, tx);
  }

  async createOrder(data: Prisma.OrderCreateInput, tx?: Prisma.TransactionClient): Promise<Order> {
    return this.orderRepository.createOrder(data, tx);
  }

  async updateOrder(id: string, data: Prisma.OrderUpdateInput, tx?: Prisma.TransactionClient): Promise<Order> {
    return this.orderRepository.updateOrder(id, data, tx);
  }

  async updateOrderBySymplaId(symplaId: string, data: Prisma.OrderUpdateInput, tx?: Prisma.TransactionClient): Promise<Order> {
    const orderExists: Order | null = await this.getOrderBySymplaId(symplaId, tx);

    if (!orderExists) throw new Error('Order not found');

    return this.updateOrder(orderExists.id, data, tx);
  }

  async createOrUpdateOrderBySymplaId(symplaId: string, data: Prisma.OrderCreateInput, tx?: Prisma.TransactionClient): Promise<Order> {
    const orderExists: Order | null = await this.getOrderBySymplaId(symplaId, tx);

    if (orderExists) return this.updateOrder(orderExists.id, data, tx);

    return this.createOrder(data, tx);
  }
}

export const orderService: OrderService = new OrderService(orderRepository);
