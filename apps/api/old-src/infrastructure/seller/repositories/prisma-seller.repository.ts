import { Inject } from '@nestjs/common';
import { Seller as PrismaSeller } from '@prisma/client';

import { SellerMapper } from '@/infrastructure/seller/persistence/mappers';
import { PrismaService } from '@/common/prisma/prisma.service';
import { Seller as SellerEntity } from '@/domain/seller/entities/seller.entity';
import { ISellerRepository } from '@/infrastructure/seller/repositories/interfaces/seller.repository';

export class PrismaSellerRepository implements ISellerRepository {
  constructor(
    @Inject('PrismaService') private readonly prisma: PrismaService,
  ) {}

  async create(
    data: Omit<PrismaSeller, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<SellerEntity> {
    const doc = await this.prisma.seller.create({
      data: SellerMapper.toPersistence(data),
    });
    return SellerMapper.toEntity(doc);
  }

  async findAll(): Promise<SellerEntity[]> {
    const docs = await this.prisma.seller.findMany();
    return docs.map(SellerMapper.toEntity);
  }

  async findById(id: string): Promise<SellerEntity | null> {
    const doc = await this.prisma.seller.findUnique({
      where: { id },
    });
    return doc ? SellerMapper.toEntity(doc) : null;
  }

  async findByEmail(email: string): Promise<SellerEntity | null> {
    const doc = await this.prisma.seller.findUnique({
      where: { email },
    });
    return doc ? SellerMapper.toEntity(doc) : null;
  }

  async update(
    id: string,
    data: Pick<SellerEntity, 'name' | 'email' | 'password'>,
  ): Promise<SellerEntity> {
    const doc = await this.prisma.seller.update({
      where: { id },
      data: SellerMapper.toPersistence(data),
    });
    return SellerMapper.toEntity(doc);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.seller.delete({
      where: { id },
    });
  }
}
