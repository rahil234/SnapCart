export class GetSellerOrdersQuery {
  constructor(
    public readonly userId: string,
    public readonly skip: number,
    public readonly take: number,
  ) {}
}
