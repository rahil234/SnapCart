import { Controller, Body, Patch, Param, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';

import { Role } from '@/shared/enums/role.enum';
import {
  ApiCommonErrorResponses,
  ApiAuthErrorResponses,
  ApiNotFoundResponse,
} from '@/shared/decorators/api-error-responses.decorator';
import { Roles } from '@/shared/decorators/roles.decorator';
import { HttpResponse } from '@/shared/dto/common/http-response.dto';

// DTOs
import { UpdateProductDto } from '../dtos/request/update-product.dto';
import { ProductResponseDto } from '../dtos/response/product-response.dto';

// Commands
import { ProductUpdateIntent } from '@/modules/product/domain/policies';
import { UpdateProductCommand } from '@/modules/product/application/commands';

// Queries
import { ProductStatus } from '@/modules/product/domain/entities/product.entity';
import { ApiResponseWithType } from '@/shared/decorators/api-response.decorator';

/**
 * Product Controller (DEPRECATED)
 *
 * ⚠️ DEPRECATION WARNING ⚠️
 * This controller is deprecated and kept for backwards compatibility only.
 * Please use the new role-specific controllers:
 * - ProductPublicController (/products) - for marketplace browsing
 * - SellerProductController (/seller/products) - for seller management
 * - AdminProductController (/admin/products) - for admin governance
 *
 * This controller will be removed in a future version.
 */
@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly commandBus: CommandBus) {}
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
  ): Promise<HttpResponse> {
    const command = new UpdateProductCommand(
      id,
      ProductUpdateIntent.SELLER_UPDATE, // Default to seller update
      'DEPRECATED_PLACEHOLDER', // Placeholder for sellerProfileId
      updateProductDto.name,
      updateProductDto.description,
      updateProductDto.brand,
      updateProductDto.categoryId,
      updateProductDto.status as unknown as ProductStatus,
    );

    await this.commandBus.execute(command);

    return {
      message: 'Product updated successfully',
    };
  }
}
