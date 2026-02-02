import { ApiProperty } from '@nestjs/swagger';

import { Product } from '@/modules/product/domain/entities/product.entity';
import { ProductVariant } from '@/modules/product/domain/entities/product-variant.entity';
import { ProductResponseDto } from '@/modules/product/interfaces/http/dtos/response/product-response.dto';
import { VariantResponseDto } from '@/modules/product/interfaces/http/dtos/response/variant-response.dto';

export class ProductWithVariantsResponseDto {
  @ApiProperty({
    description: 'Product catalog information',
    type: ProductResponseDto,
  })
  product: ProductResponseDto;

  @ApiProperty({
    description: 'Sellable variants of the product',
    type: [VariantResponseDto],
  })
  variants: VariantResponseDto[];

  static fromDomain(
    product: Product,
    variants: ProductVariant[],
  ): ProductWithVariantsResponseDto {
    return {
      product: ProductResponseDto.fromDomain(product),
      variants: variants.map(VariantResponseDto.fromDomain),
    };
  }
}
