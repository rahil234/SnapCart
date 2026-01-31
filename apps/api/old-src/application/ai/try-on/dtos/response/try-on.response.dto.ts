import { ApiProperty } from '@nestjs/swagger';

export class TryOnResponseDto {
  @ApiProperty({
    type: [String],
    description: 'Array of generated try-on image URLs',
    example: [
      'https://cdn.example.com/tryon/user123/1.png',
      'https://cdn.example.com/tryon/user123/2.png',
    ],
  })
  images: string[];

  static fromImages(images: string[]): TryOnResponseDto {
    const dto = new TryOnResponseDto();
    dto.images = images;
    return dto;
  }
}
