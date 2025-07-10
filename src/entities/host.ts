import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';

import { Event } from '@/entities';

@Entity('Hosts')
export class Host {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { unique: true, name: 'event_id' })
  eventId: string;

  @Column('text')
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Event, (event: Event) => event.hostId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: Event;
}
