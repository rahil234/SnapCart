import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Request DTO for adding money to wallet
 */
export class AddMoneyDto {
  @ApiProperty({
    description: 'Amount to add to wallet',
    example: 500,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiPropertyOptional({
    description: 'Description for the transaction',
    example: 'Added via Razorpay',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'External reference (e.g., payment gateway transaction ID)',
    example: 'pay_xyz123',
  })
  @IsOptional()
  @IsString()
  reference?: string;
}
