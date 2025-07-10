import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';

import { Event } from '@/entities';

@Entity('Addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { unique: true, name: 'event_id' })
  eventId: string;

  @Column('text')
  name: string;

  @Column('text', { nullable: true })
  address: string;

  @Column('text', { nullable: true, name: 'address_num' })
  addressNum: string;

  @Column('text', { nullable: true, name: 'address_alt' })
  addressAlt: string;

  @Column('text', { nullable: true })
  neighborhood: string;

  @Column('text')
  city: string;

  @Column('text', { nullable: true })
  state: string;

  @Column('text', { nullable: true, name: 'zip_code' })
  zipCode: string;

  @Column('text', { nullable: true })
  country: string;

  @Column('float', { nullable: true })
  lon: number;

  @Column('float', { nullable: true })
  lat: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Event, (event: Event) => event.addressId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: Event;
}
