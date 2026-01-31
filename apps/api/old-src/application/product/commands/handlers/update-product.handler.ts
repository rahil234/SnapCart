import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateProductCommand } from '../update-product.command';
import { ProductRepository } from '@/domain/product/repositories/product.repository';
import { Product, ProductStatus } from '@/domain/product/entities/product.entity';
import { ProductUpdatedEvent } from '@/domain/product/events';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateProductCommand): Promise<Product> {
    const { productId, name, description, price, discountPercent, tryOn, status } = command;

    // Fetch existing product
    const existingProduct = await this.productRepository.findById(productId);
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Apply business logic through domain entity
    if (name !== undefined || description !== undefined) {
      existingProduct.updateDetails(
        name || existingProduct.getName(),
        description || existingProduct.getDescription(),
      );
    }

    if (price !== undefined) {
      existingProduct.updatePrice(price);
    }

    if (discountPercent !== undefined) {
      if (discountPercent === null || discountPercent === 0) {
        existingProduct.removeDiscount();
      } else {
        existingProduct.applyDiscount(discountPercent);
      }
    }

    if (tryOn !== undefined) {
      if (tryOn) {
        existingProduct.enableTryOn();
      } else {
        existingProduct.disableTryOn();
      }
    }

    if (status !== undefined) {
      switch (status) {
        case ProductStatus.ACTIVE:
          existingProduct.activate();
          break;
        case ProductStatus.INACTIVE:
          existingProduct.deactivate();
          break;
        case ProductStatus.OUT_OF_STOCK:
          existingProduct.markOutOfStock();
          break;
        case ProductStatus.DISCONTINUED:
          existingProduct.discontinue();
          break;
      }
    }

    // Persist changes
    const updatedProduct = await this.productRepository.update(productId, {
      name: existingProduct.getName(),
      description: existingProduct.getDescription(),
      price: existingProduct.getPrice(),
      discountPercent: existingProduct.getDiscountPercent(),
      tryOn: existingProduct.isTryOnEnabled(),
      status: existingProduct.getStatus(),
    });

    // Emit domain event
    const changes = {
      name,
      description,
      price,
      discountPercent,
      tryOn,
      status,
    };

    await this.eventBus.publish(
      new ProductUpdatedEvent(productId, changes),
    );

    return updatedProduct;
  }
}
