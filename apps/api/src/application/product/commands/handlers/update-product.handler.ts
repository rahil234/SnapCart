import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';

import { ProductUpdatedEvent } from '@/domain/product/events';
import { UpdateProductCommand } from '@/application/product/commands';
import { ProductStatus } from '@/domain/product/entities/product.entity';
import { ProductRepository } from '@/domain/product/repositories/product.repository';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateProductCommand): Promise<void> {
    const { productId, name, description, price, discountPercent, status } =
      command;

    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Domain behavior
    if (name !== undefined || description !== undefined) {
      product.updateDetails(
        name ?? product.getName(),
        description ?? product.getDescription(),
      );
    }

    if (price !== undefined) {
      product.updatePrice(price);
    }

    if (discountPercent !== undefined) {
      if (discountPercent === null || discountPercent === 0) {
        product.removeDiscount();
      } else {
        product.applyDiscount(discountPercent);
      }
    }

    if (status !== undefined) {
      switch (status) {
        case ProductStatus.ACTIVE:
          product.activate();
          break;
        case ProductStatus.INACTIVE:
          product.deactivate();
          break;
        case ProductStatus.OUT_OF_STOCK:
          product.markOutOfStock();
          break;
        case ProductStatus.DISCONTINUED:
          product.discontinue();
          break;
      }
    }

    // Persist aggregate
    await this.productRepository.update(product);

    // Emit event
    await this.eventBus.publish(
      new ProductUpdatedEvent(product.id, {
        name,
        description,
        price,
        discountPercent,
        status,
      }),
    );
  }
}
