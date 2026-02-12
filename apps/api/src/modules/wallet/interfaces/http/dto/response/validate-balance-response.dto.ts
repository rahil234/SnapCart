import { ApiProperty } from '@nestjs/swagger';

/**
 * Response DTO for wallet balance validation
 */
export class ValidateBalanceResponseDto {
  @ApiProperty({
    description: 'Whether wallet has sufficient balance',
    example: true,
  })
  isValid: boolean;

  @ApiProperty({
    description: 'Current wallet balance',
    example: 1500,
  })
  currentBalance: number;

  @ApiProperty({
    description: 'Required amount for the operation',
    example: 500,
  })
  requiredAmount: number;

  @ApiProperty({
    description: 'Shortfall amount (0 if sufficient balance)',
    example: 0,
  })
  shortfall: number;
}
