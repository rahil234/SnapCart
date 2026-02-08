import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import {
  HttpResponse,
  HttpPaginatedResponse,
} from '@/shared/dto/common/http-response.dto';
import { Role } from '@/shared/enums/role.enum';
import {
  ApiCommonErrorResponses,
  ApiAuthErrorResponses,
  ApiNotFoundResponse,
} from '@/shared/decorators/api-error-responses.decorator';
import { Roles } from '@/shared/decorators/roles.decorator';

import { GetProductsDto } from '../dtos/request/get-products.dto';
import { ProductResponseDto } from '../dtos/response/product-response.dto';

import {
  UpdateProductStatusCommand,
  DiscontinueProductCommand,
} from '@/modules/product/application/commands';
import { GetAdminProductsQuery } from '@/modules/product/application/queries';
import { ApiResponseWithType } from '@/shared/decorators/api-response.decorator';
import { ProductStatus } from '@/modules/product/domain/entities/product.entity';
import { ParseCUIDPipe } from '@/shared/pipes/parse-cuid.pipe';

/**
 * DTO for updating product status
 */
class UpdateProductStatusDto {
  @ApiProperty({
    enum: ProductStatus,
    description: 'New product status',
    example: ProductStatus.ACTIVE,
  })
  @IsEnum(ProductStatus)
  status: ProductStatus;
}

/**
 * Admin Product Controller (Governance)
 *
 * Base route: /admin/products
 * Admin governs marketplace products
 * Admin can see all products and manage statuses
 */
@ApiTags('Products - Admin')
@Controller('admin/products')
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // ============================================
  // ADMIN PANEL
  // ============================================

  @Get()
  @ApiOperation({
    summary: 'Get all products (admin)',
    description:
      'Retrieves all products with all statuses for admin governance.',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Admin products retrieved successfully',
      pagination: true,
      isArray: true,
    },
    ProductResponseDto,
  )
  @ApiCommonErrorResponses()
  @ApiAuthErrorResponses()
  async getAdminProducts(
    @Query() query: GetProductsDto,
  ): Promise<HttpPaginatedResponse<ProductResponseDto[]>> {
    const getAdminProductsQuery = new GetAdminProductsQuery(
      query.page,
      query.limit,
      query.search,
      query.status,
      query.categoryId,
    );

    const result = await this.queryBus.execute(getAdminProductsQuery);

    return {
      message: 'Admin products retrieved successfully',
      data: result.products.map(ProductResponseDto.fromDomain),
      meta: {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        hasNextPage: result.meta.hasNextPage,
        hasPrevPage: result.meta.hasPrevPage,
      },
    };
  }

  // ============================================
  // STATUS MANAGEMENT
  // ============================================

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update product status',
    description: 'Admin changes product status for governance.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product CUID',
    type: 'string',
    format: 'cuid',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Product status updated successfully',
  })
  @ApiNotFoundResponse('Product')
  @ApiCommonErrorResponses()
  @ApiAuthErrorResponses()
  async updateProductStatus(
    @Param('id', ParseCUIDPipe) id: string,
    @Body() updateStatusDto: UpdateProductStatusDto,
  ): Promise<HttpResponse> {
    const command = new UpdateProductStatusCommand(id, updateStatusDto.status);
    await this.commandBus.execute(command);

    return {
      message: 'Product status updated successfully',
    };
  }

  @Patch(':id/discontinue')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Discontinue product (permanent)',
    description: 'Admin permanently discontinues a product. ONE-WAY operation.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product CUID',
    type: 'string',
    format: 'cuid',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Product discontinued successfully',
  })
  @ApiNotFoundResponse('Product')
  @ApiCommonErrorResponses()
  @ApiAuthErrorResponses()
  async discontinueProduct(
    @Param('id', ParseCUIDPipe) id: string,
  ): Promise<HttpResponse> {
    const command = new DiscontinueProductCommand(id);
    await this.commandBus.execute(command);

    return {
      message: 'Product discontinued permanently',
    };
  }
}
