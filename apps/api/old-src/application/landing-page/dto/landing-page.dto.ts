import { ProductDto } from '@/application/product/dtos/product.dto';
import { CategoryDto } from '@/application/category/dtos/category.dto';
import { LandingPage } from '@/domain/landing-page/entities/landing-page.entity';

export class LandingPageDto {
  hero: {
    image: string | null;
    title: string | null;
    subtitle: string | null;
  };

  topCategories: CategoryDto[];

  topProducts: ProductDto[];

  sections: any[];

  static fromEntity(
    entity: Omit<LandingPage, 'id' | 'createdAt' | 'updatedAt'>,
    topProducts: ProductDto[],
    topCategories: CategoryDto[],
    heroImageUrl: string | null,
  ): LandingPageDto {
    return {
      hero: {
        image: heroImageUrl,
        title: entity.heroTitle,
        subtitle: entity.heroSubtitle,
      },
      topCategories: topCategories ?? [],
      topProducts: topProducts ?? [],
      sections: entity.sections ?? [],
    };
  }
}
