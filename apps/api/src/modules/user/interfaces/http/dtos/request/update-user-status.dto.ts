import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { AccountStatus } from '@/modules/user/domain/enums';

export class UpdateUserStatusDto {
  @ApiProperty({ description: 'Account status', enum: AccountStatus })
  @IsEnum(AccountStatus)
  status: AccountStatus;
}
