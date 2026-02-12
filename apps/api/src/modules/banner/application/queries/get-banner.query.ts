import { Query } from '@nestjs/cqrs';
import { Banner } from '@/modules/banner/domain/entities';

export class GetBannerQuery extends Query<Banner> {
  constructor(public readonly id: string) {
    super();
  }
}
