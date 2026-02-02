import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateVariantStockCommand } from '../update-variant-stock.command';
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';

@CommandHandler(UpdateVariantStockCommand)
export class UpdateVariantStockHandler implements ICommandHandler<UpdateVariantStockCommand> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: UpdateVariantStockCommand): Promise<void> {
    const { variantId, action, quantity } = command;

    const variant = await this.productRepository.findVariantById(variantId);
    if (!variant) {
      throw new NotFoundException(`Variant with ID ${variantId} not found`);
    }

    switch (action) {
      case 'set':
        // Set absolute stock level
        variant.updateStock(quantity);
        break;

      case 'add':
        // Add to existing stock (restock)
        variant.addStock(quantity);
        break;

      case 'reduce':
        // Reduce stock (manual reduction)
        const success = variant.reduceStock(quantity);
        if (!success) {
          throw new BadRequestException(
            `Insufficient stock. Available: ${variant.getStock()}, Requested: ${quantity}`,
          );
        }
        break;

      default:
        throw new BadRequestException(`Invalid action: ${action}`);
    }

    // Persist changes
    await this.productRepository.updateVariant(variant);

    // Note: Status is auto-updated by domain logic
    // (out_of_stock when stock = 0, active when stock > 0)
  }
}
