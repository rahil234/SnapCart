import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ImageInput {
  @ApiPropertyOptional({
    description: 'Base64-encoded image data',
    example: 'iVBORw0KGgoAAAANSUhEUgAA...',
  })
  @IsOptional()
  @IsString()
  bytesBase64Encoded?: string;

  @ApiPropertyOptional({
    description: 'Google Cloud Storage URI for the image',
    example: 'gs://my-bucket/person.png',
  })
  @IsOptional()
  @IsString()
  gcsUri?: string;
}

class ProductImage {
  @ApiProperty({
    description: 'Product image details (base64 or GCS URI)',
    type: () => ImageInput,
  })
  @ValidateNested()
  @Type(() => ImageInput)
  image: ImageInput;
}

class PersonImage {
  @ApiProperty({
    description: 'Person image details (base64 or GCS URI)',
    type: () => ImageInput,
  })
  @ValidateNested()
  @Type(() => ImageInput)
  image: ImageInput;
}

export class CreateTryOnDto {
  @ApiProperty({
    description: 'Person image input for the virtual try-on model',
    type: () => PersonImage,
  })
  @ValidateNested()
  @Type(() => PersonImage)
  personImage: PersonImage;

  @ApiProperty({
    description: 'List of product images to try on',
    type: [ProductImage],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImage)
  productImages: ProductImage[];

  @ApiPropertyOptional({
    description: 'Whether to add a watermark to the generated image',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  addWatermark?: boolean;

  @ApiPropertyOptional({
    description: 'Base steps for image generation (model parameter)',
    example: 30,
  })
  @IsOptional()
  @IsInt()
  baseSteps?: number;

  @ApiPropertyOptional({
    description: 'Type of person generation (e.g., "REALISTIC")',
    example: 'REALISTIC',
  })
  @IsOptional()
  @IsString()
  personGeneration?: string;

  @ApiPropertyOptional({
    description: 'Safety setting for model output',
    example: 'STANDARD',
  })
  @IsOptional()
  @IsString()
  safetySetting?: string;

  @ApiPropertyOptional({
    description: 'Number of samples to generate',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  sampleCount?: number;

  @ApiPropertyOptional({
    description: 'Random seed for reproducibility',
    example: 1234,
  })
  @IsOptional()
  @IsInt()
  seed?: number;

  @ApiPropertyOptional({
    description: 'Cloud Storage URI for saving the generated output',
    example: 'gs://my-bucket/output/',
  })
  @IsOptional()
  @IsString()
  storageUri?: string;

  @ApiPropertyOptional({
    description: 'Output options for image format and quality',
    example: {
      mimeType: 'image/png',
      compressionQuality: 90,
    },
  })
  @IsOptional()
  outputOptions?: {
    mimeType?: string;
    compressionQuality?: number;
  };
}
