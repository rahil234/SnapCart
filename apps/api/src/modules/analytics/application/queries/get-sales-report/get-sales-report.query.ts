export class GetSalesReportQuery {
  constructor(
    public readonly timeframe: string,
    public readonly startDate: string,
    public readonly endDate: string,
    public readonly sellerProfileId?: string,
  ) {}
}
