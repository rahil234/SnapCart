import { Inject } from '@nestjs/common';
import { PrismaClient, User as PrismaUser } from '@prisma/client';

import { User } from '@/domain/user/entities/user.entity';
import { UserMapper } from '@/infrastructure/user/persistence/mappers';
import { User as UserEntity } from '@/domain/user/entities/user.entity';
import { IUserRepository } from '@/infrastructure/user/repositories/user.repository';
import { UserPaginatedQueryDto } from '@/application/user/dtos/request/user-paginated-query.dto';

export class PrismaUserRepository implements IUserRepository {
  constructor(
    @Inject('PrismaService') private readonly _prisma: PrismaClient,
  ) {}

  async create(data: Partial<PrismaUser>): Promise<User> {
    const doc = await this._prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        dob: data.dob,
        password: data.password,
        tryOnLimit: 3,
      },
      include: {
        addresses: true,
      },
    });
    return UserMapper.toEntity(doc);
  }

  async find(query: UserPaginatedQueryDto): Promise<User[]> {
    const { page = 1, limit = 10, search, status } = query;

    const docs = await this._prisma.user.findMany({
      where: {
        OR: search
          ? [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
        status: status,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        addresses: true,
      },
    });

    return docs.map((d) => UserMapper.toEntity(d));
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this._prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
      },
    });
    return doc ? UserMapper.toEntity(doc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this._prisma.user.findUnique({
      where: { email },
      include: {
        addresses: true,
      },
    });
    return doc ? UserMapper.toEntity(doc) : null;
  }

  async findByPhone(phone: string): Promise<User | null> {
    const doc = await this._prisma.user.findUnique({
      where: { phone },
      include: {
        addresses: true,
      },
    });
    return doc ? UserMapper.toEntity(doc) : null;
  }

  async update(
    id: string,
    data: Partial<Omit<UserEntity, 'id' | 'updatedAt' | 'createdAt'>>,
  ): Promise<User | null> {
    const doc = await this._prisma.user.update({
      where: { id },
      data: data,
      include: {
        addresses: true,
      },
    });
    return doc ? UserMapper.toEntity(doc) : null;
  }

  async count(): Promise<number> {
    return this._prisma.user.count();
  }
}
