import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Address, Host, Integration, Order, User } from '@/entities';

@Entity('Events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { name: 'reference_id' })
  referenceId: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Column('uuid', { name: 'integration_id' })
  integrationId: string;

  @Column('uuid', { name: 'address_id', nullable: true })
  addressId: string;

  @Column('uuid', { name: 'host_id', nullable: true })
  hostId: string;

  @Column('text')
  name: string;

  @Column('text', { nullable: true })
  detail: string;

  @Column('boolean', { default: false })
  active: boolean;

  @Column('boolean', { default: false, name: 'private_event' })
  privateEvent: boolean;

  @Column('boolean', { default: false })
  published: boolean;

  @Column('boolean', { default: false })
  cancelled: boolean;

  @Column('text', { nullable: true })
  image: string;

  @Column('text', { nullable: true })
  url: string;

  @Column('timestamp', { name: 'start_date' })
  startDate: Date;

  @Column('timestamp', { name: 'end_date' })
  endDate: Date;

  @Column('text', { nullable: true, name: 'category_prim' })
  categoryPrim: string;

  @Column('text', { nullable: true, name: 'category_sec' })
  categorySec: string;

  @Column('timestamp', { nullable: true, name: 'last_update_date', default: '1970-01-01T00:00:00.000Z' })
  lastUpdateDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Address, (address: Address) => address.eventId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @OneToOne(() => Host, (host: Host) => host.eventId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'host_id' })
  host: Host;

  @OneToMany(() => Order, (order: Order) => order.eventId, { onDelete: 'CASCADE' })
  orders: Order[];

  @ManyToOne(() => User, (user: User) => user.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Integration, (integration: Integration) => integration.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'integration_id' })
  integration: Integration;
}
