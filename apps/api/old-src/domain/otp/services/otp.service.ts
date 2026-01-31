import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { RedisClientType } from 'redis';
import crypto from 'crypto';

import {
  OTP_TTL_SECONDS,
  OTP_MAX_ATTEMPTS,
  OTP_DAILY_LIMIT,
  OTP_LENGTH,
  DEFAULT_DEV_OTP,
} from '@/otp/otp.constants';
import { OTPEntry, OTPPurpose } from '@/otp/otp.interface';

@Injectable()
export class OtpService {
  private readonly _isProd: boolean = true;
  constructor(private readonly redisClient: RedisClientType) {
    const configService = new ConfigService();
    this._isProd = configService.get<string>('NODE_ENV') === 'production';
  }

  private generateNumericOTP(length = 4): string {
    return Array.from({ length }, () => crypto.randomInt(0, 10)).join('');
  }

  private hashOTP(otp: string): string {
    return crypto
      .createHmac('sha256', process.env.OTP_HMAC_SECRET || 'default_secret')
      .update(otp)
      .digest('hex');
  }

  private getRedisKey(purpose: OTPPurpose, identifier: string): string {
    return `otp:${purpose}:${identifier}`;
  }

  private getDailyCounterKey(purpose: OTPPurpose, identifier: string): string {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return `otp:count:${purpose}:${identifier}:${date}`;
  }

  private getSecondsUntilMidnight(): number {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return Math.floor((midnight.getTime() - now.getTime()) / 1000);
  }

  async generateOTP(
    purpose: OTPPurpose,
    identifier: string,
  ): Promise<{ otp: string }> {
    // 🔹 Check daily limit
    const counterKey = this.getDailyCounterKey(purpose, identifier);
    const currentCount = await this.redisClient.get(counterKey);
    const sentCount = parseInt(currentCount || '0', 10);

    if (sentCount >= OTP_DAILY_LIMIT)
      throw new BadRequestException(
        `OTP request limit reached (${OTP_DAILY_LIMIT}/day)`,
      );

    // 🔹 Increment counter and set TTL if first time today
    const ttl = this.getSecondsUntilMidnight();
    await this.redisClient
      .multi()
      .incr(counterKey)
      .expire(counterKey, ttl)
      .exec();

    // 🔹 Generate OTP
    const otp = this._isProd
      ? this.generateNumericOTP(OTP_LENGTH)
      : DEFAULT_DEV_OTP;
    const otpHash = this.hashOTP(otp);

    const entry: OTPEntry = {
      otpHash,
      attempts: 0,
      used: false,
      purpose,
      identifier,
      expiresAt: Date.now() + OTP_TTL_SECONDS * 1000,
    };

    await this.redisClient.set(
      this.getRedisKey(purpose, identifier),
      JSON.stringify(entry),
      { EX: OTP_TTL_SECONDS },
    );

    return { otp };
  }

  async verifyOTP(
    purpose: OTPPurpose,
    identifier: string,
    providedOtp: string,
  ): Promise<boolean> {
    const key = this.getRedisKey(purpose, identifier);
    console.log(key);
    const data = await this.redisClient.get(key);
    if (!data) throw new BadRequestException('OTP expired or not found');

    const entry = JSON.parse(data) as OTPEntry;
    if (entry.attempts >= OTP_MAX_ATTEMPTS)
      throw new BadRequestException('Too many attempts');

    const providedHash = this.hashOTP(String(providedOtp));
    const valid = crypto.timingSafeEqual(
      Buffer.from(providedHash, 'hex'),
      Buffer.from(entry.otpHash, 'hex'),
    );

    if (valid && entry.used) throw new BadRequestException('OTP already used');

    if (!valid) {
      entry.attempts += 1;
      await this.redisClient.set(key, JSON.stringify(entry), {
        EX: Math.ceil((entry.expiresAt - Date.now()) / 1000),
      });
      throw new BadRequestException('Invalid OTP');
    }

    entry.used = true;
    await this.redisClient.set(key, JSON.stringify(entry), { EX: 60 });
    return true;
  }
}
