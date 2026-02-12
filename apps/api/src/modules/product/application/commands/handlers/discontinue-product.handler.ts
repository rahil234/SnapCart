import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DiscontinueProductCommand } from '../discontinue-product.command';
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';

@CommandHandler(DiscontinueProductCommand)
export class DiscontinueProductHandler implements ICommandHandler<DiscontinueProductCommand> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: DiscontinueProductCommand): Promise<void> {
    const { productId } = command;

    // Find product
    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Admin can discontinue even if product is already discontinued
    // but not if it's deleted
    if (product.getIsDeleted()) {
      throw new NotFoundException('Cannot discontinue deleted product');
    }

    // Discontinue product (one-way operation)
    product.discontinue();

    // Save
    await this.productRepository.updateProduct(product);
  }
}
