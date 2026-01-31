import { Inject, Injectable } from '@nestjs/common';

import { MediaService } from '@/domain/media/services/media.service';
import { ProductService } from '@/domain/product/services/product.service';
import { LandingPageDto } from '@/landing-page/dto/landing-page.dto';
// Removed - use QueryBus instead
// import { CategoryService } from '@/domain/category/services';
import { UpdateLandingPageDto } from '@/landing-page/dto/request/update-landing-page.dto';
import { ILandingPageRepository } from '@/infrastructure/landing-page/repositories/interfaces/landing-page.repository';
import { QueryBus } from '@nestjs/cqrs';

@Injectable()
export class LandingPageService {
  constructor(
    @Inject('LandingPageRepository')
    private readonly _landingPageRepository: ILandingPageRepository,
    private readonly queryBus: QueryBus,
    private readonly _mediaService: MediaService,
  ) {}

  async getLandingPage(): Promise<LandingPageDto> {
    const config = await this._landingPageRepository.get();

    if (!config)
      return LandingPageDto.fromEntity(
        {
          heroTitle: null,
          heroSubtitle: null,
          sections: [],
          topCategoryIds: [],
          topProductIds: [],
        },
        [],
        [],
        null,
      );

    const topCategories = await Promise.all(
      config.topCategoryIds.map(
        async (id) => await this._categoryService.findOne(id),
      ),
    );

    const topProducts = await Promise.all(
      config.topProductIds.map(
        async (id) => await this._productService.findById(id),
      ),
    );

    const { readUrl } = this._mediaService.getHeroImageReadUrl();

    return LandingPageDto.fromEntity(
      config,
      topProducts,
      topCategories,
      readUrl,
    );
  }

  async updateLandingPage(dto: UpdateLandingPageDto): Promise<void> {
    await this._landingPageRepository.update(dto);
  }
}
