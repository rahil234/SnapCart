import { BadRequestException, Injectable } from '@nestjs/common';
import { AzureBlobService } from '@/common/storage/azure/azure-blob.service';

@Injectable()
export class TryOnMediaService {
  constructor(private readonly _azureBlobService: AzureBlobService) {}

  async uploadTryOnResultBase64(
    userId: string,
    productId: string,
    base64: string,
  ): Promise<string> {
    if (!base64) {
      throw new BadRequestException('Base64 image is required');
    }

    const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;

    const buffer = Buffer.from(cleanBase64, 'base64');

    const blobName = `try-on/${userId}/${productId}.jpg`;

    await this._azureBlobService.uploadBuffer(blobName, buffer, 'image/jpeg');

    return this._azureBlobService.generateReadUrl(blobName);
  }
}
