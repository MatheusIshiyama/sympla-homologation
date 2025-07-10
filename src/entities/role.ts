import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

import { User, Permission } from '@/entities';

@Entity('Roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => User, (user: User) => user.roleId, { onDelete: 'CASCADE' })
  users: User[];

  @OneToMany(() => Permission, (permission: Permission) => permission.roleId, { onDelete: 'CASCADE' })
  permissions: Permission[];
}
