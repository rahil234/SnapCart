import { Command } from '@nestjs/cqrs';

import { Banner } from '@/modules/banner/domain/entities';

export class CreateBannerCommand extends Command<Banner> {
  constructor(
    public readonly imageUrl: string,
    public readonly order?: number,
  ) {
    super();
  }
}
