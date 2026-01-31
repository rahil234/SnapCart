import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  ProductRepository,
  ProductCreateInput,
  ProductUpdateInput,
  ProductFindOptions
} from '@/domain/product/repositories/product.repository';
import { Product } from '@/domain/product/entities/product.entity';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(
    @Inject('PrismaService') private readonly prisma: PrismaClient,
  ) {}

  async create(data: ProductCreateInput): Promise<Product> {
    const prismaData = ProductMapper.toPrismaCreate(data);

    const createdProduct = await this.prisma.product.create({
      data: prismaData,
    });

    return ProductMapper.toDomain(createdProduct);
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    return product ? ProductMapper.toDomain(product) : null;
  }

  async find(options: ProductFindOptions): Promise<Product[]> {
    const {
      page = 1,
      limit = 10,
      search,
      categoryId,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (status) {
      where.status = status;
    }

    const products = await this.prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });

    return products.map(ProductMapper.toDomain);
  }

  async count(options?: Partial<ProductFindOptions>): Promise<number> {
    const where: any = {};

    if (options?.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { description: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    if (options?.categoryId) {
      where.categoryId = options.categoryId;
    }

    if (options?.status) {
      where.status = options.status;
    }

    return this.prisma.product.count({ where });
  }

  async update(id: string, data: ProductUpdateInput): Promise<Product> {
    const prismaData = ProductMapper.toPrismaUpdate(data);

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: prismaData,
    });

    return ProductMapper.toDomain(updatedProduct);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.product.count({
      where: { id },
    });

    return count > 0;
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { categoryId },
    });

    return products.map(ProductMapper.toDomain);
  }
}
