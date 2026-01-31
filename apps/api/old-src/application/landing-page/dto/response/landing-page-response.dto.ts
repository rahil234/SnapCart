import { ApiProperty } from '@nestjs/swagger';

import { LandingPageDto } from '@/application/landing-page/dto/landing-page.dto';
import { ProductDto } from '@/application/product/dtos/product.dto';
import { CategoryDto } from '@/application/category/dtos/category.dto';

export class LandingPageResponseDto {
  @ApiProperty()
  hero: {
    image: string | null;
    title: string | null;
    subtitle: string | null;
  };

  @ApiProperty({ type: [Object] })
  topCategories: CategoryDto[];

  @ApiProperty({ type: [Object] })
  topProducts: ProductDto[];

  @ApiProperty({ type: [Object] })
  sections: any[];

  static fromEntity(entity: LandingPageDto): LandingPageResponseDto {
    return {
      hero: entity.hero,
      topCategories: entity.topCategories ?? [],
      topProducts: entity.topProducts ?? [],
      sections: entity.sections ?? [],
    };
  }
}
