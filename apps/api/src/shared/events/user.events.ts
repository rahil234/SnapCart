import { UserRole } from '@/modules/user/domain/enums';

export class UserCreatedEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string | null,
    public readonly phone: string | null,
    public readonly role: UserRole,
    public readonly occurredAt: Date = new Date(),
  ) {}
}

export class UserUpdatedEvent {
  constructor(
    public readonly userId: string,
    public readonly changes: Record<string, any>,
    public readonly occurredAt: Date = new Date(),
  ) {}
}

export class UserStatusChangedEvent {
  constructor(
    public readonly userId: string,
    public readonly oldStatus: string,
    public readonly newStatus: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}

export class UserRoleChangedEvent {
  constructor(
    public readonly userId: string,
    public readonly oldRole: UserRole,
    public readonly newRole: UserRole,
    public readonly occurredAt: Date = new Date(),
  ) {}
}

export class CustomerProfileCreatedEvent {
  constructor(
    public readonly profileId: string,
    public readonly userId: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}

export class SellerProfileCreatedEvent {
  constructor(
    public readonly profileId: string,
    public readonly userId: string,
    public readonly storeName: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}

export class SellerVerifiedEvent {
  constructor(
    public readonly profileId: string,
    public readonly userId: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}
