export class GetUsersQuery {
  constructor(
    public readonly page?: number,
    public readonly limit?: number,
    public readonly search?: string,
    public readonly status?: string,
  ) {}
}
