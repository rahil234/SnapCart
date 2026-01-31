import { v4 as uuid } from 'uuid';
import { UserRole, AccountStatus } from '@/domain/user/enums';

export class User {
  private constructor(
    public readonly id: string,
    private email: string | null,
    private phone: string | null,
    private password: string | null,
    private role: UserRole,
    private status: AccountStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  // Factory method for creating new users
  static create(
    email: string | null,
    phone: string | null,
    password: string | null,
    role: UserRole,
  ): User {
    if (!email && !phone) {
      throw new Error('Either email or phone must be provided');
    }

    return new User(
      uuid(),
      email,
      phone,
      password,
      role,
      AccountStatus.ACTIVE,
      new Date(),
      new Date(),
    );
  }

  // Factory method for reconstructing from persistence
  static from(
    id: string,
    email: string | null,
    phone: string | null,
    password: string | null,
    role: UserRole,
    status: AccountStatus,
    createdAt: Date,
    updatedAt: Date,
  ): User {
    return new User(id, email, phone, password, role, status, createdAt, updatedAt);
  }

  // Business methods
  updateEmail(newEmail: string | null): void {
    this.email = newEmail;
  }

  updatePhone(newPhone: string | null): void {
    this.phone = newPhone;
  }

  updatePassword(newPassword: string): void {
    if (!newPassword || newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    this.password = newPassword;
  }

  activate(): void {
    if (this.status === AccountStatus.DISABLED) {
      throw new Error('Cannot activate a disabled account');
    }
    this.status = AccountStatus.ACTIVE;
  }

  suspend(): void {
    this.status = AccountStatus.SUSPENDED;
  }

  disable(): void {
    this.status = AccountStatus.DISABLED;
  }

  changeRole(newRole: UserRole): void {
    this.role = newRole;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getEmail(): string | null {
    return this.email;
  }

  getPhone(): string | null {
    return this.phone;
  }

  getPassword(): string | null {
    return this.password;
  }

  getRole(): UserRole {
    return this.role;
  }

  getStatus(): AccountStatus {
    return this.status;
  }

  isActive(): boolean {
    return this.status === AccountStatus.ACTIVE;
  }

  isSuspended(): boolean {
    return this.status === AccountStatus.SUSPENDED;
  }

  isDisabled(): boolean {
    return this.status === AccountStatus.DISABLED;
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  isSeller(): boolean {
    return this.role === UserRole.SELLER;
  }

  isCustomer(): boolean {
    return this.role === UserRole.CUSTOMER;
  }
}
