import cuid from '@paralleldrive/cuid2';

import {
  UserRole,
  AccountStatus,
  UserGender,
} from '@/modules/user/domain/enums';
import { SellerProfile } from './seller-profile.entity';
import { CustomerProfile } from './customer-profile.entity';
import { Email, Phone } from '@/modules/user/domain/value-objects';

/**
 * User Aggregate Root
 *
 * Represents a user in the e-commerce system with strict business invariants.
 * Manages the lifecycle of CustomerProfile and SellerProfile entities.
 *
 * Aggregate Boundary:
 * - User (Aggregate Root)
 * - CustomerProfile (Optional Entity)
 * - SellerProfile (Optional Entity)
 *
 * Invariants:
 * 1. User must have either email OR phone (at least one)
 * 2. CUSTOMER role requires CustomerProfile
 * 3. SELLER role requires SellerProfile
 * 4. User can be both CUSTOMER and SELLER (dual profiles)
 * 5. Only ACTIVE users can create profiles
 * 6. DISABLED accounts cannot be reactivated
 * 7. Profile creation must go through aggregate root
 */
export class User {
  private constructor(
    public readonly id: string,
    private email: Email | null,
    private phone: Phone | null,
    private password: string | null,
    private role: UserRole,
    private status: AccountStatus,
    private customerProfile: CustomerProfile | null,
    private sellerProfile: SellerProfile | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    this.validateInvariants();
  }

