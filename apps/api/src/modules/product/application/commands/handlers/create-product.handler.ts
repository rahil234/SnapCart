import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateProductCommand } from '../create-product.command';
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';
import { Product } from '@/modules/product/domain/entities/product.entity';
import { ProductCreatedEvent } from '@/modules/product/domain/events';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateProductCommand): Promise<Product> {
    const { name, description, categoryId, price, discountPercent } = command;

    // Create domain entity using factory method (with business validation)
    const product = Product.create(
      name,
      description,
      categoryId,
      price,
      discountPercent,
    );

    // Persist the product
    const createdProduct = await this.productRepository.save(product);

    // Emit domain event
    await this.eventBus.publish(
      new ProductCreatedEvent(
        createdProduct.id,
        createdProduct.getName(),
        createdProduct.getCategoryId(),
        createdProduct.getPrice(),
      ),
    );

    return createdProduct;
  }
}
