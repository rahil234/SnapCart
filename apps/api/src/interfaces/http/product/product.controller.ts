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

import {
  HttpResponse,
  HttpPaginatedResponse,
} from '@/shared/dto/common/http-response.dto';
import { Roles } from '@/shared/decorators/roles.decorator';
import { Role } from '@/shared/enums/role.enum';
import { Public } from '@/shared/decorators/public.decorator';

// DTOs
import { GetProductsDto } from '@/interfaces/http/product/dtos/request/get-products.dto';
import { CreateProductDto } from '@/interfaces/http/product/dtos/request/create-product.dto';
import { UpdateProductDto } from '@/interfaces/http/product/dtos/request/update-product.dto';
import { ProductResponseDto } from '@/interfaces/http/product/dtos/response/product-response.dto';
import { PaginatedProductsResponseDto } from '@/interfaces/http/product/dtos/response/paginated-products-response.dto';

// Commands
import {
  CreateProductCommand,
  UpdateProductCommand,
} from '@/application/product/commands';

// Queries
import {
  GetProductByIdQuery,
  GetProductsQuery,
  GetProductsFeedQuery,
} from '@/application/product/queries';
import { GetProductsFeedResult } from '@/application/product/queries/results/get-products-feed.result';

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
    description:
      'Creates a new product with the provided details. Only admins can create products.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product created successfully',
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
  ): Promise<HttpResponse> {
    const command = new CreateProductCommand(
      createProductDto.name,
      createProductDto.description,
      createProductDto.categoryId,
      createProductDto.price,
      createProductDto.discountPercent,
    );

    await this.commandBus.execute(command);

    return {
      message: 'Product created successfully',
    };
  }

  @Get()
  // @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all products (Admin)',
    description:
      'Retrieves paginated list of all products with filtering and search. Admin access required.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Products retrieved successfully',
    type: PaginatedProductsResponseDto,
  })
  @Public()
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
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  @Get('feed')
  @Public()
  @ApiOperation({
    summary: 'Get public product feed',
    description:
      'Retrieves paginated list of active products for public consumption. No authentication required.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product feed retrieved successfully',
    type: PaginatedProductsResponseDto,
  })
  async findFeed(
    @Query() query: GetProductsDto,
  ): Promise<HttpPaginatedResponse<ProductResponseDto[]>> {
    const getFeedQuery = new GetProductsFeedQuery();

    const result = await this.queryBus.execute(getFeedQuery);

    return {
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
    description: 'Retrieves a single product by its ID. Public endpoint.',
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
      message: 'Product retrieved successfully',
      data: ProductResponseDto.fromDomain(product),
    };
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update product',
    description:
      'Updates an existing product. Only admins can update products.',
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
  ): Promise<HttpResponse> {
    const command = new UpdateProductCommand(
      id,
      updateProductDto.name,
      updateProductDto.description,
      updateProductDto.price,
      updateProductDto.discountPercent,
      updateProductDto.status,
    );

    await this.commandBus.execute(command);

    return {
      message: 'Product updated successfully',
    };
  }
}
