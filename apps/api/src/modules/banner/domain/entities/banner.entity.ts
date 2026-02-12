import { v4 as uuid } from 'uuid';

export class Banner {
  private constructor(
    public readonly id: string,
    private imageUrl: string,
    private order: number,
    private isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  // Factory method for creating new banners
  static create(imageUrl: string, order: number): Banner {
    if (!imageUrl || imageUrl.trim() === '') {
      throw new Error('Image URL is required');
    }

    if (order < 0) {
      throw new Error('Order must be a non-negative number');
    }

    return new Banner(uuid(), imageUrl, order, true, new Date(), new Date());
  }

  // Factory method for reconstructing from persistence
  static from(
    id: string,
    imageUrl: string,
    order: number,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
  ): Banner {
    return new Banner(id, imageUrl, order, isActive, createdAt, updatedAt);
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getImageUrl(): string {
    return this.imageUrl;
  }

  getOrder(): number {
    return this.order;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Behavior methods
  updateImage(imageUrl: string): void {
    if (!imageUrl || imageUrl.trim() === '') {
      throw new Error('Image URL is required');
    }
    this.imageUrl = imageUrl;
  }

  updateOrder(order: number): void {
    if (order < 0) {
      throw new Error('Order must be a non-negative number');
    }
    this.order = order;
  }

  activate(): void {
    this.isActive = true;
  }

  deactivate(): void {
    this.isActive = false;
  }

  // Serialization for response
  toPlainObject(): {
    id: string;
    imageUrl: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.id,
      imageUrl: this.imageUrl,
      order: this.order,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
