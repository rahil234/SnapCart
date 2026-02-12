import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAdminDashboardQuery } from './get-admin-dashboard.query';
import { AnalyticsRepository } from '../../../infrastructure/analytics.repository';
import { AdminDashboardResponseDto } from '../../../interfaces/dto/dashboard-response.dto';
@QueryHandler(GetAdminDashboardQuery)
export class GetAdminDashboardHandler
  implements IQueryHandler<GetAdminDashboardQuery>
{
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}
  async execute(): Promise<AdminDashboardResponseDto> {
    return await this.analyticsRepository.getAdminDashboard();
  }
}
