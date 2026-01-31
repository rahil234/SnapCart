import { Injectable } from '@nestjs/common';

import { OtpService } from '@/domain/otp/services/otp.service';
import { AuthAccount, OtpAuthService } from '@/domain/auth/types';
import { OtpAuthStrategy } from './otp.strategy';

@Injectable()
export class OtpStrategyProvider {
  private readonly strategy: OtpAuthStrategy<AuthAccount, OtpAuthService>;
  constructor(private readonly _otpService: OtpService) {
    this.strategy = new OtpAuthStrategy(this._otpService);
  }

  validate<
    TAccount extends AuthAccount,
    TService extends OtpAuthService<TAccount>,
  >(service: TService, identifier: string, otp: string) {
    return this.strategy.validate(service, identifier, otp);
  }
}
