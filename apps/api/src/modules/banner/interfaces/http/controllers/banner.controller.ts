import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Controller, Get, HttpStatus, Query } from '@nestjs/common';

import { BannerResponseDto } from '../dtos/response';
import { Public } from '@/shared/decorators/public.decorator';
import { HttpResponse } from '@/shared/dto/common/http-response.dto';
import { GetAllBannersQuery } from '@/modules/banner/application/queries';
import { ApiResponseWithType } from '@/shared/decorators/api-response.decorator';
import { ApiCommonErrorResponses } from '@/shared/decorators/api-error-responses.decorator';

@ApiTags('Banners')
@Controller('banners')
export class BannerController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Get active banners',
    description: 'Retrieve all active banners for display on the homepage',
  })
  @ApiQuery({
    name: 'activeOnly',
    required: false,
    type: Boolean,
    description: 'Filter to show only active banners (default: true for public)',
    example: true,
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Banners retrieved successfully',
      isArray: true,
    },
    BannerResponseDto,
  )
  @ApiCommonErrorResponses()
  async findAll(
    @Query('activeOnly') activeOnly: string = 'true',
  ): Promise<HttpResponse<BannerResponseDto[]>> {
    const isActiveOnly = activeOnly !== 'false';
    const banners = await this.queryBus.execute(new GetAllBannersQuery(isActiveOnly));

    return {
      message: 'Banners retrieved successfully',
      data: banners.map(BannerResponseDto.fromDomain),
    };
  }
}
