import { Command } from '@nestjs/cqrs';

import { User } from '@/modules/user/domain/entities';

export class RegisterCommand extends Command<User> {
  constructor(
    public readonly email: string | null,
    public readonly phone: string | null,
    public readonly password: string,
  ) {
    super();
  }
}
