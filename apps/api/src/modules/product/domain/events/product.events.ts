export class ProductCreatedEvent {
  constructor(
    public readonly productId: string,
    public readonly name: string,
    public readonly categoryId: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}

export class ProductUpdatedEvent {
  constructor(
    public readonly productId: string,
    public readonly changes: Record<string, any>,
    public readonly occurredAt: Date = new Date(),
  ) {}
}

export class ProductDiscontinuedEvent {
  constructor(
    public readonly productId: string,
    public readonly name: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}
