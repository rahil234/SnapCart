export class CreateCategoryCommand {
  constructor(
    public readonly name: string,
    public readonly description?: string | null,
    public readonly imageUrl?: string | null,
    public readonly parentId?: string | null,
  ) {}
}
