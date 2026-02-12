import { ApiProperty } from '@nestjs/swagger';

/**
 * Response DTO for add money operation
 */
export class AddMoneyResponseDto {
  @ApiProperty({
    description: 'Transaction ID',
    example: 'txn_xyz123',
  })
  transactionId: string;

  @ApiProperty({
    description: 'New wallet balance after adding money',
    example: 1500,
  })
  newBalance: number;

  @ApiProperty({
    description: 'Amount added',
    example: 500,
  })
  amount: number;

  @ApiProperty({
    description: 'Transaction status',
    example: 'completed',
  })
  status: string;
}
