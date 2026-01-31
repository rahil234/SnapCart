import { Injectable, BadRequestException, Inject } from '@nestjs/common';

import { OtpService } from '@/domain/otp/services/otp.service';
import { AuthAccount, AuthStrategy, OtpAuthService } from '@/domain/auth/types';

@Injectable()
export class OtpAuthStrategy<
  TAccount extends AuthAccount,
  TService extends OtpAuthService<TAccount>,
> implements AuthStrategy<TService, TAccount> {
  constructor(@Inject() private readonly _otpService: OtpService) {}

  async validate(
    accountService: TService,
    identifier: string,
    otp: string,
  ): Promise<TAccount> {
    const verified = await this._otpService.verifyOTP('LOGIN', identifier, otp);

    if (!verified) {
      throw new BadRequestException('Invalid OTP');
    }

    const account =
      (await accountService.findByEmail?.(identifier)) ??
      (await accountService.findByPhone?.(identifier));

    if (!account) {
      throw new BadRequestException('Account not found');
    }

    return account;
  }
}
