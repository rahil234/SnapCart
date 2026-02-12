import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSellerDashboardQuery } from './get-seller-dashboard.query';
import { AnalyticsRepository } from '../../../infrastructure/analytics.repository';
import { SellerDashboardResponseDto } from '../../../interfaces/dto/dashboard-response.dto';
@QueryHandler(GetSellerDashboardQuery)
export class GetSellerDashboardHandler
  implements IQueryHandler<GetSellerDashboardQuery>
{
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}
  async execute(
    query: GetSellerDashboardQuery,
  ): Promise<SellerDashboardResponseDto> {
    return await this.analyticsRepository.getSellerDashboard(
      query.sellerProfileId,
    );
  }
}
