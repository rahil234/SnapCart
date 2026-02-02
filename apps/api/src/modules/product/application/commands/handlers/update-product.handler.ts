import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';

import { ProductUpdatedEvent } from '@/modules/product/domain/events';
import { UpdateProductCommand } from '@/modules/product/application/commands';
import { ProductStatus } from '@/modules/product/domain/entities/product.entity';
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateProductCommand): Promise<void> {
    const { productId, name, description, brand, categoryId, status } = command;

    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Update identity information
    if (name !== undefined || description !== undefined || brand !== undefined) {
      product.updateInfo(
        name ?? product.getName(),
        description ?? product.getDescription(),
        brand !== undefined ? brand : product.getBrand(),
      );
    }

    // Change category (with business rules)
    if (categoryId !== undefined && categoryId !== product.getCategoryId()) {
      product.changeCategory(categoryId);
    }

    // Update status
    if (status !== undefined && status !== product.getStatus()) {
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
      }
    }

    // Persist aggregate
    await this.productRepository.updateProduct(product);

    // Emit event
    await this.eventBus.publish(
      new ProductUpdatedEvent(product.id, {
        name,
        description,
        brand,
        categoryId,
        status,
      }),
    );
  }
}
