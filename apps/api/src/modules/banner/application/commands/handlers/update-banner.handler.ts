import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Banner } from '@/modules/banner/domain/entities';
import { UpdateBannerCommand } from '../update-banner.command';
import { BannerRepository } from '@/modules/banner/domain/repositories';

@CommandHandler(UpdateBannerCommand)
export class UpdateBannerHandler implements ICommandHandler<UpdateBannerCommand> {
  constructor(
    @Inject('BannerRepository')
    private readonly bannerRepository: BannerRepository,
  ) {}

  async execute(command: UpdateBannerCommand): Promise<Banner> {
    const { id, imageUrl, isActive } = command;

    const banner = await this.bannerRepository.findById(id);
    if (!banner) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }

    if (imageUrl !== undefined) {
      banner.updateImage(imageUrl);
    }

    if (isActive !== undefined) {
      if (isActive) {
        banner.activate();
      } else {
        banner.deactivate();
      }
    }

    return this.bannerRepository.update(banner);
  }
}
