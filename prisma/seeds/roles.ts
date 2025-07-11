import { Permission, PrismaClient, Role } from '@prisma/client';
import { ITXClientDenyList } from '@prisma/client/runtime/client';

import { permissions, type PermissionData } from './permissions';

interface RoleData {
  id: number;
  name: string;
  permissions: string[];
}

const roles: RoleData[] = [
  {
    id: 1,
    name: 'admin',
    permissions: permissions.map((permission: PermissionData) => permission.name),
  },
  {
    id: 2,
    name: 'user',
    permissions: [
      'create:event',
      'read:event',
      'update:event',
      'delete:event',
      'create:integration',
      'read:integration',
      'update:integration',
      'delete:integration',
    ],
  },
];

export async function syncRoles(tx: Omit<PrismaClient, ITXClientDenyList>, permissions: Permission[]): Promise<void> {
  const rolesData: Promise<Role>[] = roles.map(async (role: RoleData) => {
    const roleExists: Role | null = await tx.role.findUnique({
      where: { id: role.id },
    });

    if (roleExists) return roleExists;

    const userPermissions: Permission[] = permissions.filter((permission: Permission) => role.permissions.includes(permission.name));

    return tx.role.create({
      data: {
        id: role.id,
        name: role.name,
        permissions: { connect: userPermissions.map((permission: Permission) => ({ id: permission.id })) },
      },
    });
  });

  await Promise.all(rolesData);
}
