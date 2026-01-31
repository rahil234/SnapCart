export class OfferCreatedEvent {
  constructor(
    public readonly offerId: string,
    public readonly name: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}

export class OfferUpdatedEvent {
  constructor(
    public readonly offerId: string,
    public readonly changes: Record<string, any>,
    public readonly occurredAt: Date = new Date(),
  ) {}
}

export class OfferActivatedEvent {
  constructor(
    public readonly offerId: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}

export class OfferDeactivatedEvent {
  constructor(
    public readonly offerId: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}

export class OfferExpiredEvent {
  constructor(
    public readonly offerId: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}
