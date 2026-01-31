import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/shared/prisma/prisma.service';
import { CustomerProfile } from '@/domain/user/entities/customer-profile.entity';
import { CustomerProfileRepository } from '@/domain/user/repositories/customer-profile.repository';
import { PrismaCustomerProfileMapper } from '@/infrastructure/user/persistence/mappers/prisma-customer-profile.mapper';

@Injectable()
export class PrismaCustomerProfileRepository implements CustomerProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(profile: CustomerProfile): Promise<CustomerProfile> {
    const data = PrismaCustomerProfileMapper.toPersistence(profile);
    const doc = await this.prisma.customerProfile.create({ data });
    return PrismaCustomerProfileMapper.toDomain(doc);
  }

  async update(profile: CustomerProfile): Promise<CustomerProfile> {
    const data = PrismaCustomerProfileMapper.toPersistence(profile);
    const doc = await this.prisma.customerProfile.update({
      where: { id: profile.id },
      data,
    });
    return PrismaCustomerProfileMapper.toDomain(doc);
  }

  async findById(id: string): Promise<CustomerProfile | null> {
    const record = await this.prisma.customerProfile.findUnique({
      where: { id },
    });
    if (!record) return null;
    return PrismaCustomerProfileMapper.toDomain(record);
  }

  async findByUserId(userId: string): Promise<CustomerProfile | null> {
    const record = await this.prisma.customerProfile.findUnique({
      where: { userId },
    });
    if (!record) return null;
    return PrismaCustomerProfileMapper.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.customerProfile.delete({
      where: { id },
    });
  }
}
