import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { DeactivateProductCommand } from '../deactivate-product.command';
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';
import { ProductPolicy } from '@/modules/product/domain/policies';

@CommandHandler(DeactivateProductCommand)
export class DeactivateProductHandler
  implements ICommandHandler<DeactivateProductCommand>
{
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    private readonly productPolicy: ProductPolicy,
  ) {}

  async execute(command: DeactivateProductCommand): Promise<void> {
    const { productId } = command;

    // Find product
    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Check if product can be modified
    this.productPolicy.canModifyProduct(product);

    // Deactivate product
    product.deactivate();

    // Save
    await this.productRepository.updateProduct(product);
  }
}
