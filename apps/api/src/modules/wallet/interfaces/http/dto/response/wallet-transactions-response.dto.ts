import { ApiProperty } from '@nestjs/swagger';

/**
 * Response DTO for a single wallet transaction
 */
export class TransactionResponseDto {
  @ApiProperty({
    description: 'Transaction ID',
    example: 'txn_xyz123',
  })
  id: string;

  @ApiProperty({
    description: 'Transaction amount',
    example: 500,
  })
  amount: number;

  @ApiProperty({
    description: 'Transaction type',
    example: 'credit',
    enum: ['credit', 'debit', 'refund', 'cashback'],
  })
  type: string;

  @ApiProperty({
    description: 'Transaction status',
    example: 'completed',
    enum: ['pending', 'completed', 'failed', 'reversed'],
  })
  status: string;

  @ApiProperty({
    description: 'Transaction description',
    example: 'Added money to wallet',
    type: String,
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'External reference',
    example: 'pay_xyz123',
    type: String,
    nullable: true,
  })
  reference: string | null;

  @ApiProperty({
    description: 'Associated order ID',
    example: 'order_abc456',
    type: String,
    nullable: true,
  })
  orderId: string | null;

  @ApiProperty({
    description: 'Transaction date',
    example: '2024-01-15T10:30:00Z',
    type: Date,
  })
  createdAt: Date;
}

/**
 * Response DTO for wallet transactions list
 */
export class WalletTransactionsResponseDto {
  @ApiProperty({
    description: 'List of transactions',
    type: [TransactionResponseDto],
  })
  transactions: TransactionResponseDto[];

  @ApiProperty({
    description: 'Total number of transactions',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Number of transactions returned',
    example: 20,
  })
  limit: number;

  @ApiProperty({
    description: 'Offset from start',
    example: 0,
  })
  offset: number;
}
