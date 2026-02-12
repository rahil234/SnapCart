import { Command } from '@nestjs/cqrs';

import { Banner } from '@/modules/banner/domain/entities';

export class UpdateBannerCommand extends Command<Banner> {
  constructor(
    public readonly id: string,
    public readonly imageUrl?: string,
    public readonly isActive?: boolean,
  ) {
    super();
  }
}
