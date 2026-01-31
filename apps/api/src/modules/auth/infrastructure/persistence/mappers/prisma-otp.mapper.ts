import { OTPSession } from '@/modules/auth/domain/entities';

export class PrismaOTPMapper {
  // DB → Domain
  static toDomain(raw: any): OTPSession {
    return OTPSession.from(
      raw.id,
      raw.identifier,
      raw.otpCode,
      raw.expiresAt,
      raw.isVerified,
      raw.attempts,
      raw.createdAt,
    );
  }

  // Domain → DB
  static toPersistence(session: OTPSession) {
    return {
      id: session.id,
      identifier: session.getIdentifier(),
      otpCode: session.getOtpCode(),
      expiresAt: session.getExpiresAt(),
      isVerified: session.getIsVerified(),
      attempts: session.getAttempts(),
      createdAt: session.createdAt,
    };
  }
}
