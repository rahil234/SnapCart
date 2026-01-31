import { ApiPropertyOptional } from '@nestjs/swagger';

export class CancelOrderRequestDto {
  @ApiPropertyOptional({ example: 'Ordered by mistake' })
  reason?: string;
}
