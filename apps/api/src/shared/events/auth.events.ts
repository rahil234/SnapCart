import { ActorType, AuthMethod } from '@/modules/auth/domain/enums';

export class UserLoggedInEvent {
  constructor(
    public readonly userId: string,
    public readonly actorType: ActorType,
    public readonly authMethod: AuthMethod,
    public readonly occurredAt: Date = new Date(),
  ) {}
}

export class UserRegisteredEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string | null,
    public readonly phone: string | null,
    public readonly occurredAt: Date = new Date(),
  ) {}
}

export class OTPRequestedEvent {
  constructor(
    public readonly identifier: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}

export class OTPVerifiedEvent {
  constructor(
    public readonly identifier: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}

export class RefreshTokenIssuedEvent {
  constructor(
    public readonly userId: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}

export class UserLoggedOutEvent {
  constructor(
    public readonly userId: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}

export class PasswordChangedEvent {
  constructor(
    public readonly userId: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}

export class PasswordResetEvent {
  constructor(
    public readonly userId: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}

