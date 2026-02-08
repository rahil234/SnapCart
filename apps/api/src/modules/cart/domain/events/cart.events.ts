import { IEvent } from '@nestjs/cqrs';

export class CartCreatedEvent implements IEvent {
  constructor(
    public readonly cartId: string,
    public readonly userId: string,
  ) {}
}

export class ItemAddedToCartEvent implements IEvent {
  constructor(
    public readonly cartId: string,
    public readonly itemId: string,
    public readonly productVariantId: string,
    public readonly quantity: number,
  ) {}
}

export class ItemRemovedFromCartEvent implements IEvent {
  constructor(
    public readonly cartId: string,
    public readonly itemId: string,
  ) {}
}

export class ItemQuantityUpdatedEvent implements IEvent {
  constructor(
    public readonly cartId: string,
    public readonly itemId: string,
    public readonly oldQuantity: number,
    public readonly newQuantity: number,
  ) {}
}

export class CartClearedEvent implements IEvent {
  constructor(public readonly cartId: string) {}
}
