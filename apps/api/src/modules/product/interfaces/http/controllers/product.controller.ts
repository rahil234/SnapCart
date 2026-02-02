import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  ParseUUIDPipe,
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
import { Public } from '@/shared/decorators/public.decorator';
import {
  ApiCommonErrorResponses,
  ApiAuthErrorResponses,
  ApiNotFoundResponse,
} from '@/shared/decorators/api-error-responses.decorator';

// DTOs
import { GetProductsDto } from '../dtos/request/get-products.dto';
import { CreateProductDto } from '../dtos/request/create-product.dto';
import { UpdateProductDto } from '../dtos/request/update-product.dto';
import { ProductResponseDto } from '../dtos/response/product-response.dto';
import { VariantResponseDto } from '../dtos/response/variant-response.dto';

// Commands
import {
  CreateProductCommand,
  UpdateProductCommand,
} from '@/modules/product/application/commands';

// Queries
import {
  GetProductByIdQuery,
  GetProductsQuery,
  GetVariantsByProductIdQuery,
} from '@/modules/product/application/queries';
import { ProductStatus } from '@/modules/product/domain/entities/product.entity';
import { ApiResponseWithType } from '@/shared/decorators/api-response.decorator';
import { ProductWithVariantsResponseDto } from '@/modules/product/interfaces/http/dtos/response/product-with-variants-response.dto';

/**
 * Product Controller
 *
 * Handles all product (catalog identity) operations.
 * Products represent catalog entries - what items exist, not pricing/stock.
 * For pricing, stock, and purchasing, see VariantController.
 */
@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // ============================================
  // CREATE PRODUCT
  // ============================================

  @Post()
  @Roles(Role.ADMIN, Role.SELLER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create new product (catalog entry)',
    description:
      'Creates a product catalog entry. This is NOT sellable yet - you must add variants to make it purchasable.',
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
    @Body() createProductDto: CreateProductDto,
  ): Promise<HttpResponse<ProductResponseDto>> {
    const command = new CreateProductCommand(
      createProductDto.name,
      createProductDto.description,
      createProductDto.categoryId,
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
  // GET PRODUCTS
  // ============================================

  @Get()
  @Public()
  @ApiOperation({
    summary: 'List all products (with pagination)',
    description:
      'Retrieves paginated list of products with optional filtering.',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Products retrieved successfully',
      pagination: true,
      isArray: true,
    },
    ProductResponseDto,
  )
  @ApiCommonErrorResponses()
  async findAll(
    @Query() query: GetProductsDto,
  ): Promise<HttpPaginatedResponse<ProductResponseDto[]>> {
    const getProductsQuery = new GetProductsQuery(
      query.page,
      query.limit,
      query.search,
      query.status,
      query.categoryId,
    );

    const result = await this.queryBus.execute(getProductsQuery);

    return {
      message: 'Products retrieved successfully',
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

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Retrieves detailed product information.',
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
      description: 'Product retrieved successfully',
    },
    ProductResponseDto,
  )
  @ApiNotFoundResponse('Product')
  @ApiCommonErrorResponses()
  async findOne(
    @Param('id') id: string,
  ): Promise<HttpResponse<ProductResponseDto>> {
    const query = new GetProductByIdQuery(id);
    const product = await this.queryBus.execute(query);

    return {
      message: 'Product retrieved successfully',
      data: ProductResponseDto.fromDomain(product),
    };
  }

  @Get(':id/with-variants')
  @Public()
  @ApiOperation({
    summary: 'Get product with all variants',
    description:
      'Returns product details along with all variants. Useful for product detail pages.',
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
      description: 'Product with variants retrieved successfully',
    },
    ProductWithVariantsResponseDto,
  )
  @ApiNotFoundResponse('Product')
  @ApiCommonErrorResponses()
  async getProductWithVariants(
    @Param('id') id: string,
  ): Promise<HttpResponse<ProductWithVariantsResponseDto>> {
    const productQuery = new GetProductByIdQuery(id);
    const product = await this.queryBus.execute(productQuery);

    const variantsQuery = new GetVariantsByProductIdQuery(id);
    const variants = await this.queryBus.execute(variantsQuery);

    return {
      message: 'Product with variants retrieved successfully',
      data: {
        product: ProductResponseDto.fromDomain(product),
        variants: variants.map(VariantResponseDto.fromDomain),
      },
    };
  }

  // ============================================
  // UPDATE PRODUCT
  // ============================================

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SELLER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update product information',
    description:
      'Updates catalog information only. Does NOT affect pricing or stock.',
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
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<HttpResponse<ProductResponseDto>> {
    const command = new UpdateProductCommand(
      id,
      updateProductDto.name,
      updateProductDto.description,
      updateProductDto.brand,
      updateProductDto.categoryId,
      updateProductDto.status as unknown as ProductStatus,
    );

    const product = await this.commandBus.execute(command);

    return {
      message: 'Product updated successfully',
      data: ProductResponseDto.fromDomain(product),
    };
  }

  // ============================================
  // STATUS MANAGEMENT
  // ============================================

  @Patch(':id/activate')
  @Roles(Role.ADMIN, Role.SELLER)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Activate product',
    description: 'Makes product visible in catalog.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Product activated successfully',
  })
  @ApiNotFoundResponse('Product')
  @ApiCommonErrorResponses()
  @ApiAuthErrorResponses()
  async activateProduct(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<HttpResponse> {
    const command = new UpdateProductCommand(
      id,
      undefined,
      undefined,
      undefined,
      undefined,
      ProductStatus.ACTIVE,
    );

    await this.commandBus.execute(command);

    return {
      message: 'Product activated successfully',
    };
  }

  @Patch(':id/deactivate')
  @Roles(Role.ADMIN, Role.SELLER)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Deactivate product',
    description: 'Hides product from catalog.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Product deactivated successfully',
  })
  @ApiNotFoundResponse('Product')
  @ApiCommonErrorResponses()
  @ApiAuthErrorResponses()
  async deactivateProduct(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<HttpResponse> {
    const command = new UpdateProductCommand(
      id,
      undefined,
      undefined,
      undefined,
      undefined,
      ProductStatus.INACTIVE,
    );

    await this.commandBus.execute(command);

    return {
      message: 'Product deactivated successfully',
    };
  }

  @Patch(':id/discontinue')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Discontinue product (permanent)',
    description: 'Permanently removes product. ONE-WAY operation.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Product discontinued successfully',
  })
  @ApiNotFoundResponse('Product')
  @ApiCommonErrorResponses()
  @ApiAuthErrorResponses()
  async discontinueProduct(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<HttpResponse> {
    const command = new UpdateProductCommand(
      id,
      undefined,
      undefined,
      undefined,
      undefined,
      ProductStatus.DISCONTINUED,
    );

    await this.commandBus.execute(command);

    return {
      message: 'Product discontinued permanently',
    };
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete product (soft delete)',
    description: 'Soft deletes product. Admin only.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Product deleted successfully',
  })
  @ApiNotFoundResponse('Product')
  @ApiCommonErrorResponses()
  @ApiAuthErrorResponses()
  async deleteProduct(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<HttpResponse> {
    const command = new UpdateProductCommand(
      id,
      undefined,
      undefined,
      undefined,
      undefined,
      ProductStatus.INACTIVE,
    );

    await this.commandBus.execute(command);

    return {
      message: 'Product deleted successfully',
    };
  }
}
