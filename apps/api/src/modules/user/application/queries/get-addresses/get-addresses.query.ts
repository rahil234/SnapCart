import { Query } from '@nestjs/cqrs';

import { Address } from '@/modules/user/domain/entities';

export class GetAddressesQuery extends Query<Address[]> {
  constructor(public readonly userId: string) {
    super();
  }
}
