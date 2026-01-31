import { AuthMethod } from '@/domain/auth/enums';

export class LoginCommand {
  constructor(
    public readonly identifier: string,
    public readonly method: AuthMethod,
    public readonly password?: string,
    public readonly otp?: string,
  ) {}
}
