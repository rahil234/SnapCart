import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DeleteBannerCommand } from '../delete-banner.command';
import { BannerRepository } from '@/modules/banner/domain/repositories';

@CommandHandler(DeleteBannerCommand)
export class DeleteBannerHandler implements ICommandHandler<DeleteBannerCommand> {
  constructor(
    @Inject('BannerRepository')
    private readonly bannerRepository: BannerRepository,
  ) {}

  async execute(command: DeleteBannerCommand): Promise<void> {
    const { id } = command;

    const banner = await this.bannerRepository.findById(id);
    if (!banner) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }

    await this.bannerRepository.delete(id);
  }
}
