import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { Role } from '@/shared/enums/role.enum';
import {
  ApiAuthErrorResponses,
  ApiCommonErrorResponses,
  ApiNotFoundResponse,
} from '@/shared/decorators/api-error-responses.decorator';
import { Roles } from '@/shared/decorators/roles.decorator';
import { HttpResponse } from '@/shared/dto/common/http-response.dto';
import { ApiResponseWithType } from '@/shared/decorators/api-response.decorator';

import {
  GetAllOffersQuery,
  GetOfferQuery,
} from '@/modules/offer/application/queries';
import {
  ActivateOfferCommand,
  CreateOfferCommand,
  DeactivateOfferCommand,
  UpdateOfferCommand,
} from '@/modules/offer/application/commands';
import { OfferResponseDto } from '../dtos/response';
import { CreateOfferDto, UpdateOfferDto } from '../dtos/request';

@ApiTags('Admin - Offers')
@ApiBearerAuth()
@Controller('admin/offers')
@Roles(Role.ADMIN)
export class AdminOfferController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create new offer',
    description:
      'Create a new promotional offer with priority and applicability rules',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.CREATED,
      description: 'Offer created successfully',
    },
    OfferResponseDto,
  )
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async create(
    @Body() dto: CreateOfferDto,
  ): Promise<HttpResponse<OfferResponseDto>> {
    const offer = await this.commandBus.execute(
      new CreateOfferCommand(
        dto.name,
        dto.type,
        dto.discount,
        new Date(dto.startDate),
        new Date(dto.endDate),
        dto.minPurchaseAmount,
        dto.maxDiscount,
        dto.priority,
        dto.categories || [],
        dto.products || [],
        dto.isStackable,
        dto.description,
      ),
    );

    return {
      message: 'Offer created successfully',
      data: OfferResponseDto.fromDomain(offer),
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all offers',
    description: 'Retrieve all offers with pagination',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
    example: 10,
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Offers retrieved successfully',
      isArray: true,
    },
    OfferResponseDto,
  )
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<HttpResponse<OfferResponseDto[]>> {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const result = await this.queryBus.execute(
      new GetAllOffersQuery(skip, limitNum),
    );

    return {
      message: 'Offers retrieved successfully',
      data: result.offers.map(OfferResponseDto.fromDomain),
    };
  }

  @Get(':id')
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
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<HttpResponse<OfferResponseDto>> {
    const offer = await this.queryBus.execute(new GetOfferQuery(id));

    return {
      message: 'Offer retrieved successfully',
      data: OfferResponseDto.fromDomain(offer),
    };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update offer',
    description: 'Update offer details and configuration',
  })
  @ApiParam({
    name: 'id',
    description: 'Offer ID',
    example: 'offer_clx1234567890',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Offer updated successfully',
    },
    OfferResponseDto,
  )
  @ApiNotFoundResponse('Offer')
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOfferDto,
  ): Promise<HttpResponse<OfferResponseDto>> {
    const offer = await this.commandBus.execute(
      new UpdateOfferCommand(
        id,
        dto.name,
        dto.type,
        dto.discount,
        dto.minPurchaseAmount,
        dto.maxDiscount,
        dto.priority,
        dto.startDate ? new Date(dto.startDate) : undefined,
        dto.endDate ? new Date(dto.endDate) : undefined,
        dto.isStackable,
        dto.description,
        dto.categories,
        dto.products,
      ),
    );

    return {
      message: 'Offer updated successfully',
      data: OfferResponseDto.fromDomain(offer),
    };
  }

  @Patch(':id/activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Activate offer',
    description: 'Activate an offer to make it available',
  })
  @ApiParam({
    name: 'id',
    description: 'Offer ID',
    example: 'offer_clx1234567890',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Offer activated successfully',
    },
    undefined,
  )
  @ApiNotFoundResponse('Offer')
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async activate(@Param('id') id: string): Promise<HttpResponse> {
    await this.commandBus.execute(new ActivateOfferCommand(id));

    return {
      message: 'Offer activated successfully',
    };
  }

  @Patch(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Deactivate offer',
    description: 'Deactivate an offer to prevent it from being applied',
  })
  @ApiParam({
    name: 'id',
    description: 'Offer ID',
    example: 'offer_clx1234567890',
    schema: {
      type: 'string',
      format: 'uuid',
    },
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Offer deactivated successfully',
    },
    undefined,
  )
  @ApiNotFoundResponse('Offer')
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async deactivate(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<HttpResponse> {
    await this.commandBus.execute(new DeactivateOfferCommand(id));

    return {
      message: 'Offer deactivated successfully',
    };
  }
}
