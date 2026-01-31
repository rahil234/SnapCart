import { ApiProperty } from '@nestjs/swagger';

export class UploadMediaResponseDto {
  @ApiProperty({ example: 'https://example.com/upload' })
  uploadUrl: string;

  @ApiProperty({ example: 'https://example.com/media/12345' })
  readUrl: string;

  constructor(data: { uploadUrl: string; readUrl: string }) {
    this.uploadUrl = data.uploadUrl;
    this.readUrl = data.readUrl;
  }
}
