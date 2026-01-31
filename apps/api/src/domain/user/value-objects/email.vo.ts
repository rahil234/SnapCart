export class Email {
  private constructor(private readonly value: string) {}

  static create(email: string | null): Email | null {
    if (!email) return null;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    return new Email(email.toLowerCase().trim());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email | null): boolean {
    if (!other) return false;
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
