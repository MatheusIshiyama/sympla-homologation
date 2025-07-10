import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';

import { Event, Integration, Role } from '@/entities';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true, name: 'reference_id' })
  referenceId: string;

  @Column('uuid', { name: 'role_id' })
  roleId: string;

  @Column('text', { nullable: true })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Event, (event: Event) => event.userId, { onDelete: 'CASCADE' })
  events: Event[];

  @OneToMany(() => Integration, (integration: Integration) => integration.userId, { onDelete: 'CASCADE' })
  integrations: Integration[];

  @ManyToOne(() => Role, (role: Role) => role.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
