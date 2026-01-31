import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsEnum, Min } from 'class-validator';

import { AccountStatus } from '@/modules/user/domain/enums';

export class GetUsersDto {
  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 10 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Search term' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by status', enum: AccountStatus })
  @IsEnum(AccountStatus)
  @IsOptional()
  status?: AccountStatus;
}
