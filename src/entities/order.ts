import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Event, Participant, Utm } from '@/entities';

@Entity('Orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true, name: 'reference_id' })
  referenceId: string;

  @Column('uuid', { name: 'event_id' })
  eventId: string;

  @Column('uuid', { nullable: true, name: 'utm_id' })
  utmId: string;

  @Column('timestamp', { name: 'order_date' })
  orderDate: Date;

  @Column('text', { name: 'order_status' })
  orderStatus: string;

  @Column('timestamp', { nullable: true, name: 'updated_date' })
  updatedDate: Date;

  @Column('timestamp', { nullable: true, name: 'approved_date' })
  approvedDate: Date;

  @Column('text', { nullable: true, name: 'transaction_type' })
  transactionType: string;

  @Column('float', { nullable: true, name: 'order_total_sale_price' })
  orderTotalSalePrice: number;

  @Column('float', { nullable: true, name: 'order_total_net_value' })
  orderTotalNetValue: number;

  @Column('text', { nullable: true, name: 'buyer_first_name' })
  buyerFirstName: string;

  @Column('text', { nullable: true, name: 'buyer_last_name' })
  buyerLastName: string;

  @Column('text', { nullable: true, name: 'buyer_email' })
  buyerEmail: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Participant, (participant: Participant) => participant.orderId, { onDelete: 'CASCADE' })
  participants: Participant[];

  @ManyToOne(() => Event, (event: Event) => event.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @OneToOne(() => Utm, (utm: Utm) => utm.orderId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'utm_id' })
  utm: Utm;
}
