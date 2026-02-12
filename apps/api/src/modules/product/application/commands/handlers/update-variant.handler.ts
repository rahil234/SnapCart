import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdateVariantCommand } from '../update-variant.command';
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';

@CommandHandler(UpdateVariantCommand)
export class UpdateVariantHandler implements ICommandHandler<UpdateVariantCommand> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: UpdateVariantCommand): Promise<void> {
    const {
      variantId,
      variantName,
      price,
      discountPercent,
      stock,
      isActive,
      attributes,
    } = command;

    const variant = await this.productRepository.findVariantById(variantId);
    if (!variant) {
      throw new NotFoundException(`Variant with ID ${variantId} not found`);
    }

    // Update details (images managed separately)
    if (variantName !== undefined || attributes !== undefined) {
      variant.updateDetails(variantName, attributes);
    }

    // Update pricing
    if (price !== undefined) {
      variant.updatePrice(price);
    }

    if (discountPercent !== undefined) {
      if (discountPercent === 0) {
        variant.removeDiscount();
      } else {
        variant.applyDiscount(discountPercent);
      }
    }

    // Update stock
    if (stock !== undefined) {
      variant.updateStock(stock);
    }

    // Update status/activation
    if (isActive !== undefined) {
      if (isActive) {
        variant.activate();
      } else {
        variant.deactivate();
      }
    }

    // Persist aggregate
    await this.productRepository.updateVariant(variant);
  }
}
