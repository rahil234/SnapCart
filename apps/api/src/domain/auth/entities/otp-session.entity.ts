import { v4 as uuid } from 'uuid';

export class OTPSession {
  private constructor(
    public readonly id: string,
    private identifier: string, // email or phone
    private otpCode: string,
    private expiresAt: Date,
    private isVerified: boolean,
    private attempts: number,
    public readonly createdAt: Date,
  ) {}

  // Factory method for creating new OTP session
  static create(identifier: string, otpCode: string, validityMinutes: number = 5): OTPSession {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + validityMinutes);

    return new OTPSession(
      uuid(),
      identifier,
      otpCode,
      expiresAt,
      false,
      0,
      new Date(),
    );
  }

  // Factory method for reconstructing from persistence
  static from(
    id: string,
    identifier: string,
    otpCode: string,
    expiresAt: Date,
    isVerified: boolean,
    attempts: number,
    createdAt: Date,
  ): OTPSession {
    return new OTPSession(id, identifier, otpCode, expiresAt, isVerified, attempts, createdAt);
  }

  // Business methods
  verify(providedOtp: string): boolean {
    if (this.isExpired()) {
      throw new Error('OTP has expired');
    }

    if (this.isVerified) {
      throw new Error('OTP already verified');
    }

    if (this.attempts >= 3) {
      throw new Error('Maximum OTP attempts exceeded');
    }

    this.attempts++;

    if (this.otpCode === providedOtp) {
      this.isVerified = true;
      return true;
    }

    return false;
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  markAsVerified(): void {
    this.isVerified = true;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getIdentifier(): string {
    return this.identifier;
  }

  getOtpCode(): string {
    return this.otpCode;
  }

  getExpiresAt(): Date {
    return this.expiresAt;
  }

  getIsVerified(): boolean {
    return this.isVerified;
  }

  getAttempts(): number {
    return this.attempts;
  }
}
