import { Command } from '@nestjs/cqrs';

import { Product } from '@/domain/product/entities';

export class CreateProductCommand extends Command<Product> {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly categoryId: string,
    public readonly price: number,
    public readonly discountPercent?: number | null,
  ) {
    super();
  }
}
