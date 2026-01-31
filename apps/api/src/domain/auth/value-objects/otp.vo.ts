export class OTP {
  private constructor(private readonly value: string) {}

  static create(otp: string): OTP {
    if (!otp || otp.length !== 4) {
      throw new Error('OTP must be exactly 4 digits');
    }

    if (!/^\d{4}$/.test(otp)) {
      throw new Error('OTP must contain only digits');
    }

    return new OTP(otp);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: OTP): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
