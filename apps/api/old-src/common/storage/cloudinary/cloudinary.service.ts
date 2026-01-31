import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import streamifier from 'streamifier';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IStorageService } from '@/common/storage/storage.interface';

@Injectable()
export class CloudinaryStorageService implements IStorageService {
  private readonly defaultFolder: string;
  private readonly configService: ConfigService;

  constructor() {
    this.configService = new ConfigService();
    cloudinary.config({
      cloud_name: this.configService.getOrThrow<string>(
        'CLOUDINARY_CLOUD_NAME',
      ),
      api_key: this.configService.getOrThrow<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.getOrThrow<string>(
        'CLOUDINARY_API_SECRET',
      ),
      secure: true,
    });

    this.defaultFolder =
      this.configService.get<string>('CLOUDINARY_BASE_FOLDER') ?? 'snapcart';
  }

  /**
   * Cloudinary does not support true PUT-style signed upload URLs
   * like Azure/S3. This returns a signed upload payload instead.
   */
  generateUploadUrl(blobName: string): string {
    const timestamp = Math.floor(Date.now() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        public_id: blobName,
        timestamp,
        folder: this.defaultFolder,
      },
      this.configService.getOrThrow('CLOUDINARY_API_SECRET'),
    );

    const l = cloudinary.utils.url('upload', {
      timestamp,
      signature,
      public_id: blobName,
    });

    console.log(l);

    return JSON.stringify({
      cloudName: this.configService.getOrThrow<string>('CLOUDINARY_CLOUD_NAME'),
      apiKey: this.configService.getOrThrow<string>('CLOUDINARY_API_KEY'),
      timestamp,
      signature,
      folder: this.defaultFolder,
      publicId: blobName,
    });
  }

  /**
   * Cloudinary assets are publicly readable by default
   */
  generateReadUrl(blobName: string): string {
    return cloudinary.url(`${this.defaultFolder}/${blobName}`, {
      secure: true,
      type: 'authenticated',
      sign_url: true,
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
    });
  }

  async uploadBuffer(blobName: string, buffer: Buffer): Promise<string> {
    const uploadResult: UploadApiResponse = await new Promise(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            public_id: blobName,
            folder: this.defaultFolder,
            resource_type: 'auto',
          },
          (error, result) => {
            if (result) resolve(result);
            reject(new Error(error?.message));
          },
        );

        streamifier.createReadStream(buffer).pipe(uploadStream);
      },
    );

    return uploadResult.secure_url;
  }

  async blobExists(blobName: string): Promise<boolean> {
    try {
      await cloudinary.api.resource(`${this.defaultFolder}/${blobName}`);
      return true;
    } catch {
      return false;
    }
  }

  async deleteBlob(blobName: string): Promise<void> {
    await cloudinary.uploader.destroy(`${this.defaultFolder}/${blobName}`, {
      invalidate: true,
    });
  }

  async deleteByPrefix(prefix: string): Promise<void> {
    await cloudinary.api.delete_resources_by_prefix(
      `${this.defaultFolder}/${prefix}`,
      { invalidate: true },
    );
  }

  async listBlobs(prefix: string): Promise<string[]> {
    const result = (await cloudinary.api.resources({
      type: 'upload',
      prefix: `${this.defaultFolder}/${prefix}`,
      max_results: 500,
    })) as { resources: { public_id: string }[] };

    return result.resources.map((r) => r.public_id);
  }
}
