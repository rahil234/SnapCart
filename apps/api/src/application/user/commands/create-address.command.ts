export class CreateAddressCommand {
  constructor(
    public readonly userId: string,
    public readonly houseNo: string | null,
    public readonly street: string | null,
    public readonly city: string | null,
    public readonly state: string | null,
    public readonly country: string | null,
    public readonly pincode: string | null,
    public readonly isPrimary: boolean = false,
  ) {}
}
