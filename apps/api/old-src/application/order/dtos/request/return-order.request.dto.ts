import { ApiPropertyOptional } from '@nestjs/swagger';

export class ReturnOrderRequestDto {
  @ApiPropertyOptional({ example: 'Damaged product' })
  reason?: string;
}
