export class CategoryCreatedEvent {
  constructor(
    public readonly categoryId: string,
    public readonly name: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}

export class CategoryUpdatedEvent {
  constructor(
    public readonly categoryId: string,
    public readonly changes: Record<string, any>,
    public readonly occurredAt: Date = new Date(),
  ) {}
}

export class CategoryDeletedEvent {
  constructor(
    public readonly categoryId: string,
    public readonly name: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}
