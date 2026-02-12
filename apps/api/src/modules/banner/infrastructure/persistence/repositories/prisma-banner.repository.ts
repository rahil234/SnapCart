import { Injectable } from '@nestjs/common';

import { Banner } from '@/modules/banner/domain/entities';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { BannerRepository } from '@/modules/banner/domain/repositories';

@Injectable()
export class PrismaBannerRepository implements BannerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(banner: Banner): Promise<Banner> {
    const data = await this.prisma.banner.create({
      data: {
        id: banner.getId(),
        imageUrl: banner.getImageUrl(),
        order: banner.getOrder(),
        isActive: banner.getIsActive(),
      },
    });

    return this.toDomain(data);
  }

  async update(banner: Banner): Promise<Banner> {
    const data = await this.prisma.banner.update({
      where: { id: banner.getId() },
      data: {
        imageUrl: banner.getImageUrl(),
        order: banner.getOrder(),
        isActive: banner.getIsActive(),
      },
    });

    return this.toDomain(data);
  }

  async findById(id: string): Promise<Banner | null> {
    const data = await this.prisma.banner.findUnique({
      where: { id },
    });

    return data ? this.toDomain(data) : null;
  }

  async findAll(): Promise<Banner[]> {
    const data = await this.prisma.banner.findMany({
      orderBy: { order: 'asc' },
    });

    return data.map(this.toDomain);
  }

  async findActive(): Promise<Banner[]> {
    const data = await this.prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    return data.map(this.toDomain);
  }

  async findByOrder(order: number): Promise<Banner | null> {
    const data = await this.prisma.banner.findFirst({
      where: { order },
    });

    return data ? this.toDomain(data) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.banner.delete({
      where: { id },
    });
  }

  async updateOrders(banners: { id: string; order: number }[]): Promise<void> {
    await this.prisma.$transaction(
      banners.map(({ id, order }) =>
        this.prisma.banner.update({
          where: { id },
          data: { order },
        }),
      ),
    );
  }

  async getMaxOrder(): Promise<number> {
    const result = await this.prisma.banner.aggregate({
      _max: { order: true },
    });

    return result._max.order ?? 0;
  }

  private toDomain(data: {
    id: string;
    imageUrl: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Banner {
    return Banner.from(
      data.id,
      data.imageUrl,
      data.order,
      data.isActive,
      data.createdAt,
      data.updatedAt,
    );
  }
}
