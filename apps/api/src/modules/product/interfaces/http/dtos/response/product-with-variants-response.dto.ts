import { ApiProperty } from '@nestjs/swagger';

import { Category } from '@/modules/category/domain/entities';
import { Product } from '@/modules/product/domain/entities/product.entity';
import { ProductVariant } from '@/modules/product/domain/entities/product-variant.entity';
import { ProductResponseDto } from '@/modules/product/interfaces/http/dtos/response/product-response.dto';
import { VariantResponseDto } from '@/modules/product/interfaces/http/dtos/response/variant-response.dto';
import { CategoryNestedDto } from '@/modules/product/interfaces/http/dtos/response/product-with-category.dto';

export class ProductWithVariantsResponseDto extends ProductResponseDto {
  @ApiProperty({
    description: 'Category details',
    type: CategoryNestedDto,
  })
  category: CategoryNestedDto;

  @ApiProperty({
    description: 'Sellable variants of the product',
    type: [VariantResponseDto],
  })
  variants: VariantResponseDto[];

  static fromDomainWithVariants(
    product: Product,
    category: Category,
    variants: ProductVariant[],
  ): ProductWithVariantsResponseDto {
    return {
      ...ProductResponseDto.fromDomain(product),
      category: CategoryNestedDto.fromDomain(category),
      variants: variants.map(VariantResponseDto.fromDomain),
    };
  }
}
