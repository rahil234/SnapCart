import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SaveProfilePictureDto {
  @ApiProperty({
    description: 'URL of the uploaded profile picture',
    example: 'https://res.cloudinary.com/demo/image/upload/v1234567890/profile_picture.jpg',
  })
  @IsString()
  @IsUrl()
  url: string;
}
