import { ITXClientDenyList } from '@prisma/client/runtime/client';

import type { Permission, PrismaClient } from '@prisma/client';

export interface PermissionData {
  id: number;
  name: string;
}

export const permissions: PermissionData[] = [
  { id: 1, name: 'create:event' },
  { id: 2, name: 'read:event' },
  { id: 3, name: 'update:event' },
  { id: 4, name: 'delete:event' },
  { id: 5, name: 'create:integration' },
  { id: 6, name: 'read:integration' },
  { id: 7, name: 'update:integration' },
  { id: 8, name: 'delete:integration' },
];

export async function syncPermissions(tx: Omit<PrismaClient, ITXClientDenyList>): Promise<Permission[]> {
  const permissionsData: Promise<Permission>[] = permissions.map(async (permission: PermissionData) => {
    const permissionExists: Permission | null = await tx.permission.findUnique({
      where: { id: permission.id },
    });

    if (permissionExists) return permissionExists;

    return tx.permission.create({
      data: { id: permission.id, name: permission.name },
    });
  });

  const syncedPermissions: Permission[] = await Promise.all(permissionsData);

  return syncedPermissions;
}
