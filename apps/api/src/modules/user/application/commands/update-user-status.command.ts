import { AccountStatus } from '@/modules/user/domain/enums';

export class UpdateUserStatusCommand {
  constructor(
    public readonly userId: string,
    public readonly status: AccountStatus,
  ) {}
}
