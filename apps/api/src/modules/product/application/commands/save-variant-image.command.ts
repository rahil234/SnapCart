/**
 * Save Variant Image Command
 *
 * Saves image metadata after successful Cloudinary upload
 * This confirms the image URL and associates it with the variant
 */
export class SaveVariantImageCommand {
  constructor(
    public readonly variantId: string,
    public readonly publicId: string,
    public readonly url: string,
  ) {}
}
