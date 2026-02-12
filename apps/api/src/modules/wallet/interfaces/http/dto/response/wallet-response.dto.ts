import { ApiProperty } from '@nestjs/swagger';

/**
 * Response DTO for wallet information
 */
export class WalletResponseDto {
  @ApiProperty({
    description: 'Wallet ID',
    example: 'wallet_xyz123',
  })
  id: string;

  @ApiProperty({
    description: 'Customer ID',
    example: 'cust_abc456',
  })
  customerId: string;

  @ApiProperty({
    description: 'Current wallet balance',
    example: 1500.50,
  })
  balance: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'INR',
  })
  currency: string;

  @ApiProperty({
    description: 'Whether the wallet is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Wallet creation date',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Wallet last update date',
    example: '2024-01-20T15:45:00Z',
  })
  updatedAt: Date;
}
