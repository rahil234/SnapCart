import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Banner } from '@/modules/banner/domain/entities';
import { BannerRepository } from '@/modules/banner/domain/repositories';
import { GetAllBannersQuery } from '../get-all-banners.query';

@QueryHandler(GetAllBannersQuery)
export class GetAllBannersHandler implements IQueryHandler<GetAllBannersQuery> {
  constructor(
    @Inject('BannerRepository')
    private readonly bannerRepository: BannerRepository,
  ) {}

  async execute(query: GetAllBannersQuery): Promise<Banner[]> {
    if (query.activeOnly) {
      return this.bannerRepository.findActive();
    }
    return this.bannerRepository.findAll();
  }
}
