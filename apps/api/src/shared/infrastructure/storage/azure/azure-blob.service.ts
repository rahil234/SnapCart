import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  SASProtocol,
  ContainerClient,
  BlobDeleteResponse,
} from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IStorageService } from '@/shared/infrastructure/storage/storage.interface';
import { UploadDescriptor } from '../upload-descriptor';

@Injectable()
export class AzureBlobService implements IStorageService {
  private readonly accountName: string;
  private readonly accountKey: string;
  private readonly containerName: string;

  private readonly sharedKeyCredential: StorageSharedKeyCredential;
  private readonly blobServiceClient: BlobServiceClient;
  private readonly containerClient: ContainerClient;

  constructor() {
    const configService = new ConfigService();
    this.accountName = configService.getOrThrow<string>(
      'AZURE_STORAGE_ACCOUNT',
    );
    this.accountKey = configService.getOrThrow<string>('AZURE_STORAGE_KEY');
    this.containerName = configService.getOrThrow<string>(
      'AZURE_STORAGE_CONTAINER',
    );

    this.sharedKeyCredential = new StorageSharedKeyCredential(
      this.accountName,
      this.accountKey,
    );

    this.blobServiceClient = new BlobServiceClient(
      `https://${this.accountName}.blob.core.windows.net`,
      this.sharedKeyCredential,
    );

    this.containerClient = this.blobServiceClient.getContainerClient(
      this.containerName,
    );
  }
  generatePresignedUpload(blobName: string): UploadDescriptor {
    throw new Error('Method not implemented.');
  }

  generateUploadUrl(blobName: string): string {
    const expiresOn = new Date(Date.now() + 15 * 60 * 1000);
    const permissions = BlobSASPermissions.parse('w');

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName: this.containerName,
        blobName: blobName,
        permissions,
        expiresOn,
      },
      this.sharedKeyCredential,
    ).toString();

    return `https://${this.accountName}.blob.core.windows.net/${this.containerName}/${blobName}?${sasToken}`;
  }

  generateReadUrl(blobName: string): string {
    const expiresOn = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const permissions = BlobSASPermissions.parse('r');

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName: this.containerName,
        blobName: blobName,
        permissions,
        expiresOn,
        protocol: SASProtocol.Https,
      },
      this.sharedKeyCredential,
    ).toString();

    return `https://${this.accountName}.blob.core.windows.net/${this.containerName}/${blobName}?${sasToken}`;
  }

  async listBlobs(prefix: string) {
    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName,
    );
    const blobs: string[] = [];
    for await (const blob of containerClient.listBlobsFlat({ prefix })) {
      blobs.push(blob.name);
    }
    return blobs;
  }

  async uploadBuffer(blobName: string, buffer: Buffer, mimeType: string) {
    const blockBlob = this.containerClient.getBlockBlobClient(blobName);

    await blockBlob.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: mimeType },
    });

    return blockBlob.url;
  }

  async blobExists(blobName: string): Promise<boolean> {
    return this.containerClient.getBlobClient(blobName).exists();
  }

  async deleteBlob(blobName: string): Promise<void> {
    const blobClient = this.containerClient.getBlobClient(blobName);

    const exists = await blobClient.exists();
    if (!exists) return;

    await blobClient.delete();
  }

  async deleteByPrefix(prefix: string): Promise<void> {
    const deletePromises: Promise<BlobDeleteResponse>[] = [];

    for await (const blob of this.containerClient.listBlobsFlat({ prefix })) {
      const blobClient = this.containerClient.getBlobClient(blob.name);
      deletePromises.push(blobClient.delete());
    }

    await Promise.all(deletePromises);
  }
}
