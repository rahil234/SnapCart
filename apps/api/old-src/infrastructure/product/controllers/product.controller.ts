import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { Role } from '@/common/enums/role.enum';
import { Roles } from '@/common/decorators/roles.decorator';
import { Public } from '@/common/decorators/public.decorator';
import { HttpResponse, HttpPaginatedResponse } from '@/common/dto/http-response.dto';

// DTOs
import { CreateProductDto } from '@/application/product/dtos/request/create-product.dto';
import { UpdateProductDto } from '@/application/product/dtos/request/update-product.dto';
import { GetProductsDto } from '@/application/product/dtos/request/get-products.dto';
import { ProductResponseDto } from '@/application/product/dtos/response/product-response.dto';
import { PaginatedProductsResponseDto } from '@/application/product/dtos/response/paginated-products-response.dto';

// Commands
import { CreateProductCommand, UpdateProductCommand } from '@/application/product/commands';

// Queries
import {
  GetProductByIdQuery,
  GetProductsQuery,
  GetProductsFeedQuery
} from '@/application/product/queries';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new product',
    description: 'Creates a new product with the provided details. Only admins can create products.'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Admin access required',
  })
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<HttpResponse<ProductResponseDto>> {
    const command = new CreateProductCommand(
      createProductDto.name,
      createProductDto.description,
      createProductDto.categoryId,
      createProductDto.price,
      createProductDto.discountPercent,
      createProductDto.tryOn,
    );

    const product = await this.commandBus.execute(command);

    return {
      success: true,
      message: 'Product created successfully',
      data: ProductResponseDto.fromDomain(product),
    };
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all products (Admin)',
    description: 'Retrieves paginated list of all products with filtering and search. Admin access required.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Products retrieved successfully',
    type: PaginatedProductsResponseDto,
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10, max: 100)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search in product name or description' })
  @ApiQuery({ name: 'categoryId', required: false, type: String, description: 'Filter by category ID' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by product status' })
  async findAll(
    @Query() query: GetProductsDto,
  ): Promise<HttpPaginatedResponse<ProductResponseDto[]>> {
    const getProductsQuery = new GetProductsQuery(
      query.page,
      query.limit,
      query.search,
      query.categoryId,
      query.status,
    );

    const result = await this.queryBus.execute(getProductsQuery);

    return {
      success: true,
      message: 'Products retrieved successfully',
      data: result.products.map(ProductResponseDto.fromDomain),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  @Get('feed')
  @Public()
  @ApiOperation({
    summary: 'Get public product feed',
    description: 'Retrieves paginated list of active products for public consumption. No authentication required.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product feed retrieved successfully',
    type: PaginatedProductsResponseDto,
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10, max: 100)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search in product name or description' })
  @ApiQuery({ name: 'categoryId', required: false, type: String, description: 'Filter by category ID' })
  async findFeed(
    @Query() query: GetProductsDto,
  ): Promise<HttpPaginatedResponse<ProductResponseDto[]>> {
    const getFeedQuery = new GetProductsFeedQuery(
      query.page,
      query.limit,
      query.search,
      query.categoryId,
    );

    const result = await this.queryBus.execute(getFeedQuery);

    return {
      success: true,
      message: 'Product feed retrieved successfully',
      data: result.products.map(ProductResponseDto.fromDomain),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Retrieves a single product by its ID. Public endpoint.'
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Product UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid product ID format',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<HttpResponse<ProductResponseDto>> {
    const query = new GetProductByIdQuery(id);
    const product = await this.queryBus.execute(query);

    return {
      success: true,
      message: 'Product retrieved successfully',
      data: ProductResponseDto.fromDomain(product),
    };
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update product',
    description: 'Updates an existing product. Only admins can update products.'
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Product UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product updated successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or product ID format',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Admin access required',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<HttpResponse<ProductResponseDto>> {
    const command = new UpdateProductCommand(
      id,
      updateProductDto.name,
      updateProductDto.description,
      updateProductDto.price,
      updateProductDto.discountPercent,
      updateProductDto.tryOn,
      updateProductDto.status,
    );

    const product = await this.commandBus.execute(command);

    return {
      success: true,
      message: 'Product updated successfully',
      data: ProductResponseDto.fromDomain(product),
    };
  }
}
