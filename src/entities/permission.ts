import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

import { Role } from '@/entities';

@Entity('Permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'role_id' })
  roleId: string;

  @Column('text')
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Role, (role: Role) => role.permissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
