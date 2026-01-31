import { UserGender } from '@/modules/user/domain/enums';

export class UpdateUserCommand {
  constructor(
    public readonly userId: string,
    public readonly name?: string,
    public readonly email?: string,
    public readonly phone?: string,
    public readonly dob?: Date,
    public readonly gender?: UserGender,
  ) {}
}
