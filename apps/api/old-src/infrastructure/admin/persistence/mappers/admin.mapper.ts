import { Admin as PrismaAdmin } from '@prisma/client';
import { Admin as AdminEntity } from '@/domain/admin/entities/admin.entity';

export const AdminMapper = {
  toDomain(prismaAdmin: PrismaAdmin): AdminEntity {
    return new AdminEntity(
      prismaAdmin.id,
      prismaAdmin.name,
      prismaAdmin.email,
      prismaAdmin.password,
      prismaAdmin.status === 'blocked' || prismaAdmin.status === 'deleted' ? 'suspended' : prismaAdmin.status as 'active' | 'suspended',
      prismaAdmin.createdAt,
      prismaAdmin.updatedAt,
    );
  },

  toPrisma(admin: Partial<AdminEntity>): any {
    return {
      name: admin.name,
      email: admin.email,
      password: admin.password,
      status: admin.status,
    };
  },
};