  // Factory method for creating new users
  static create(
    email: string | null,
    phone: string | null,
    password: string | null,
    role: UserRole,
  ): User {
    // Invariant: Must have email OR phone
    const emailVO = Email.create(email);
    const phoneVO = Phone.create(phone);

    if (!emailVO && !phoneVO) {
      throw new Error('Either email or phone must be provided');
    }

    return new User(
      cuid.createId(),
      emailVO,
      phoneVO,
      password,
      role,
      AccountStatus.ACTIVE,
      null, // customerProfile - created separately
      null, // sellerProfile - created separately
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
    customerProfile?: CustomerProfile | null,
    sellerProfile?: SellerProfile | null,
  ): User {
    const emailVO = Email.create(email);
    const phoneVO = Phone.create(phone);

    return new User(
      id,
      emailVO,
      phoneVO,
      password,
      role,
      status,
      customerProfile || null,
      sellerProfile || null,
      createdAt,
      updatedAt,
    );
  }

  /**
   * Validate all aggregate invariants
   */
  private validateInvariants(): void {
    // Invariant: Must have email OR phone
    if (!this.email && !this.phone) {
      throw new Error('User must have either email or phone');
    }
  }

  // ==================== AGGREGATE ROOT METHODS ====================

  /**
   * Create a customer profile for this user
   *
   * Business Rules:
   * - User must be ACTIVE
   * - Cannot create a duplicate customer profile
   * - Automatically assigns CUSTOMER role if not set
   */
  createCustomerProfile(
    name: string | null = null,
    dob: Date | null = null,
    gender: UserGender | null = null,
  ): CustomerProfile {
    if (!this.isActive()) {
      throw new Error('Only active users can create customer profiles');
    }

    if (this.customerProfile) {
      throw new Error('Customer profile already exists for this user');
    }

    // Validate DOB
    if (dob && dob > new Date()) {
      throw new Error('Date of birth cannot be in the future');
    }

    // Create profile
    this.customerProfile = CustomerProfile.create(this.id, name, dob, gender);

    // Auto-assign CUSTOMER role if user is ADMIN only
    if (this.role === UserRole.ADMIN) {
      // Keep ADMIN role
    } else if (this.role === UserRole.SELLER) {
      // User is already SELLER, keep it (dual role scenario)
    } else {
      // Assign CUSTOMER role
      this.role = UserRole.CUSTOMER;
    }

    return this.customerProfile;
  }

  /**
   * Upgrade user to seller (or create seller profile)
   *
   * Business Rules:
   * - User must be ACTIVE
   * - Store name is required
   * - Users can have both customer and seller profiles
   */
  upgradeToSeller(
    storeName: string,
    gstNumber: string | null = null,
  ): SellerProfile {
    if (!this.isActive()) {
      throw new Error('Only active users can create seller profiles');
    }

    if (this.sellerProfile) {
      throw new Error('Seller profile already exists for this user');
    }

    if (!storeName || storeName.trim().length === 0) {
      throw new Error('Store name is required to create seller profile');
    }

    // Create seller profile
    this.sellerProfile = SellerProfile.create(this.id, storeName, gstNumber);

    // Update role to SELLER (or keep dual role)
    if (this.role === UserRole.CUSTOMER && this.customerProfile) {
      // User was customer, now becomes seller but keeps customer profile
      this.role = UserRole.SELLER;
    } else if (this.role === UserRole.ADMIN) {
      // Keep ADMIN role
    } else {
      this.role = UserRole.SELLER;
    }

    return this.sellerProfile;
  }

  /**
   * Check if the user can add addresses
   * require CustomerProfile to exist
   */
  canAddAddress(): boolean {
    return this.customerProfile !== null && this.isActive();
  }

  /**
   * Validate if the user can perform customer operations (cart, orders)
   */
  canPerformCustomerOperations(): boolean {
    return this.customerProfile !== null && this.isActive();
  }

  /**
   * Validate if the user can perform seller operations (products, inventory)
   */
  canPerformSellerOperations(): boolean {
    return this.sellerProfile !== null && this.isActive();
  }

  // ==================== BUSINESS METHODS ====================

  /**
   * Update email with validation
   */
  updateEmail(newEmail: string | null): void {
    const emailVO = Email.create(newEmail);

    // Invariant: Must have email OR phone
    if (!emailVO && !this.phone) {
      throw new Error('Cannot remove email when phone is not set');
    }

    this.email = emailVO;
  }

  /**
   * Update phone with validation
   */
  updatePhone(newPhone: string | null): void {
    const phoneVO = Phone.create(newPhone);

    // Invariant: Must have email OR phone
    if (!phoneVO && !this.email) {
      throw new Error('Cannot remove phone when email is not set');
    }

    this.phone = phoneVO;
  }

  /**
   * Update password with validation
   */
  updatePassword(newPassword: string): void {
    if (!newPassword || newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    this.password = newPassword;
  }

  /**
   * Activate a user account
   *
   * Business Rule: Cannot activate DISABLED accounts
   */
  activate(): void {
    if (this.status === AccountStatus.DISABLED) {
      throw new Error(
        'Cannot activate a disabled account. Contact administrator.',
      );
    }
    this.status = AccountStatus.ACTIVE;
  }

  /**
   * Suspend a user account (temporary)
   */
  suspend(): void {
    if (this.status === AccountStatus.DISABLED) {
      throw new Error('Account is already disabled');
    }
    this.status = AccountStatus.SUSPENDED;
  }

  /**
   * Disable a user account (permanent)
   * This is a one-way operation
   */
  disable(): void {
    this.status = AccountStatus.DISABLED;
  }

  /**
   * Change user role
   * Note: Role changes should typically be done through profile creation methods
   */
  changeRole(newRole: UserRole): void {
    const oldRole = this.role;
    this.role = newRole;

    // Validate role-profile consistency
    if (newRole === UserRole.CUSTOMER && !this.customerProfile) {
      throw new Error('Cannot assign CUSTOMER role without customer profile');
    }

    if (newRole === UserRole.SELLER && !this.sellerProfile) {
      throw new Error('Cannot assign SELLER role without seller profile');
    }
  }

  /**
   * Update customer profile details
   */
  updateCustomerProfile(
    name?: string | null,
    dob?: Date | null,
    gender?: UserGender | null,
  ): void {
    if (!this.customerProfile) {
      throw new Error('Customer profile does not exist. Create it first.');
    }

    if (name !== undefined) {
      this.customerProfile.updateName(name);
    }

    if (dob !== undefined) {
      this.customerProfile.updateDob(dob);
    }

    if (gender !== undefined) {
      this.customerProfile.updateGender(gender);
    }
  }

  /**
   * Update seller profile details
   */
  updateSellerProfile(storeName?: string, gstNumber?: string | null): void {
    if (!this.sellerProfile) {
      throw new Error('Seller profile does not exist. Create it first.');
    }

    if (storeName !== undefined) {
      this.sellerProfile.updateStoreName(storeName);
    }

    if (gstNumber !== undefined) {
      this.sellerProfile.updateGstNumber(gstNumber);
    }
  }

  /**
   * Verify seller (admin operation)
   */
  verifySeller(): void {
    if (!this.sellerProfile) {
      throw new Error('Cannot verify seller without seller profile');
    }

    this.sellerProfile.verify();
  }

  /**
   * Unverify seller (admin operation)
   */
  unverifySeller(): void {
    if (!this.sellerProfile) {
      throw new Error('Cannot unverify seller without seller profile');
    }

    this.sellerProfile.unverify();
  }

  // ==================== GETTERS ====================

  getId(): string {
    return this.id;
  }

  getEmail(): string | null {
    return this.email?.getValue() || null;
  }

  getPhone(): string | null {
    return this.phone?.getValue() || null;
  }

  getEmailValueObject(): Email | null {
    return this.email;
  }

  getPhoneValueObject(): Phone | null {
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

  getCustomerProfile(): CustomerProfile | null {
    return this.customerProfile;
  }

  getSellerProfile(): SellerProfile | null {
    return this.sellerProfile;
  }

  hasCustomerProfile(): boolean {
    return this.customerProfile !== null;
  }

  hasSellerProfile(): boolean {
    return this.sellerProfile !== null;
  }

  // ==================== STATUS CHECKS ====================

  isActive(): boolean {
    return this.status === AccountStatus.ACTIVE;
  }

  isSuspended(): boolean {
    return this.status === AccountStatus.SUSPENDED;
  }

  isDisabled(): boolean {
    return this.status === AccountStatus.DISABLED;
  }

  // ==================== ROLE CHECKS ====================

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
