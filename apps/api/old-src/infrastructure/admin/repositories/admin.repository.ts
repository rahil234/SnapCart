import type { Admin as PrismaAdmin } from '@prisma/client';
import type { Admin as EntityAdmin } from '@/domain/admin/entities/admin.entity';

export interface IAdminRepository {
  create(
    data: Omit<PrismaAdmin, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<EntityAdmin>;

  findById(id: string): Promise<EntityAdmin | null>;

  findByEmail(email: string): Promise<EntityAdmin | null>;

  findAll(): Promise<EntityAdmin[]>;

  update(id: string, data: Partial<PrismaAdmin>): Promise<EntityAdmin>;

  delete(id: string): Promise<void>;
}
