import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Banner } from '@/modules/banner/domain/entities';
import { CreateBannerCommand } from '../create-banner.command';
import { BannerRepository } from '@/modules/banner/domain/repositories';

@CommandHandler(CreateBannerCommand)
export class CreateBannerHandler implements ICommandHandler<CreateBannerCommand> {
  constructor(
    @Inject('BannerRepository')
    private readonly bannerRepository: BannerRepository,
  ) {}

  async execute(command: CreateBannerCommand): Promise<Banner> {
    const { imageUrl, order } = command;

    // If order is not provided, put at the end
    let bannerOrder = order;
    if (bannerOrder === undefined) {
      const maxOrder = await this.bannerRepository.getMaxOrder();
      bannerOrder = maxOrder + 1;
    }

    const banner = Banner.create(imageUrl, bannerOrder);
    return this.bannerRepository.save(banner);
  }
}
