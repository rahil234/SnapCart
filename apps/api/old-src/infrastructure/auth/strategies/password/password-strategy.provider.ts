import { Injectable } from '@nestjs/common';

import { PasswordAuthStrategy } from './password.strategy';
import { PasswordAuthService, PasswordAuthAccount } from '@/domain/auth/types';

@Injectable()
export class PasswordStrategyProvider {
  private readonly strategy = new PasswordAuthStrategy();

  validate<
    TAccount extends PasswordAuthAccount,
    TService extends PasswordAuthService<TAccount>,
  >(service: TService, identifier: string, password: string) {
    return this.strategy.validate(service, identifier, password);
  }
}
