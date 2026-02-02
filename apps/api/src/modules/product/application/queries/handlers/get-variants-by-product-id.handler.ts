import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetVariantsByProductIdQuery } from '../get-variants-by-product-id.query';
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';
import { ProductVariant } from '@/modules/product/domain/entities/product-variant.entity';

@QueryHandler(GetVariantsByProductIdQuery)
export class GetVariantsByProductIdHandler implements IQueryHandler<GetVariantsByProductIdQuery> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(query: GetVariantsByProductIdQuery): Promise<ProductVariant[]> {
    // Return all variants for the product (including inactive for admin view)
    const variants = await this.productRepository.findVariantsByProductId(query.productId);
    return variants;
  }
}
