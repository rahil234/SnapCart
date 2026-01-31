import bcrypt from 'bcrypt';
import { Injectable, BadRequestException } from '@nestjs/common';

import { AuthStrategy } from '@/domain/auth/types';
import { PasswordAuthService, PasswordAuthAccount } from '@/domain/auth/types';

@Injectable()
export class PasswordAuthStrategy<
  TAccount extends PasswordAuthAccount,
  TService extends PasswordAuthService<TAccount>,
> implements AuthStrategy<TService, TAccount> {
  async validate(
    accountService: TService,
    identifier: string,
    password: string,
  ): Promise<TAccount> {
    const account =
      (await accountService.findByEmail?.(identifier)) ??
      (await accountService.findByPhone?.(identifier)) ??
      (await accountService.findByUsername?.(identifier));

    if (!account) {
      throw new BadRequestException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, account.password);
    if (!isValid) {
      throw new BadRequestException('Invalid credentials');
    }

    return account;
  }
}
