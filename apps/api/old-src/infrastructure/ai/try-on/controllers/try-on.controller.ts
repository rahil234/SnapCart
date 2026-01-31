import { Controller, Post, Body } from '@nestjs/common';

import { HTTP_RESPONSE } from '@/common/types';
import { Role } from '@/common/enums/role.enum';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserId } from '@/common/decorators/user-id.decorator';
import { CreateTryOnDto } from '@/ai/try-on/dto/create-try-on.dto';
import { TryOnService } from '@/ai/try-on/services/try-on.service';
import { TryOnResponseDto } from '@/ai/try-on/dto/response/try-on.response.dto';
import { ApiResponseWithType } from '@/common/decorators/api-response.decorator';

@Controller('ai/try-on')
export class TryOnController {
  constructor(private readonly _tryOnService: TryOnService) {}

  @Post()
  @Roles(Role.USER)
  @ApiResponseWithType({}, TryOnResponseDto)
  async tryOn(
    @Body() createTryOnDto: CreateTryOnDto,
    @UserId() userId: string,
  ): Promise<HTTP_RESPONSE<TryOnResponseDto>> {
    const data = await this._tryOnService.generateTryOn(userId, createTryOnDto);

    return {
      success: true,
      message: 'Try-on operation completed successfully',
      data: TryOnResponseDto.fromImages(data),
    };
  }
}
