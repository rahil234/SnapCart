import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetVariantByIdQuery } from '../get-variant-by-id.query';
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';
import { ProductVariant } from '@/modules/product/domain/entities/product-variant.entity';

@QueryHandler(GetVariantByIdQuery)
export class GetVariantByIdHandler implements IQueryHandler<GetVariantByIdQuery> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(query: GetVariantByIdQuery): Promise<ProductVariant> {
    const variant = await this.productRepository.findVariantById(query.variantId);

    if (!variant) {
      throw new NotFoundException(
        `Variant with ID ${query.variantId} not found`,
      );
    }

    return variant;
  }
}
