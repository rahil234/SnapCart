import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { Role } from '@/common/enums/role.enum';
import { Roles } from '@/common/decorators/roles.decorator';
import { HttpResponse } from '@/common/dto/http-response.dto';
import { ApiResponseWithType } from '@/common/decorators/api-response.decorator';
import { DashboardAnalyticsResponseDto } from '@/analytics/dto/response/dashboard-analytics-response.dto';
import { GetDashboardAnalyticsQuery } from '@/application/analytics/queries';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiResponseWithType({}, DashboardAnalyticsResponseDto)
  async get(): Promise<HttpResponse<DashboardAnalyticsResponseDto>> {
    const query = new GetDashboardAnalyticsQuery();
    const data = await this.queryBus.execute(query);

    return {
      success: true,
      message: 'Dashboard analytics fetched successfully',
      data: DashboardAnalyticsResponseDto.fromData(data),
    };
  }
}
