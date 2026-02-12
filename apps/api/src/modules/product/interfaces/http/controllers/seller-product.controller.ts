import {
  Controller,
  Get,
  Post,
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
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import {
  HttpResponse,
  HttpPaginatedResponse,
} from '@/shared/dto/common/http-response.dto';
import { Role } from '@/shared/enums/role.enum';
import { Roles } from '@/shared/decorators/roles.decorator';
import { UserId } from '@/shared/decorators/user-id.decorator';
import {
  ApiCommonErrorResponses,
  ApiAuthErrorResponses,
  ApiNotFoundResponse,
} from '@/shared/decorators/api-error-responses.decorator';

import { GetProductsDto } from '../dtos/request/get-products.dto';
import { CreateProductDto } from '../dtos/request/create-product.dto';
import { UpdateProductDto } from '../dtos/request/update-product.dto';
import { ProductResponseDto } from '../dtos/response/product-response.dto';

import {
  CreateProductCommand,
  UpdateProductCommand,
  ActivateProductCommand,
  DeactivateProductCommand,
} from '@/modules/product/application/commands';
import { GetSellerProductsQuery } from '@/modules/product/application/queries';
import { GetCategoryByIdQuery } from '@/modules/category/application/queries';
import { ApiResponseWithType } from '@/shared/decorators/api-response.decorator';
import { ProductUpdateIntent } from '@/modules/product/domain/policies';
import { ParseCUIDPipe } from '@/shared/pipes/parse-cuid.pipe';
import { ProductWithVariantsResponseDto } from '@/modules/product/interfaces/http/dtos/response/product-with-variants-response.dto';

/**
 * Seller Product Controller (Ownership-Based Management)
 *
 * Base route: /seller/products
 * Seller manages their own products
 * Seller sees all statuses of their products
 */
@ApiTags('Products - Seller')
@Controller('seller/products')
@Roles(Role.SELLER)
@ApiBearerAuth()
export class SellerProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // ============================================
  // SELLER DASHBOARD
  // ============================================

  @Get()
  @ApiOperation({
    summary: 'Get seller products',
    description:
      'Retrieves all products owned by the seller. Shows all statuses.',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Seller products retrieved successfully',
      pagination: true,
      isArray: true,
    },
    ProductWithVariantsResponseDto,
  )
  @ApiCommonErrorResponses()
  @ApiAuthErrorResponses()
  async getSellerProducts(
    @UserId() userId: string,
    @Query() query: GetProductsDto,
  ): Promise<HttpPaginatedResponse<ProductWithVariantsResponseDto[]>> {
    const getSellerProductsQuery = new GetSellerProductsQuery(
      userId,
      query.page,
      query.limit,
      query.search,
      query.status,
    );

    const result = await this.queryBus.execute(getSellerProductsQuery);

    // Fetch categories for all products
    const categoryPromises = result.products.map((p) =>
      this.queryBus.execute(new GetCategoryByIdQuery(p.product.getCategoryId()))
    );
    const categories = await Promise.all(categoryPromises);

    return {
      message: 'Seller products retrieved successfully',
      data: result.products.map((p, index) =>
        ProductWithVariantsResponseDto.fromDomainWithVariants(
          p.product,
          categories[index],
          p.variants,
        ),
      ),
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
  // CREATE PRODUCT
  // ============================================

  @Post()
  @ApiOperation({
    summary: 'Create new product',
    description: 'Seller creates a new product catalog entry.',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.CREATED,
      description: 'Product created successfully',
    },
    ProductResponseDto,
  )
  @ApiCommonErrorResponses()
  @ApiAuthErrorResponses()
  async create(
    @UserId() userId: string,
    @Body() createProductDto: CreateProductDto,
  ): Promise<HttpResponse<ProductResponseDto>> {
    const command = new CreateProductCommand(
      createProductDto.name,
      createProductDto.description,
      createProductDto.categoryId,
      userId,
      createProductDto.brand,
    );

    const product = await this.commandBus.execute(command);

    return {
      message:
        'Product created successfully. Add variants to make it sellable.',
      data: ProductResponseDto.fromDomain(product),
    };
  }

  // ============================================
  // UPDATE PRODUCT
  // ============================================

  @Patch(':id')
  @ApiOperation({
    summary: 'Update product',
    description: 'Seller updates their own product information.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Product updated successfully',
    },
    ProductResponseDto,
  )
  @ApiNotFoundResponse('Product')
  @ApiCommonErrorResponses()
  @ApiAuthErrorResponses()
  async update(
    @UserId() userId: string,
    @Param('id', ParseCUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<HttpResponse> {
    const command = new UpdateProductCommand(
      id,
      ProductUpdateIntent.SELLER_UPDATE,
      userId,
      updateProductDto.name,
      updateProductDto.description,
      updateProductDto.brand,
      updateProductDto.categoryId,
    );

    await this.commandBus.execute(command);

    return {
      message: 'Product updated successfully',
    };
  }

  // ============================================
  // STATUS MANAGEMENT
  // ============================================

  @Patch(':id/activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Activate product',
    description:
      'Seller activates their product to make it visible in marketplace.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    type: 'string',
    format: 'cuid',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Product activated successfully',
  })
  @ApiNotFoundResponse('Product')
  @ApiCommonErrorResponses()
  @ApiAuthErrorResponses()
  async activateProduct(
    @Param('id', ParseCUIDPipe) id: string,
  ): Promise<HttpResponse> {
    const command = new ActivateProductCommand(id);
    await this.commandBus.execute(command);

    return {
      message: 'Product activated successfully',
    };
  }

  @Patch(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Deactivate product',
    description:
      'Seller deactivates their product to hide it from marketplace.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    type: 'string',
    format: 'cuid',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Product deactivated successfully',
  })
  @ApiNotFoundResponse('Product')
  @ApiCommonErrorResponses()
  @ApiAuthErrorResponses()
  async deactivateProduct(
    @Param('id', ParseCUIDPipe) id: string,
  ): Promise<HttpResponse> {
    const command = new DeactivateProductCommand(id);
    await this.commandBus.execute(command);

    return {
      message: 'Product deactivated successfully',
    };
  }
}
