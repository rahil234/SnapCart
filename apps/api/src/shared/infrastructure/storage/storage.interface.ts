import { UploadDescriptor } from '@/shared/infrastructure/storage/upload-descriptor';

export interface IStorageService {
  /**
   * Generate a short-lived upload URL (SAS / signed URL)
   */
  generateUploadUrl(blobName: string): string;

  /**
   * Generate a read-only URL
   */
  generateReadUrl(blobName: string): string;

  /**
   * Generate presigned upload credentials for client-side upload to Cloudinary
   * Returns structured upload descriptor with all required fields
   */
  generatePresignedUpload(blobName: string): UploadDescriptor;

  /**
   * Upload file directly from backend (buffer-based)
   */
  uploadBuffer(
    blobName: string,
    buffer: Buffer,
    mimeType: string,
  ): Promise<string>;

  /**
   * Check if a blob exists
   */
  blobExists(blobName: string): Promise<boolean>;

  /**
   * Delete a single blob
   */
  deleteBlob(blobName: string): Promise<void>;

  /**
   * Delete all blobs with a prefix (folder-like delete)
   */
  deleteByPrefix(prefix: string): Promise<void>;

  /**
   * List blobs by prefix
   */
  listBlobs(prefix: string): Promise<string[]>;
}
