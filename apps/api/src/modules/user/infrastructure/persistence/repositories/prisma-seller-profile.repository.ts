import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/shared/prisma/prisma.service';
import { SellerProfile } from '@/modules/user/domain/entities/seller-profile.entity';
import { SellerProfileRepository } from '@/modules/user/domain/repositories/seller-profile.repository';
import { PrismaSellerProfileMapper } from '@/modules/user/infrastructure/persistence/mappers/prisma-seller-profile.mapper';

@Injectable()
export class PrismaSellerProfileRepository implements SellerProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(profile: SellerProfile): Promise<SellerProfile> {
    const data = PrismaSellerProfileMapper.toPersistence(profile);
    const doc = await this.prisma.sellerProfile.create({ data });
    return PrismaSellerProfileMapper.toDomain(doc);
  }

  async update(profile: SellerProfile): Promise<SellerProfile> {
    const data = PrismaSellerProfileMapper.toPersistence(profile);
    const doc = await this.prisma.sellerProfile.update({
      where: { id: profile.id },
      data,
    });
    return PrismaSellerProfileMapper.toDomain(doc);
  }

  async findById(id: string): Promise<SellerProfile | null> {
    const record = await this.prisma.sellerProfile.findUnique({
      where: { id },
    });
    if (!record) return null;
    return PrismaSellerProfileMapper.toDomain(record);
  }

  async findByUserId(userId: string): Promise<SellerProfile | null> {
    const record = await this.prisma.sellerProfile.findUnique({
      where: { userId },
    });
    if (!record) return null;
    return PrismaSellerProfileMapper.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.sellerProfile.delete({
      where: { id },
    });
  }
}
