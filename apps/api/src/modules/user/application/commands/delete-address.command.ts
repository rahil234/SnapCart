export class DeleteAddressCommand {
  constructor(
    public readonly addressId: string,
    public readonly userId: string,
  ) {}
}
