import { v4 as uuid } from 'uuid';

export class SellerProfile {
  private constructor(
    public readonly id: string,
    private userId: string,
    private storeName: string,
    private gstNumber: string | null,
    private isVerified: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  // Factory method for creating new seller profiles
  static create(
    userId: string,
    storeName: string,
    gstNumber: string | null = null,
  ): SellerProfile {
    if (!storeName || storeName.trim().length === 0) {
      throw new Error('Store name cannot be empty');
    }

    return new SellerProfile(
      uuid(),
      userId,
      storeName,
      gstNumber,
      false,
      new Date(),
      new Date(),
    );
  }

  // Factory method for reconstructing from persistence
  static from(
    id: string,
    userId: string,
    storeName: string,
    gstNumber: string | null,
    isVerified: boolean,
    createdAt: Date,
    updatedAt: Date,
  ): SellerProfile {
    return new SellerProfile(
      id,
      userId,
      storeName,
      gstNumber,
      isVerified,
      createdAt,
      updatedAt,
    );
  }

  // Business methods
  updateStoreName(newStoreName: string): void {
    if (!newStoreName || newStoreName.trim().length === 0) {
      throw new Error('Store name cannot be empty');
    }
    this.storeName = newStoreName;
  }

  updateGstNumber(newGstNumber: string | null): void {
    this.gstNumber = newGstNumber;
  }

  verify(): void {
    this.isVerified = true;
  }

  unverify(): void {
    this.isVerified = false;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getStoreName(): string {
    return this.storeName;
  }

  getGstNumber(): string | null {
    return this.gstNumber;
  }

  getIsVerified(): boolean {
    return this.isVerified;
  }
}
