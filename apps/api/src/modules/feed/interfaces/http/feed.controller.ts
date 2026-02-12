import { QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Controller, Get, Query, HttpStatus } from '@nestjs/common';

import { HttpResponse } from '@/shared/dto/common/http-response.dto';
import { GetCategoryProductFeedQuery } from '@/modules/feed/application/queries';
import { ApiResponseWithType } from '@/shared/decorators/api-response.decorator';
import { GetCategoryProductFeedResponseDto } from '@/modules/feed/interfaces/http/dtos/response/get-category-product-feed.response.dto';
import { Public } from '@/shared/decorators/public.decorator';
import { ApiCommonErrorResponses } from '@/shared/decorators/api-error-responses.decorator';

@ApiTags('Feeds')
@Controller('feed')
export class FeedController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Get category product feed',
    description: 'Retrieves categories with their products for feed display',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Feed retrieved successfully',
      isArray: true,
    },
    GetCategoryProductFeedResponseDto,
  )
  @ApiCommonErrorResponses()
  async getFeed(
    @Query() query: GetCategoryProductFeedQuery,
  ): Promise<HttpResponse<GetCategoryProductFeedResponseDto[]>> {
    const { categories } = await this.queryBus.execute(query);

    return {
      message: 'Feed retrieved successfully',
      data: categories.map(GetCategoryProductFeedResponseDto.fromCategory),
    };
  }
}
