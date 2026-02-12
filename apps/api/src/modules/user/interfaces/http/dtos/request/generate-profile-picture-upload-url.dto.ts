import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateProfilePictureUploadUrlDto {
  @ApiProperty({
    description: 'File name for the profile picture',
    example: 'profile_user123_1234567890.jpg',
  })
  @IsString()
  fileName: string;
}
