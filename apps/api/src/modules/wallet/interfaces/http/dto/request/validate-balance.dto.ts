import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Request DTO for validating wallet balance
 */
export class ValidateBalanceDto {
  @ApiProperty({
    description: 'Amount to validate against wallet balance',
    example: 500,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  amount: number;
}
