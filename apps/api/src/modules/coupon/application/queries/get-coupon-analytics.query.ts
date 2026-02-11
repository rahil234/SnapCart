import { Query } from '@nestjs/cqrs';

export class GetCouponAnalyticsQuery extends Query<any> {
  constructor(
    public readonly startDate?: Date,
    public readonly endDate?: Date,
  ) {
    super();
  }
}
