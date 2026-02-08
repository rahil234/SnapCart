import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { Roles } from '@/shared/decorators/roles.decorator';
import { HttpResponse } from '@/shared/dto/common/http-response.dto';
import { ApiResponseWithType } from '@/shared/decorators/api-response.decorator';
import {
  ApiAuthErrorResponses,
  ApiCommonErrorResponses,
  ApiNotFoundResponse,
} from '@/shared/decorators/api-error-responses.decorator';

import { CreateCouponDto, UpdateCouponDto } from '../dtos/request';
import { CouponResponseDto, CouponUsageResponseDto } from '../dtos/response';
import {
  ActivateCouponCommand,
  CreateCouponCommand,
  DeactivateCouponCommand,
  UpdateCouponCommand,
} from '@/modules/coupon/application/commands';
import {
  GetAllCouponsQuery,
  GetCouponQuery,
  GetCouponUsageHistoryQuery,
} from '@/modules/coupon/application/queries';

@ApiTags('Admin - Coupons')
@ApiBearerAuth()
@Controller('admin/coupons')
@Roles(Role.ADMIN)
export class AdminCouponController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create new coupon',
    description:
      'Create a new discount coupon with usage limits and validation rules',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.CREATED,
      description: 'Coupon created successfully',
    },
    CouponResponseDto,
  )
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async create(
    @Body() dto: CreateCouponDto,
  ): Promise<HttpResponse<CouponResponseDto>> {
    const coupon = await this.commandBus.execute(
      new CreateCouponCommand(
        dto.code,
        dto.type,
        dto.discount,
        dto.minAmount,
        new Date(dto.startDate),
        new Date(dto.endDate),
        dto.maxDiscount,
        dto.usageLimit,
        dto.maxUsagePerUser,
        dto.applicableTo,
        dto.isStackable,
        dto.description,
      ),
    );

    return {
      message: 'Coupon created successfully',
      data: CouponResponseDto.fromDomain(coupon),
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all coupons',
    description: 'Retrieve all coupons with pagination',
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
      isArray: true,
      status: HttpStatus.OK,
      description: 'Coupons retrieved successfully',
    },
    CouponResponseDto,
  )
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<HttpResponse<CouponResponseDto[]>> {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const result = await this.queryBus.execute(
      new GetAllCouponsQuery(skip, limitNum),
    );

    return {
      message: 'Coupons retrieved successfully',
      data: result.coupons.map(CouponResponseDto.fromDomain),
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get coupon by ID',
    description: 'Retrieve detailed information about a specific coupon',
  })
  @ApiParam({
    name: 'id',
    description: 'Coupon ID',
    example: 'clx1234567890',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Coupon retrieved successfully',
    },
    CouponResponseDto,
  )
  @ApiNotFoundResponse('Coupon')
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async findOne(
    @Param('id') id: string,
  ): Promise<HttpResponse<CouponResponseDto>> {
    const coupon = await this.queryBus.execute(new GetCouponQuery(id));

    return {
      message: 'Coupon retrieved successfully',
      data: CouponResponseDto.fromDomain(coupon),
    };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update coupon',
    description: 'Update coupon details and configuration',
  })
  @ApiParam({
    name: 'id',
    description: 'Coupon ID',
    example: 'clx1234567890',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Coupon updated successfully',
    },
    CouponResponseDto,
  )
  @ApiNotFoundResponse('Coupon')
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCouponDto,
  ): Promise<HttpResponse<CouponResponseDto>> {
    const coupon = await this.commandBus.execute(
      new UpdateCouponCommand(
        id,
        dto.code,
        dto.type,
        dto.discount,
        dto.minAmount,
        dto.maxDiscount,
        dto.startDate ? new Date(dto.startDate) : undefined,
        dto.endDate ? new Date(dto.endDate) : undefined,
        dto.usageLimit,
        dto.maxUsagePerUser,
        dto.applicableTo,
        dto.isStackable,
        dto.description,
      ),
    );

    return {
      message: 'Coupon updated successfully',
      data: CouponResponseDto.fromDomain(coupon),
    };
  }

  @Patch(':id/activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Activate coupon',
    description: 'Activate a coupon to make it available for use',
  })
  @ApiParam({
    name: 'id',
    description: 'Coupon ID',
    example: 'clx1234567890',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Coupon activated successfully',
    },
    undefined,
  )
  @ApiNotFoundResponse('Coupon')
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async activate(@Param('id') id: string): Promise<HttpResponse> {
    await this.commandBus.execute(new ActivateCouponCommand(id));

    return {
      message: 'Coupon activated successfully',
    };
  }

  @Patch(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Deactivate coupon',
    description: 'Deactivate a coupon to prevent further use',
  })
  @ApiParam({
    name: 'id',
    description: 'Coupon ID',
    example: 'clx1234567890',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Coupon deactivated successfully',
    },
    undefined,
  )
  @ApiNotFoundResponse('Coupon')
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async deactivate(@Param('id') id: string): Promise<HttpResponse> {
    await this.commandBus.execute(new DeactivateCouponCommand(id));

    return {
      message: 'Coupon deactivated successfully',
    };
  }

  @Get(':id/usage')
  @ApiOperation({
    summary: 'Get coupon usage history',
    description: 'Retrieve detailed usage history for a specific coupon',
  })
  @ApiParam({
    name: 'id',
    description: 'Coupon ID',
    example: 'clx1234567890',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Coupon usage history retrieved successfully',
      isArray: true,
    },
    CouponUsageResponseDto,
  )
  @ApiNotFoundResponse('Coupon')
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async getUsageHistory(
    @Param('id') id: string,
  ): Promise<HttpResponse<CouponUsageResponseDto[]>> {
    const usages = await this.queryBus.execute(
      new GetCouponUsageHistoryQuery(id),
    );

    return {
      message: 'Coupon usage history retrieved successfully',
      data: usages.map(CouponUsageResponseDto.fromDomain),
    };
  }
}
