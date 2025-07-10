import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';

import { Order } from '@/entities';

@Entity('UTMs')
export class Utm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { unique: true, name: 'order_id' })
  orderId: string;

  @Column('text', { nullable: true, name: 'utm_source' })
  utmSource: string;

  @Column('text', { nullable: true, name: 'utm_medium' })
  utmMedium: string;

  @Column('text', { nullable: true, name: 'utm_campaign' })
  utmCampaign: string;

  @Column('text', { nullable: true, name: 'utm_term' })
  utmTerm: string;

  @Column('text', { nullable: true, name: 'utm_content' })
  utmContent: string;

  @Column('text', { nullable: true, name: 'user_agent' })
  userAgent: string;

  @Column('text', { nullable: true })
  referrer: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Order, (order: Order) => order.utmId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
