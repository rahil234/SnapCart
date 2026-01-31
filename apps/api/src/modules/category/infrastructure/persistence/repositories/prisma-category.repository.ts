import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/shared/prisma/prisma.service';
import { Category } from '@/modules/category/domain/entities/category.entity';
import { CategoryRepository } from '@/modules/category/domain/repositories/category.repository';
import { PrismaCategoryMapper } from '@/modules/category/infrastructure/persistence/mappers/prisma-category.mapper';

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(category: Category): Promise<Category> {
    const data = PrismaCategoryMapper.toPersistence(category);

    const doc = await this.prisma.category.create({ data });

    return PrismaCategoryMapper.toDomain(doc);
  }

  async update(category: Category): Promise<Category> {
    const data = PrismaCategoryMapper.toPersistence(category);

    const doc = await this.prisma.category.update({
      where: { id: category.id },
      data,
    });

    return PrismaCategoryMapper.toDomain(doc);
  }

  async findById(id: string): Promise<Category | null> {
    const record = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!record) return null;

    return PrismaCategoryMapper.toDomain(record);
  }

  async findAll(): Promise<Category[]> {
    const records = await this.prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return records.map(PrismaCategoryMapper.toDomain);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({
      where: { id },
    });
  }
}
