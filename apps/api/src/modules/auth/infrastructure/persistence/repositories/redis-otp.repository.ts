import { RedisClientType } from 'redis';
import { Injectable, Inject } from '@nestjs/common';

import { OTPSession } from '@/modules/auth/domain/entities';
import { OTPRepository } from '@/modules/auth/domain/repositories';
import { REDIS_CLIENT } from '@/shared/infrastructure/redis/redis.provider';

@Injectable()
export class RedisOTPRepository implements OTPRepository {
  private readonly OTP_KEY_PREFIX = 'otp:';
  private readonly OTP_IDENTIFIER_INDEX = 'otp:identifier:';
  private readonly DEFAULT_TTL = 300; // 5 minutes in seconds

  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: RedisClientType,
  ) {}

  async save(session: OTPSession): Promise<OTPSession> {
    const key = this.getSessionKey(session.id);
    const identifierKey = this.getIdentifierKey(session.getIdentifier());

    // Serialize the session
    const sessionData = {
      id: session.id,
      identifier: session.getIdentifier(),
      otpCode: session.getOtpCode(),
      expiresAt: session.getExpiresAt().toISOString(),
      isVerified: session.getIsVerified(),
      attempts: session.getAttempts(),
      createdAt: session.createdAt.toISOString(),
    };

    // Store session with TTL
    await this.redis.set(key, JSON.stringify(sessionData), {
      EX: this.DEFAULT_TTL,
    });

    // Add to identifier index (sorted set by timestamp)
    await this.redis.zAdd(identifierKey, {
      score: session.createdAt.getTime(),
      value: session.id,
    });

    // Set TTL on identifier index
    await this.redis.expire(identifierKey, this.DEFAULT_TTL);

    return session;
  }

  async findByIdentifier(identifier: string): Promise<OTPSession | null> {
    const identifierKey = this.getIdentifierKey(identifier);

    // Get all session IDs for this identifier, sorted by timestamp (descending)
    const sessionIds = await this.redis.zRange(identifierKey, 0, -1, {
      REV: true,
    });

    if (sessionIds.length === 0) {
      return null;
    }

    // Get the most recent session
    const sessionKey = this.getSessionKey(sessionIds[0]);
    const sessionData = await this.redis.get(sessionKey);

    if (!sessionData) {
      return null;
    }

    return this.deserializeSession(sessionData);
  }

  async findLatestByIdentifier(identifier: string): Promise<OTPSession | null> {
    const identifierKey = this.getIdentifierKey(identifier);

    // Get all session IDs for this identifier
    const sessionIds = await this.redis.zRange(identifierKey, 0, -1, {
      REV: true,
    });

    if (sessionIds.length === 0) {
      return null;
    }

    // Find the first non-expired session
    for (const sessionId of sessionIds) {
      const sessionKey = this.getSessionKey(sessionId);
      const sessionData = await this.redis.get(sessionKey);

      if (sessionData) {
        const session = this.deserializeSession(sessionData);
        if (!session.isExpired()) {
          return session;
        }
      }
    }

    return null;
  }

  async delete(id: string): Promise<void> {
    const key = this.getSessionKey(id);

    // Get session first to remove from identifier index
    const sessionData = await this.redis.get(key);

    if (sessionData) {
      const session = this.deserializeSession(sessionData);
      const identifierKey = this.getIdentifierKey(session.getIdentifier());

      // Remove from identifier index
      await this.redis.zRem(identifierKey, id);
    }

    // Delete the session
    await this.redis.del(key);
  }

  private getSessionKey(sessionId: string): string {
    return `${this.OTP_KEY_PREFIX}${sessionId}`;
  }

  private getIdentifierKey(identifier: string): string {
    return `${this.OTP_IDENTIFIER_INDEX}${identifier}`;
  }

  private deserializeSession(data: string): OTPSession {
    const parsed = JSON.parse(data);
    return OTPSession.from(
      parsed.id,
      parsed.identifier,
      parsed.otpCode,
      new Date(parsed.expiresAt),
      parsed.isVerified,
      parsed.attempts,
      new Date(parsed.createdAt),
    );
  }
}
