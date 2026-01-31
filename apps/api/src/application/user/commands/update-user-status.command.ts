import { AccountStatus } from '@/domain/user/enums';

export class UpdateUserStatusCommand {
  constructor(
    public readonly userId: string,
    public readonly status: AccountStatus,
  ) {}
}
