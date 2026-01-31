export class Category {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly imageUrl: string | null,
    public readonly parentId: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
