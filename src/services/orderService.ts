import { OrderRepository, orderRepository } from '@/repositories';

import type { Order } from '@prisma/client';

export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {
    this.orderRepository = orderRepository;
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.getAllOrders();
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.orderRepository.getOrderById(id);
  }

  async getOrderBySymplaId(symplaId: string): Promise<Order | null> {
    return this.orderRepository.getOrderBySymplaId(symplaId);
  }

  async getOrderWithTickets(id: string): Promise<Order | null> {
    return this.orderRepository.getOrderWithTickets(id);
  }
}

export const orderService: OrderService = new OrderService(orderRepository);
