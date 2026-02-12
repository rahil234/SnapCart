import { Query } from '@nestjs/cqrs';

import { User } from '@/modules/user/domain/entities';

export class GetUserByIdQuery extends Query<User> {
  constructor(public readonly userId: string) {
    super();
  }
}
