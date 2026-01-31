import { Injectable } from '@nestjs/common';

import { User } from '@/domain/user/entities/user.entity';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { UserRepository } from '@/domain/user/repositories/user.repository';
import { PrismaUserMapper } from '@/infrastructure/user/persistence/mappers/prisma-user.mapper';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<User> {
    const data = PrismaUserMapper.toPersistence(user);
    const doc = await this.prisma.user.create({ data });
    return PrismaUserMapper.toDomain(doc);
  }

  async update(user: User): Promise<User> {
    const data = PrismaUserMapper.toPersistence(user);
    const doc = await this.prisma.user.update({
      where: { id: user.id },
      data,
    });
    return PrismaUserMapper.toDomain(doc);
  }

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!record) return null;
    return PrismaUserMapper.toDomain(record);
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!record) return null;
    return PrismaUserMapper.toDomain(record);
  }

  async findByPhone(phone: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { phone },
    });
    if (!record) return null;
    return PrismaUserMapper.toDomain(record);
  }

  async findAll(
    skip: number = 0,
    take: number = 10,
    search?: string,
    status?: string,
  ): Promise<{ users: User[]; total: number }> {
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [records, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users: records.map(PrismaUserMapper.toDomain),
      total,
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
