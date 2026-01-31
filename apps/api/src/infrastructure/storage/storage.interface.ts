export interface ReadUrlResponse {
  readUrl: string;
}

export interface UploadUrlResponse extends ReadUrlResponse {
  uploadUrl: string;
}

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
