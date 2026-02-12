import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetBannerQuery } from '../get-banner.query';
import { Banner } from '@/modules/banner/domain/entities';
import { BannerRepository } from '@/modules/banner/domain/repositories';

@QueryHandler(GetBannerQuery)
export class GetBannerHandler implements IQueryHandler<GetBannerQuery> {
  constructor(
    @Inject('BannerRepository')
    private readonly bannerRepository: BannerRepository,
  ) {}

  async execute(query: GetBannerQuery): Promise<Banner> {
    const banner = await this.bannerRepository.findById(query.id);
    if (!banner) {
      throw new NotFoundException(`Banner with ID ${query.id} not found`);
    }
    return banner;
  }
}
