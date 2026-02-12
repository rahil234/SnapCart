import { v4 as uuid } from 'uuid';

/**
 * VariantImage Value Object
 *
 * Represents an immutable image attached to a product variant.
 * - Each variant can have 1-6 images
 * - Position 1 is the primary/thumbnail image
 * - Immutable after creation (delete + recreate if needed)
 *
 * DDD: Value Object (immutable, identified by variantId + position)
 */
export class VariantImage {
  private constructor(
    public readonly id: string,
    public readonly variantId: string,
    private readonly publicId: string,
    private readonly url: string,
    private readonly position: number,
    public readonly createdAt: Date,
  ) {}

  /**
   * Create a new variant image
   */
  static create(
    variantId: string,
    publicId: string,
    url: string,
    position: number,
  ): VariantImage {
    // Validations
    if (!variantId?.trim()) {
      throw new Error('Variant ID is required');
    }

    if (!publicId?.trim()) {
      throw new Error('Cloudinary public ID is required');
    }

    if (!url?.trim()) {
      throw new Error('Image URL is required');
    }

    if (position < 1 || position > 6) {
      throw new Error('Image position must be between 1 and 6');
    }

    return new VariantImage(
      uuid(),
      variantId.trim(),
      publicId.trim(),
      url.trim(),
      position,
      new Date(),
    );
  }

  /**
   * Reconstruct from persistence
   */
  static from(
    id: string,
    variantId: string,
    publicId: string,
    url: string,
    position: number,
    createdAt: Date,
  ): VariantImage {
    return new VariantImage(id, variantId, publicId, url, position, createdAt);
  }

  // ============================================
  // QUERY METHODS
  // ============================================

  getPublicId(): string {
    return this.publicId;
  }

  getUrl(): string {
    return this.url;
  }

  getPosition(): number {
    return this.position;
  }

  /**
   * Check if this is the primary image
   */
  isPrimary(): boolean {
    return this.position === 1;
  }

  /**
   * Get variant ID
   */
  getVariantId(): string {
    return this.variantId;
  }

  /**
   * Get image ID
   */
  getId(): string {
    return this.id;
  }
}
