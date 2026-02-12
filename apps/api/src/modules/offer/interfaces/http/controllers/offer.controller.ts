import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Controller, Get, HttpStatus, Param } from '@nestjs/common';

import {
  ApiCommonErrorResponses,
  ApiNotFoundResponse,
} from '@/shared/decorators/api-error-responses.decorator';
import { Public } from '@/shared/decorators/public.decorator';
import { HttpResponse } from '@/shared/dto/common/http-response.dto';
import { ApiResponseWithType } from '@/shared/decorators/api-response.decorator';

import {
  GetActiveOffersQuery,
  GetOfferQuery,
  GetProductOffersQuery,
} from '@/modules/offer/application/queries';
import { OfferResponseDto } from '../dtos/response';

@ApiTags('Offers')
@Controller('offers')
export class OfferController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Get all active offers',
    description: 'Returns all currently active offers sorted by priority',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Active offers retrieved successfully',
      isArray: true,
    },
    OfferResponseDto,
  )
  @ApiCommonErrorResponses()
  async getActiveOffers(): Promise<HttpResponse<OfferResponseDto[]>> {
    const offers = await this.queryBus.execute(new GetActiveOffersQuery());

    return {
      message: 'Active offers retrieved successfully',
      data: offers.map(OfferResponseDto.fromDomain),
    };
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Get offer by ID',
    description: 'Retrieve detailed information about a specific offer',
  })
  @ApiParam({
    name: 'id',
    description: 'Offer ID',
    example: 'offer_clx1234567890',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Offer retrieved successfully',
    },
    OfferResponseDto,
  )
  @ApiNotFoundResponse('Offer')
  @ApiCommonErrorResponses()
  async getOffer(
    @Param('id') id: string,
  ): Promise<HttpResponse<OfferResponseDto>> {
    const offer = await this.queryBus.execute(new GetOfferQuery(id));

    return {
      message: 'Offer retrieved successfully',
      data: OfferResponseDto.fromDomain(offer),
    };
  }

  @Get('product/:productId')
  @Public()
  @ApiOperation({
    summary: 'Get offers for product',
    description:
      'Returns all active offers applicable to a specific product, sorted by priority',
  })
  @ApiParam({
    name: 'productId',
    description: 'Product ID',
    example: 'prod_clx1234567890',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Product offers retrieved successfully',
      isArray: true,
    },
    OfferResponseDto,
  )
  @ApiCommonErrorResponses()
  async getProductOffers(
    @Param('productId') productId: string,
  ): Promise<HttpResponse<OfferResponseDto[]>> {
    const offers = await this.queryBus.execute(
      new GetProductOffersQuery(productId),
    );

    return {
      message: 'Product offers retrieved successfully',
      data: offers.map(OfferResponseDto.fromDomain),
    };
  }
}
