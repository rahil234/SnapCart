export class Address {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly isPrimary: boolean,
    public readonly houseNo: string | null,
    public readonly street: string | null,
    public readonly city: string | null,
    public readonly state: string | null,
    public readonly country: string | null,
    public readonly pincode: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
