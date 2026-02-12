import { Query } from '@nestjs/cqrs';
import { Banner } from '@/modules/banner/domain/entities';

export class GetAllBannersQuery extends Query<Banner[]> {
  constructor(public readonly activeOnly: boolean = false) {
    super();
  }
}
