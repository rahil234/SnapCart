import { UserRole } from '@/modules/user/domain/enums';

export class CreateUserCommand {
  constructor(
    public readonly email: string | null,
    public readonly phone: string | null,
    public readonly password: string | null,
    public readonly role: UserRole,
  ) {}
}
