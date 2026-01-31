import { QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';

import { HttpResponse } from '@/shared/dto/common/http-response.dto';
import { GetCategoryProductFeedQuery } from '@/modules/feed/application/queries';
import { ApiResponseWithType } from '@/shared/decorators/api-response.decorator';
import { GetCategoryProductFeedResponseDto } from '@/modules/feed/interfaces/http/dtos/response/get-category-product-feed.response.dto';
import { Public } from '@/shared/decorators/public.decorator';

@ApiTags('Feeds')
@Controller('feed')
export class FeedController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @Public()
  @ApiResponseWithType({ isArray: true }, GetCategoryProductFeedResponseDto)
  async getFeed(
    @Query() query: GetCategoryProductFeedQuery,
  ): Promise<HttpResponse<GetCategoryProductFeedResponseDto[]>> {
    const { categories } = await this.queryBus.execute(query);

    return {
      message: 'Feed retrieved successfully',
      data: categories,
    };
  }
}
