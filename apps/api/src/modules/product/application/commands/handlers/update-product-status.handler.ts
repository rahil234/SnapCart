import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateProductStatusCommand } from '../update-product-status.command';
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';
import { ProductPolicy } from '@/modules/product/domain/policies';
import { ProductStatus } from '@/modules/product/domain/entities/product.entity';

@CommandHandler(UpdateProductStatusCommand)
export class UpdateProductStatusHandler implements ICommandHandler<UpdateProductStatusCommand> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    private readonly productPolicy: ProductPolicy,
  ) {}

  async execute(command: UpdateProductStatusCommand): Promise<void> {
    const { productId, status } = command;

    // Find product
    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Enforce admin rules
    this.productPolicy.enforceAdminStatusUpdate(product);

    // Update status based on the target status
    switch (status) {
      case ProductStatus.ACTIVE:
        product.activate();
        break;
      case ProductStatus.INACTIVE:
        product.deactivate();
        break;
      case ProductStatus.DISCONTINUED:
        product.discontinue();
        break;
      default:
        throw new Error(`Invalid status: ${status}`);
    }

    // Save
    await this.productRepository.updateProduct(product);
  }
}
