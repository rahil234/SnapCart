/**
 * CustomerInfo Value Object
 * Represents customer information associated with an order
 */
export class CustomerInfo {
  private constructor(
    public readonly customerId: string,
    public readonly customerName: string | null,
    public readonly customerEmail: string | null,
    public readonly customerPhone: string | null,
  ) {}

  static create(
    customerId: string,
    customerName: string | null,
    customerEmail: string | null,
    customerPhone: string | null,
  ): CustomerInfo {
    return new CustomerInfo(customerId, customerName, customerEmail, customerPhone);
  }

  static fromJSON(json: any): CustomerInfo {
    return new CustomerInfo(
      json.customerId,
      json.customerName,
      json.customerEmail,
      json.customerPhone,
    );
  }

  toJSON(): any {
    return {
      customerId: this.customerId,
      customerName: this.customerName,
      customerEmail: this.customerEmail,
      customerPhone: this.customerPhone,
    };
  }
}
