import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetMeQuery } from '@/modules/user/application/queries/get-me/get-me.query';
import { GetMeResult } from '@/modules/user/application/queries/get-me/get-me.result';
import { MeReadRepository } from '@/modules/user/application/repositories/me-read.repository';

@QueryHandler(GetMeQuery)
export class GetMeHandler implements IQueryHandler<GetMeQuery> {
  constructor(
    @Inject('MeReadRepository')
    private readonly meReadRepo: MeReadRepository,
  ) {}

  async execute(query: GetMeQuery): Promise<GetMeResult> {
    const me = await this.meReadRepo.getMeByUserId(query.userId);

    if (!me) {
      throw new NotFoundException('User not found');
    }

    return me;
  }
}
