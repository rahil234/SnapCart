import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ReorderBannersCommand } from '../reorder-banners.command';
import { BannerRepository } from '@/modules/banner/domain/repositories';

@CommandHandler(ReorderBannersCommand)
export class ReorderBannersHandler implements ICommandHandler<ReorderBannersCommand> {
  constructor(
    @Inject('BannerRepository')
    private readonly bannerRepository: BannerRepository,
  ) {}

  async execute(command: ReorderBannersCommand): Promise<void> {
    const { banners } = command;
    await this.bannerRepository.updateOrders(banners);
  }
}
