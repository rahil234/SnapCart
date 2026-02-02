import { Query } from '@nestjs/cqrs';

import { GetMeResult } from '@/modules/user/application/queries/get-me/get-me.result';

export class GetMeQuery extends Query<GetMeResult> {
  constructor(public readonly userId: string) {
    super();
  }
}
