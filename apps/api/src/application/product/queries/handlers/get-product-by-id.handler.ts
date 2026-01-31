import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetProductByIdQuery } from '../get-product-by-id.query';
import { ProductRepository } from '@/domain/product/repositories/product.repository';
import { Product } from '@/domain/product/entities/product.entity';

@QueryHandler(GetProductByIdQuery)
export class GetProductByIdHandler implements IQueryHandler<GetProductByIdQuery> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(query: GetProductByIdQuery): Promise<Product> {
    const product = await this.productRepository.findById(query.productId);

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${query.productId} not found`,
      );
    }

    return product;
  }
}
