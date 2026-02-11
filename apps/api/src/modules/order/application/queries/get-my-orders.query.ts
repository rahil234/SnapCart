export class GetMyOrdersQuery {
  constructor(
    public readonly userId: string,
    public readonly skip: number,
    public readonly take: number,
  ) {}
}
