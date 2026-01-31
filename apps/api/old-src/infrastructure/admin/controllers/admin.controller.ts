import { Controller, Get } from '@nestjs/common';

import { HTTP_RESPONSE } from '@/common/types';
import { Role } from '@/common/enums/role.enum';
import { Roles } from '@/common/decorators/roles.decorator';
import { AdminService } from '@/domain/admin/services/admin.service';
import { UserId } from '@/common/decorators/user-id.decorator';
import { AdminResponseDto } from '@/application/admin/dtos/response/admin-response.dto';
import { ApiResponseWithType } from '@/common/decorators/api-response.decorator';

@Controller('admin')
export class AdminController {
  constructor(private readonly _adminService: AdminService) {}

  @Get('/me')
  @Roles(Role.ADMIN)
  @ApiResponseWithType({}, AdminResponseDto)
  async getMe(
    @UserId() userId: string,
  ): Promise<HTTP_RESPONSE<AdminResponseDto>> {
    const data = await this._adminService.findById(userId);

    return {
      message: 'Admin fetched successfully',
      data: AdminResponseDto.fromEntity(data),
      success: true,
    };
  }
}
