import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '@/common/prisma/prisma.service';
import { LandingPage } from '@/domain/landing-page/entities/landing-page.entity';
import { LandingPageMapper } from '@/landing-page/mappers/landing-page.mapper';
import { ILandingPageRepository } from '@/infrastructure/landing-page/repositories/interfaces/landing-page.repository';

@Injectable()
export class PrismaLandingPageRepository implements ILandingPageRepository {
  constructor(
    @Inject('PrismaService') private readonly _prisma: PrismaService,
  ) {}

  async get(): Promise<LandingPage | null> {
    const doc = await this._prisma.landingPage.findFirst();
    return doc ? LandingPageMapper.toEntity(doc) : null;
  }

  async update(data: Partial<LandingPage>): Promise<LandingPage> {
    const existing = await this.get();

    if (!existing) {
      const created = await this._prisma.landingPage.create({
        data: {
          heroTitle: data.heroTitle ?? null,
          heroSubtitle: data.heroSubtitle ?? null,
          topCategoryIds: data.topCategoryIds ?? [],
          topProductIds: data.topProductIds ?? [],
          sections: data.sections ?? [],
        },
      });
      return LandingPageMapper.toEntity(created);
    }

    const updated = await this._prisma.landingPage.update({
      where: { id: existing.id },
      data,
    });

    return LandingPageMapper.toEntity(updated);
  }
}
