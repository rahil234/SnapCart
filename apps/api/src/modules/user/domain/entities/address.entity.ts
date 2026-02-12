import cuid from '@paralleldrive/cuid2';

export class Address {
  private constructor(
    public readonly id: string,
    private customerId: string,
    private isPrimary: boolean,
    private houseNo: string | null,
    private street: string | null,
    private city: string | null,
    private state: string | null,
    private country: string | null,
    private pincode: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  // Factory method for creating new addresses
  static create(
    customerId: string,
    houseNo: string | null,
    street: string | null,
    city: string | null,
    state: string | null,
    country: string | null,
    pincode: string | null,
    isPrimary: boolean = false,
  ): Address {
    return new Address(
      cuid.createId(),
      customerId,
      isPrimary,
      houseNo,
      street,
      city,
      state,
      country,
      pincode,
      new Date(),
      new Date(),
    );
  }

  // Factory method for reconstructing from persistence
  static from(
    id: string,
    customerId: string,
    isPrimary: boolean,
    houseNo: string | null,
    street: string | null,
    city: string | null,
    state: string | null,
    country: string | null,
    pincode: string | null,
    createdAt: Date,
    updatedAt: Date,
  ): Address {
    return new Address(
      id,
      customerId,
      isPrimary,
      houseNo,
      street,
      city,
      state,
      country,
      pincode,
      createdAt,
      updatedAt,
    );
  }

  // Business methods
  makePrimary(): void {
    this.isPrimary = true;
  }

  makeSecondary(): void {
    this.isPrimary = false;
  }

  updateAddress(
    houseNo?: string | null,
    street?: string | null,
    city?: string | null,
    state?: string | null,
    country?: string | null,
    pincode?: string | null,
  ): void {
    if (houseNo !== undefined) this.houseNo = houseNo;
    if (street !== undefined) this.street = street;
    if (city !== undefined) this.city = city;
    if (state !== undefined) this.state = state;
    if (country !== undefined) this.country = country;
    if (pincode !== undefined) this.pincode = pincode;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getCustomerId(): string {
    return this.customerId;
  }

  getIsPrimary(): boolean {
    return this.isPrimary;
  }

  getHouseNo(): string | null {
    return this.houseNo;
  }

  getStreet(): string | null {
    return this.street;
  }

  getCity(): string | null {
    return this.city;
  }

  getState(): string | null {
    return this.state;
  }

  getCountry(): string | null {
    return this.country;
  }

  getPincode(): string | null {
    return this.pincode;
  }

  getFullAddress(): string {
    const parts = [
      this.houseNo,
      this.street,
      this.city,
      this.state,
      this.country,
      this.pincode,
    ].filter(Boolean);
    return parts.join(', ');
  }
}
