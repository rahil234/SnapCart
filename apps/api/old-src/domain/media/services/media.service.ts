import { Injectable } from '@nestjs/common';

import { AzureBlobService } from '@/common/storage/azure/azure-blob.service';

export interface ReadUrlResponse {
  readUrl: string;
}

interface UploadUrlResponse extends ReadUrlResponse {
  uploadUrl: string;
}

@Injectable()
export class MediaService {
  constructor(private readonly _azureBlobService: AzureBlobService) {}

  /* ---------- CATEGORY ---------- */

  getCategoryUploadUrl(categoryId: string): UploadUrlResponse {
    const blobName = `category/${categoryId}`;

    return {
      uploadUrl: this._azureBlobService.generateUploadUrl(blobName),
      readUrl: this._azureBlobService.generateReadUrl(blobName),
    };
  }

  getCategoryReadUrl(categoryId: string): ReadUrlResponse {
    return {
      readUrl: this._azureBlobService.generateReadUrl(`category/${categoryId}`),
    };
  }

  async removeCategoryImages(categoryId: string): Promise<void> {
    await this._azureBlobService.deleteByPrefix(`category/${categoryId}`);
  }

  /* ---------- PRODUCT ---------- */

  getProductUploadUrl(productId: string, order: number): UploadUrlResponse {
    const blobName = `product/${productId}/${order}.jpg`;

    return {
      uploadUrl: this._azureBlobService.generateUploadUrl(blobName),
      readUrl: this._azureBlobService.generateReadUrl(blobName),
    };
  }

  async getProductReadUrls(productId: string): Promise<ReadUrlResponse[]> {
    const prefix = `product/${productId}/`;
    const blobs = await this._azureBlobService.listBlobs(prefix);

    return blobs
      .filter((b) => b.match(/\/\d+\.jpg$/))
      .sort((a, b) => {
        const aOrder = parseInt(a.match(/(\d+)\.jpg$/)?.[1] ?? '0', 10);
        const bOrder = parseInt(b.match(/(\d+)\.jpg$/)?.[1] ?? '0', 10);
        return aOrder - bOrder;
      })
      .map((b) => {
        return {
          readUrl: this._azureBlobService.generateReadUrl(b),
        };
      });
  }

  getProductThumbnailUploadUrl(productId: string): UploadUrlResponse {
    const blobName = `product/${productId}/thumbnail.jpg`;

    return {
      uploadUrl: this._azureBlobService.generateUploadUrl(blobName),
      readUrl: this._azureBlobService.generateReadUrl(blobName),
    };
  }

  getProductThumbnailReadUrl(productId: string): ReadUrlResponse {
    const blobName = `product/${productId}/thumbnail.jpg`;

    return {
      readUrl: this._azureBlobService.generateReadUrl(blobName),
    };
  }

  async removeProductThumbnail(productId: string): Promise<void> {
    await this._azureBlobService.deleteBlob(
      `product/${productId}/thumbnail.jpg`,
    );
  }

  async removeAllProductImages(productId: string): Promise<void> {
    await this._azureBlobService.deleteByPrefix(`product/${productId}/`);
  }

  async removeAllProductImageByOrder(
    productId: string,
    order: number,
  ): Promise<void> {
    const blobName = `product/${productId}/${order}.jpg`;

    await this._azureBlobService.deleteBlob(blobName);
  }

  /* ---------- USER TRY-ON ---------- */

  getUserTryOnUploadUrl(userId: string): UploadUrlResponse {
    const blobName = `user/${userId}/try-on.jpg`;
    return {
      uploadUrl: this._azureBlobService.generateUploadUrl(blobName),
      readUrl: this._azureBlobService.generateReadUrl(blobName),
    };
  }

  async getUserTryOnReadUrl(userId: string): Promise<ReadUrlResponse | null> {
    const blobName = `user/${userId}/try-on.jpg`;

    const exists = await this._azureBlobService.blobExists(blobName);

    if (!exists) {
      return null;
    }

    return {
      readUrl: this._azureBlobService.generateReadUrl(blobName),
    };
  }

  async removeUserTryOnImages(userId: string): Promise<void> {
    await this._azureBlobService.deleteBlob(`user/${userId}/try-on.jpg`);
  }

  /* ---------- HERO IMAGE ---------- */

  getHeroImageUploadUrl(): UploadUrlResponse {
    const blobName = `landing-page/hero.jpg`;

    return {
      uploadUrl: this._azureBlobService.generateUploadUrl(blobName),
      readUrl: this._azureBlobService.generateReadUrl(blobName),
    };
  }

  getHeroImageReadUrl(): ReadUrlResponse {
    const blobName = `landing-page/hero.jpg`;

    return {
      readUrl: this._azureBlobService.generateReadUrl(blobName),
    };
  }

  async removeHeroImage(): Promise<void> {
    await this._azureBlobService.deleteBlob(`landing-page/hero.jpg`);
  }
}
