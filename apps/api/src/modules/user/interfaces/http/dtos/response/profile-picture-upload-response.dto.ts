import { ApiProperty } from '@nestjs/swagger';

import { UploadDescriptor } from '@/shared/infrastructure/storage/upload-descriptor';

export class ProfilePictureUploadResponseDto {
  @ApiProperty({
    description: 'Storage provider (cloudinary or azure)',
    example: 'cloudinary',
  })
  provider: string;

  @ApiProperty({
    description: 'Upload URL',
    example: 'https://api.cloudinary.com/v1_1/demo/image/upload',
  })
  uploadUrl: string;

  @ApiProperty({
    description: 'HTTP method to use for upload',
    example: 'POST',
  })
  method: string;

  @ApiProperty({
    description: 'Additional fields required for upload (for Cloudinary)',
    example: {
      timestamp: '1234567890',
      signature: 'abc123...',
      api_key: 'your_api_key',
      folder: 'profile-pictures',
    },
    required: false,
  })
  fields?: Record<string, string>;

  @ApiProperty({
    description: 'Read URL for the uploaded file (for Azure)',
    required: false,
  })
  readUrl?: string;

  static fromUploadDescriptor(
    descriptor: UploadDescriptor,
  ): ProfilePictureUploadResponseDto {
    if (descriptor.provider === 'cloudinary') {
      return {
        provider: descriptor.provider,
        uploadUrl: descriptor.uploadUrl,
        method: descriptor.method,
        fields: descriptor.fields,
      };
    } else {
      return {
        provider: descriptor.provider,
        uploadUrl: descriptor.uploadUrl,
        method: descriptor.method,
        readUrl: descriptor.readUrl,
      };
    }
  }
}
