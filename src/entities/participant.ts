import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

import { Order } from '@/entities';

@Entity('Participants')
export class Participant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true, name: 'reference_id' })
  referenceId: string;

  @Column('uuid', { name: 'order_id' })
  orderId: string;

  @Column('text', { name: 'order_status' })
  orderStatus: string;

  @Column('timestamp', { name: 'order_date' })
  orderDate: Date;

  @Column('timestamp', { name: 'order_updated_date' })
  orderUpdatedDate: Date;

  @Column('timestamp', { nullable: true, name: 'order_approved_date' })
  orderApprovedDate: Date;

  @Column('text', { nullable: true, name: 'order_discount' })
  orderDiscount: string;

  @Column('text', { name: 'first_name' })
  firstName: string;

  @Column('text', { name: 'last_name' })
  lastName: string;

  @Column('text')
  email: string;

  @Column('text', { name: 'ticket_number' })
  ticketNumber: string;

  @Column('text', { name: 'ticket_num_qr_code' })
  ticketNumQrCode: string;

  @Column('text', { nullable: true, name: 'ticket_name' })
  ticketName: string;

  @Column('text', { nullable: true, name: 'sector_name' })
  sectorName: string;

  @Column('text', { nullable: true, name: 'marked_place_name' })
  markedPlaceName: string;

  @Column('text', { nullable: true, name: 'access_information' })
  accessInformation: string;

  @Column('text', { nullable: true, name: 'pdv_user' })
  pdvUser: string;

  @Column('float', { nullable: true, name: 'ticket_sale_price' })
  ticketSalePrice: number;

  @Column('boolean', { default: false, name: 'check_in' })
  checkIn: boolean;

  @Column('timestamp', { nullable: true, name: 'check_in_date' })
  checkInDate: Date;

  @Column('timestamp', { nullable: true, name: 'ticket_created_at' })
  ticketCreatedAt: Date;

  @Column('timestamp', { nullable: true, name: 'ticket_updated_at' })
  ticketUpdatedAt: Date;

  @Column('text', { nullable: true, name: 'presentation_id' })
  presentationId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Order, (order: Order) => order.participants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
