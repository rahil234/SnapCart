import { Body, Controller, Get, Patch } from '@nestjs/common';

import { Role } from '@/common/enums/role.enum';
import { Roles } from '@/common/decorators/roles.decorator';
import { HttpResponse } from '@/common/dto/http-response.dto';
import { Public } from '@/common/decorators/public.decorator';
import { ApiResponseWithType } from '@/common/decorators/api-response.decorator';
import { LandingPageService } from '@/landing-page/services/landing-page.service';
import { UpdateLandingPageDto } from '@/landing-page/dto/request/update-landing-page.dto';
import { LandingPageResponseDto } from '@/landing-page/dto/response/landing-page-response.dto';

@Controller('landing-page')
export class LandingPageController {
  constructor(private readonly _service: LandingPageService) {}

  @Get()
  @Public()
  @ApiResponseWithType({}, LandingPageResponseDto)
  async get(): Promise<HttpResponse<LandingPageResponseDto>> {
    const data = await this._service.getLandingPage();

    return {
      success: true,
      message: 'Landing page data fetched successfully',
      data: LandingPageResponseDto.fromEntity(data),
    };
  }

  @Patch()
  @Roles(Role.ADMIN)
  @ApiResponseWithType()
  async update(@Body() dto: UpdateLandingPageDto): Promise<HttpResponse> {
    await this._service.updateLandingPage(dto);

    return {
      success: true,
      message: 'Landing page updated successfully',
    };
  }
}
