import { Injectable } from '@nestjs/common';

import { PaginatedResult } from '@/shared/types';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { Product } from '@/modules/product/domain/entities/product.entity';
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';
import { ProductQueryCriteria } from '@/modules/product/application/queries/product-query.criteria';
import { PrismaProductMapper } from '@/modules/product/infrastructure/persistence/mappers/prisma-product.mapper';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(product: Product): Promise<Product> {
    const data = PrismaProductMapper.toPersistence(product);

    const doc = await this.prisma.product.create({ data });

    return PrismaProductMapper.toDomain(doc);
  }

  async update(product: Product): Promise<Product> {
    const data = PrismaProductMapper.toPersistence(product);

    const doc = await this.prisma.product.update({
      where: { id: product.id },
      data,
    });

    return PrismaProductMapper.toDomain(doc);
  }

  async findById(id: string): Promise<Product | null> {
    const record = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!record) return null;

    return PrismaProductMapper.toDomain(record);
  }

  async findAll(): Promise<Product[]> {
    const records = await this.prisma.product.findMany();

    return records.map(PrismaProductMapper.toDomain);
  }

  async findPaginated(
    criteria: ProductQueryCriteria,
  ): Promise<PaginatedResult<Product>> {
    const { page, limit, search, categoryId, status, sortBy, sortOrder } =
      criteria;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [records, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items: records.map(PrismaProductMapper.toDomain),
      total,
      page,
      limit,
    };
  }
}
