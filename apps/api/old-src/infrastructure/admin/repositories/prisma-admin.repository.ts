import { Admin as PrismaAdmin } from '@prisma/client';

import { AdminMapper } from '@/infrastructure/admin/persistence/mappers';
import { PrismaService } from '@/common/prisma/prisma.service';
import { Admin as AdminEntity } from '@/domain/admin/entities/admin.entity';
import { IAdminRepository } from '@/infrastructure/admin/repositories/interfaces/admin.repository';
import { Inject } from '@nestjs/common';

export class PrismaAdminRepository implements IAdminRepository {
  constructor(
    @Inject('PrismaService') private readonly prisma: PrismaService,
  ) {}

  create(
    data: Omit<PrismaAdmin, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<AdminEntity> {
    return this.prisma.admin.create({
      data: AdminMapper.toPersistence(data),
    });
  }

  findAll(): Promise<AdminEntity[]> {
    return this.prisma.admin.findMany();
  }

  async findById(id: string): Promise<AdminEntity | null> {
    const doc = await this.prisma.admin.findUnique({
      where: { id },
    });
    return doc ? AdminMapper.toEntity(doc) : null;
  }

  async findByEmail(email: string): Promise<AdminEntity | null> {
    const doc = await this.prisma.admin.findUnique({
      where: { email },
    });
    return doc ? AdminMapper.toEntity(doc) : null;
  }

  async update(
    id: string,
    data: Pick<AdminEntity, 'name' | 'email' | 'password'>,
  ): Promise<AdminEntity> {
    const doc = await this.prisma.admin.update({
      where: { id },
      data: AdminMapper.toPersistence(data),
    });
    return AdminMapper.toEntity(doc);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.admin.delete({
      where: { id },
    });
  }
}
