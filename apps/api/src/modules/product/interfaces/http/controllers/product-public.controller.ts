import { QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Controller, Get, Param, Query, HttpStatus } from '@nestjs/common';

import {
  HttpResponse,
  HttpPaginatedResponse,
} from '@/shared/dto/common/http-response.dto';
import { Public } from '@/shared/decorators/public.decorator';
import {
  ApiCommonErrorResponses,
  ApiNotFoundResponse,
} from '@/shared/decorators/api-error-responses.decorator';

import { GetProductsDto } from '@/modules/product/interfaces/http/dtos/request';

import {
  ProductDetailDto,
  ProductWithVariantPreviewDto,
  ProductWithVariantsResponseDto,
} from '@/modules/product/interfaces/http/dtos/response';

import {
  GetProductByIdQuery,
  GetProductsQuery,
  GetVariantsByProductIdQuery,
} from '@/modules/product/application/queries';
import { GetCategoryByIdQuery } from '@/modules/category/application/queries';
import { ApiResponseWithType } from '@/shared/decorators/api-response.decorator';

/**
 * Product Public Controller (Marketplace Browsing)
 *
 * Base route: /products
 * Public endpoints for browsing the marketplace catalog
 * Only ACTIVE products are visible
 */
@ApiTags('Products - Public')
@Controller('products')
export class ProductPublicController {
  constructor(private readonly queryBus: QueryBus) {}

  // ============================================
  // MARKETPLACE BROWSING
  // ============================================

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Browse marketplace products with preview',
    description:
      'Retrieves paginated list of ACTIVE products with first variant and category. Perfect for homepage/listing pages. Public endpoint.',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Products with variant preview retrieved successfully',
      pagination: true,
      isArray: true,
    },
    ProductWithVariantPreviewDto,
  )
  @ApiCommonErrorResponses()
  async findAll(
    @Query() query: GetProductsDto,
  ): Promise<HttpPaginatedResponse<ProductWithVariantPreviewDto[]>> {
    const getProductsQuery = new GetProductsQuery(
      query.page,
      query.limit,
      query.search,
      'active',
      query.categoryId,
    );

    const { products, meta } = await this.queryBus.execute(getProductsQuery);

    // Filter products with at least one variant
    const productsWithVariants = products.filter((p) => p.variants.length > 0);

    // Fetch categories for all products
    const categoryPromises = productsWithVariants.map((p) =>
      this.queryBus.execute(
        new GetCategoryByIdQuery(p.product.getCategoryId()),
      ),
    );
    const categories = await Promise.all(categoryPromises);

    // Map to ProductWithVariantPreviewDto with category
    const data = productsWithVariants.map((p, index) =>
      ProductWithVariantPreviewDto.fromDomain(
        p.product,
        categories[index],
        p.variants[0],
      ),
    );

    return {
      message: 'Products with variant preview retrieved successfully',
      data,
      meta,
    };
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Get product details with category',
    description:
      'Retrieves a single product by ID with category populated. Public endpoint.',
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
      description: 'Product with category and variants retrieved successfully',
    },
    ProductWithVariantsResponseDto,
  )
  @ApiNotFoundResponse('Product')
  @ApiCommonErrorResponses()
  async findOne(
    @Param('id') id: string,
  ): Promise<HttpResponse<ProductWithVariantsResponseDto>> {
    const query = new GetProductByIdQuery(id);
    const product = await this.queryBus.execute(query);

    const categoryQuery = new GetCategoryByIdQuery(product.getCategoryId());
    const category = await this.queryBus.execute(categoryQuery);

    const variantsQuery = new GetVariantsByProductIdQuery(id);
    const variants = await this.queryBus.execute(variantsQuery);

    return {
      message: 'Product with category and variants retrieved successfully',
      data: ProductWithVariantsResponseDto.fromDomainWithVariants(
        product,
        category,
        variants,
      ),
    };
  }

  @Get(':id/with-variants')
  @Public()
  @ApiOperation({
    summary: 'Get product with all variants and category',
    description:
      'Retrieves complete product details with category and all variants with images. Perfect for product detail pages. Public endpoint.',
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
      description:
        'Product details with category and variants retrieved successfully',
    },
    ProductDetailDto,
  )
  @ApiNotFoundResponse('Product')
  @ApiCommonErrorResponses()
  async getProductWithVariants(
    @Param('id') id: string,
  ): Promise<HttpResponse<ProductDetailDto>> {
    const productQuery = new GetProductByIdQuery(id);
    const product = await this.queryBus.execute(productQuery);

    const categoryQuery = new GetCategoryByIdQuery(product.getCategoryId());
    const category = await this.queryBus.execute(categoryQuery);

    const variantsQuery = new GetVariantsByProductIdQuery(id);
    const variants = await this.queryBus.execute(variantsQuery);

    return {
      message:
        'Product details with category and variants retrieved successfully',
      data: ProductDetailDto.fromDomain(product, category, variants),
    };
  }
}
