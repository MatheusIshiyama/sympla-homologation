import { OrderRepository, orderRepository } from '@/repositories';

import type { Order } from '@/entities';
import type { FindManyOptions, QueryRunner } from 'typeorm';

export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {
    this.orderRepository = orderRepository;
  }

  async getAllOrders(findManyOptions: FindManyOptions<Order>, queryRunner?: QueryRunner): Promise<Order[]> {
    return this.orderRepository.getAllOrders(findManyOptions, queryRunner);
  }

  async getOrderById(id: string, queryRunner?: QueryRunner): Promise<Order | null> {
    return this.orderRepository.getOrderById(id, queryRunner);
  }

  async getOrderByReferenceId(referenceId: string, queryRunner?: QueryRunner): Promise<Order | null> {
    return this.orderRepository.getOrderByReferenceId(referenceId, queryRunner);
  }

  async getOrderWithTickets(id: string, queryRunner?: QueryRunner): Promise<Order | null> {
    return this.orderRepository.getOrderWithTickets(id, queryRunner);
  }

  async createOrder(data: Partial<Order>, queryRunner?: QueryRunner): Promise<Order> {
    return this.orderRepository.createOrder(data, queryRunner);
  }

  async updateOrderById(id: string, data: Partial<Order>, queryRunner?: QueryRunner): Promise<Order> {
    return this.orderRepository.updateOrderById(id, data, queryRunner);
  }

  async updateOrderByReferenceId(referenceId: string, data: Partial<Order>, queryRunner?: QueryRunner): Promise<Order> {
    const orderExists: Order | null = await this.getOrderByReferenceId(referenceId, queryRunner);

    if (!orderExists) throw new Error('Order not found');

    return this.updateOrderById(orderExists.id, data, queryRunner);
  }

  async createOrUpdateOrderByReferenceId(referenceId: string, data: Partial<Order>, queryRunner?: QueryRunner): Promise<Order> {
    const orderExists: Order | null = await this.getOrderByReferenceId(referenceId, queryRunner);

    if (orderExists) return this.updateOrderById(orderExists.id, data, queryRunner);

    return this.createOrder(data, queryRunner);
  }
}

export const orderService: OrderService = new OrderService(orderRepository);
