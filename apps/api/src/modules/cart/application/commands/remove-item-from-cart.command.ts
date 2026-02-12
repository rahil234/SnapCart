export class RemoveItemFromCartCommand {
  constructor(
    public readonly userId: string,
    public readonly itemId: string,
  ) {}
}
