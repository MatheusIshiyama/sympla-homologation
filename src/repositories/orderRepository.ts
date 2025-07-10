import { FindManyOptions, QueryRunner, Repository } from 'typeorm';

import { AppDataSource } from '@/database/data-source';
import { Order } from '@/entities';

export class OrderRepository {
  private repository: Repository<Order>;

  constructor() {
    this.repository = AppDataSource.getRepository(Order);
  }

  async getAllOrders(findManyOptions: FindManyOptions<Order>, queryRunner?: QueryRunner): Promise<Order[]> {
    if (queryRunner) return queryRunner.manager.find(Order, { order: { createdAt: 'DESC' }, ...findManyOptions });

    return this.repository.find({ order: { createdAt: 'DESC' }, ...findManyOptions });
  }

  async getOrderById(id: string, queryRunner?: QueryRunner): Promise<Order | null> {
    if (queryRunner) return queryRunner.manager.findOne(Order, { where: { id } });

    return this.repository.findOne({ where: { id } });
  }

  async getOrderByReferenceId(referenceId: string, queryRunner?: QueryRunner): Promise<Order | null> {
    if (queryRunner) return queryRunner.manager.findOne(Order, { where: { referenceId } });

    return this.repository.findOne({ where: { referenceId } });
  }

  async getOrderWithTickets(id: string, queryRunner?: QueryRunner): Promise<Order | null> {
    if (queryRunner) return queryRunner.manager.findOne(Order, { where: { id }, relations: ['participants'] });

    return this.repository.findOne({ where: { id }, relations: ['participants'] });
  }

  async createOrder(data: Partial<Order>, queryRunner?: QueryRunner): Promise<Order> {
    if (queryRunner) return queryRunner.manager.save(Order, data);

    return this.repository.save(data);
  }

  async updateOrderById(orderId: string, data: Partial<Order>, queryRunner?: QueryRunner): Promise<Order> {
    if (queryRunner) {
      await queryRunner.manager.update(Order, orderId, data);

      return this.getOrderById(orderId, queryRunner) as Promise<Order>;
    }

    await this.repository.update(orderId, data);

    return this.getOrderById(orderId) as Promise<Order>;
  }

  async createOrUpdateOrderById(id: string, data: Partial<Order>, queryRunner?: QueryRunner): Promise<Order> {
    const orderExists: Order | null = await this.getOrderById(id, queryRunner);

    if (orderExists) return this.updateOrderById(orderExists.id, data, queryRunner);

    return this.createOrder(data);
  }

  async createOrUpdateOrderByReferenceId(referenceId: string, data: Partial<Order>, queryRunner?: QueryRunner): Promise<Order> {
    const orderExists: Order | null = await this.getOrderByReferenceId(referenceId, queryRunner);

    if (orderExists) return this.updateOrderById(orderExists.id, data, queryRunner);

    return this.createOrder(data);
  }
}

export const orderRepository: OrderRepository = new OrderRepository();
