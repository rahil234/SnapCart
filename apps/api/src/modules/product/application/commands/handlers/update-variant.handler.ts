import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateVariantCommand } from '../update-variant.command';
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';

@CommandHandler(UpdateVariantCommand)
export class UpdateVariantHandler implements ICommandHandler<UpdateVariantCommand> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateVariantCommand): Promise<void> {
    const {
      variantId,
      variantName,
      price,
      discountPercent,
      stock,
      status,
      isActive,
      sellerProfileId,
      attributes,
      imageUrl,
    } = command;

    const variant = await this.productRepository.findVariantById(variantId);
    if (!variant) {
      throw new NotFoundException(`Variant with ID ${variantId} not found`);
    }

    // Update details
    if (variantName !== undefined || attributes !== undefined || imageUrl !== undefined) {
      variant.updateDetails(variantName, attributes, imageUrl);
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

    // Update seller
    if (sellerProfileId !== undefined) {
      if (sellerProfileId === null) {
        variant.removeSeller();
      } else {
        variant.assignSeller(sellerProfileId);
      }
    }

    // Update status/activation
    if (isActive !== undefined) {
      if (isActive) {
        variant.activate();
      } else {
        variant.deactivate();
      }
    }

    // Note: status is typically auto-managed by business logic,
    // but can be explicitly set if needed
    if (status !== undefined) {
      // Direct status update (use with caution)
      // In most cases, use activate/deactivate methods instead
    }

    // Persist aggregate
    await this.productRepository.updateVariant(variant);

    // TODO: Emit event
    // await this.eventBus.publish(new VariantUpdatedEvent(...));
  }
}
