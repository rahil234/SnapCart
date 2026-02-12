import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSalesReportQuery } from './get-sales-report.query';
import { AnalyticsRepository } from '../../../infrastructure/analytics.repository';
import { SalesReportItemDto } from '../../../interfaces/dto/sales-report-response.dto';
@QueryHandler(GetSalesReportQuery)
export class GetSalesReportHandler
  implements IQueryHandler<GetSalesReportQuery>
{
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}
  async execute(query: GetSalesReportQuery): Promise<SalesReportItemDto[]> {
    const { timeframe, startDate, endDate, sellerProfileId } = query;
    return await this.analyticsRepository.getSalesReport(
      timeframe,
      startDate,
      endDate,
      sellerProfileId,
    );
  }
}
