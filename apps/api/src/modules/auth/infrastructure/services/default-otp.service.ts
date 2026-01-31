import { Injectable } from '@nestjs/common';
import { OTPService } from '@/modules/auth/domain/services/otp.service';

@Injectable()
export class DefaultOTPService implements OTPService {
  generate(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  async send(identifier: string, otp: string): Promise<void> {
    // TODO: Implement actual OTP sending (SMS/Email)
    console.log(`Sending OTP ${otp} to ${identifier}`);
    // For now, just log it. In production, use SMS service or email service
  }
}
