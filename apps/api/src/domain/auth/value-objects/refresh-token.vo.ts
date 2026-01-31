export class RefreshToken {
  private constructor(
    private readonly value: string,
    private readonly expiresAt: Date,
  ) {}

  static create(value: string, expiresAt: Date): RefreshToken {
    if (!value) {
      throw new Error('Refresh token value cannot be empty');
    }

    return new RefreshToken(value, expiresAt);
  }

  getValue(): string {
    return this.value;
  }

  getExpiresAt(): Date {
    return this.expiresAt;
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  equals(other: RefreshToken): boolean {
    return this.value === other.value;
  }
}
