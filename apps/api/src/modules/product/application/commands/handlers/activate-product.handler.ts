import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { ActivateProductCommand } from '../activate-product.command';
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';
import { ProductPolicy } from '@/modules/product/domain/policies';

@CommandHandler(ActivateProductCommand)
export class ActivateProductHandler
  implements ICommandHandler<ActivateProductCommand>
{
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    private readonly productPolicy: ProductPolicy,
  ) {}

  async execute(command: ActivateProductCommand): Promise<void> {
    const { productId } = command;

    // Find product
    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Check if product can be modified
    this.productPolicy.canModifyProduct(product);

    // Activate product
    product.activate();

    // Save
    await this.productRepository.updateProduct(product);
  }
}
