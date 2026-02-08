import { Injectable } from '@nestjs/common';

import { User } from '@/modules/user/domain/entities/user.entity';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { UserRepository } from '@/modules/user/domain/repositories/user.repository';
import { PrismaUserMapper } from '@/modules/user/infrastructure/persistence/mappers/prisma-user.mapper';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<User> {
    const userData = PrismaUserMapper.toPersistence(user);

    // Use transaction to ensure atomicity
    const result = await this.prisma.$transaction(async (tx) => {
      // Create user
      const createdUser = await tx.user.create({
        data: userData,
        include: {
          customerProfile: true,
          sellerProfile: true,
        },
      });

      // Create customer profile if exists
      if (user.getCustomerProfile()) {
        const profileData = PrismaUserMapper.customerProfileToPersistence(
          user.getCustomerProfile()!,
        );
        await tx.customerProfile.create({ data: profileData });
      }

      // Create seller profile if exists
      if (user.getSellerProfile()) {
        const profileData = PrismaUserMapper.sellerProfileToPersistence(
          user.getSellerProfile()!,
        );
        await tx.sellerProfile.create({ data: profileData });
      }

      // Fetch complete aggregate
      return await tx.user.findUnique({
        where: { id: createdUser.id },
        include: {
          customerProfile: true,
          sellerProfile: true,
        },
      });
    });

    return PrismaUserMapper.toDomain(result);
  }

  async update(user: User): Promise<User> {
    const userData = PrismaUserMapper.toPersistence(user);

    // Use transaction to ensure atomicity
    const result = await this.prisma.$transaction(async (tx) => {
      // Update user
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: userData,
      });

      // Update or create customer profile if exists
      if (user.getCustomerProfile()) {
        const profileData = PrismaUserMapper.customerProfileToPersistence(
          user.getCustomerProfile()!,
        );

        await tx.customerProfile.upsert({
          where: { userId: user.id },
          create: profileData,
          update: profileData,
        });
      }

      // Update or create seller profile if exists
      if (user.getSellerProfile()) {
        const profileData = PrismaUserMapper.sellerProfileToPersistence(
          user.getSellerProfile()!,
        );

        await tx.sellerProfile.upsert({
          where: { userId: user.id },
          create: profileData,
          update: profileData,
        });
      }

      // Fetch complete aggregate
      return await tx.user.findUnique({
        where: { id: updatedUser.id },
        include: {
          customerProfile: true,
          sellerProfile: true,
        },
      });
    });

    return PrismaUserMapper.toDomain(result);
  }

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { id },
      include: {
        customerProfile: true,
        sellerProfile: true,
      },
    });
    if (!record) return null;
    return PrismaUserMapper.toDomain(record);
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { email },
      include: {
        customerProfile: true,
        sellerProfile: true,
      },
    });
    if (!record) return null;
    return PrismaUserMapper.toDomain(record);
  }

  async findByPhone(phone: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { phone },
      include: {
        customerProfile: true,
        sellerProfile: true,
      },
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
        include: {
          customerProfile: true,
          sellerProfile: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users: records.map(PrismaUserMapper.toDomain),
      total,
    };
  }

  async delete(id: string): Promise<void> {
    // Cascade delete will handle profiles if configured in schema
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
