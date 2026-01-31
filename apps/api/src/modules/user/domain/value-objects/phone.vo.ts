export class Phone {
  private constructor(private readonly value: string) {}

  static create(phone: string | null): Phone | null {
    if (!phone) return null;

    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length < 10 || cleaned.length > 15) {
      throw new Error('Invalid phone number length');
    }

    return new Phone(cleaned);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Phone | null): boolean {
    if (!other) return false;
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  toFormattedString(): string {
    // Format as +XX-XXXXXXXXXX
    if (this.value.length === 10) {
      return `${this.value.slice(0, 3)}-${this.value.slice(3, 6)}-${this.value.slice(6)}`;
    }
    return this.value;
  }
}
