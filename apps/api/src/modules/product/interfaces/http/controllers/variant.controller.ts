import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { Role } from '@/shared/enums/role.enum';
import {
  ApiCommonErrorResponses,
  ApiAuthErrorResponses,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@/shared/decorators/api-error-responses.decorator';
import { Roles } from '@/shared/decorators/roles.decorator';
import { Public } from '@/shared/decorators/public.decorator';
import { HttpResponse } from '@/shared/dto/common/http-response.dto';
import { ApiResponseWithType } from '@/shared/decorators/api-response.decorator';

// DTOs
import { CreateVariantDto } from '../dtos/request/create-variant.dto';
import { UpdateVariantDto } from '../dtos/request/update-variant.dto';
import { UpdateVariantStockDto } from '../dtos/request/update-variant-stock.dto';
import { VariantResponseDto } from '../dtos/response/variant-response.dto';

// Commands
import {
  CreateVariantCommand,
  UpdateVariantCommand,
  UpdateVariantStockCommand,
  GeneratePresignedImageUploadCommand,
  SaveVariantImageCommand,
  DeleteVariantImageCommand,
} from '@/modules/product/application/commands';

// Queries
import {
  GetVariantByIdQuery,
  GetVariantsByProductIdQuery,
} from '@/modules/product/application/queries';
import { ParseCUIDPipe } from '@/shared/pipes/parse-cuid.pipe';
import { UploadVariantImageResponseDto } from '@/modules/product/interfaces/http/dtos/response/upload-variant-image-response.dto';
import { SaveVariantImageDto } from '@/modules/product/interfaces/http/dtos/request/upload-variant-image.dto';
import { UserId } from '@/shared/decorators/user-id.decorator';

/**
 * Variant Controller
 *
 * Handles all variant (sellable unit) operations.
 * Variants are the actual items customers can purchase.
 */
@ApiTags('Product Variants')
@Controller('products')
export class VariantController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // ============================================
  // CREATE VARIANT
  // ============================================

  @Post(':productId/variants')
  @Roles(Role.ADMIN, Role.SELLER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add variant to product',
    description:
      'Creates a new sellable variant for an existing product. Required to make product purchasable.',
  })
  @ApiParam({
    name: 'productId',
    description: 'Product UUID to add variant to',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.CREATED,
      description: 'Variant created successfully',
    },
    VariantResponseDto,
  )
  @ApiNotFoundResponse('Product')
  @ApiConflictResponse('SKU already exists')
  @ApiCommonErrorResponses()
  @ApiAuthErrorResponses()
  async createVariant(
    @Param('productId', ParseCUIDPipe) productId: string,
    @Body() createVariantDto: CreateVariantDto,
    @UserId() userId: string,
  ): Promise<HttpResponse<VariantResponseDto>> {
    const command = new CreateVariantCommand(
      productId,
      createVariantDto.variantName,
      createVariantDto.price,
      createVariantDto.stock,
      userId,
      createVariantDto.discountPercent,
      createVariantDto.attributes,
    );

    const variant = await this.commandBus.execute(command);

    return {
      message: 'Variant created successfully',
      data: VariantResponseDto.fromDomain(variant),
    };
  }

  // ============================================
  // GET VARIANTS
  // ============================================

  @Get(':productId/variants')
  @Public()
  @ApiOperation({
    summary: 'List all variants for a product',
    description: 'Returns all variants (sizes, types) available for a product.',
  })
  @ApiParam({
    name: 'productId',
    description: 'Product CUID',
    type: 'string',
    format: 'cuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Variants retrieved successfully',
      isArray: true,
    },
    VariantResponseDto,
  )
  @ApiNotFoundResponse('Product')
  @ApiCommonErrorResponses()
  async getVariantsByProduct(
    @Param('productId', ParseCUIDPipe) productId: string,
  ): Promise<HttpResponse<VariantResponseDto[]>> {
    const query = new GetVariantsByProductIdQuery(productId);
    const variants = await this.queryBus.execute(query);

    return {
      message: 'Variants retrieved successfully',
      data: variants.map(VariantResponseDto.fromDomain),
    };
  }

  @Get('variants/:variantId')
  @Public()
  @ApiOperation({
    summary: 'Get variant by ID',
    description: 'Retrieves detailed information about a specific variant.',
  })
  @ApiParam({
    name: 'variantId',
    description: 'Variant UUID',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Variant retrieved successfully',
    },
    VariantResponseDto,
  )
  @ApiNotFoundResponse('Variant')
  @ApiCommonErrorResponses()
  async getVariant(
    @Param('variantId', ParseCUIDPipe) variantId: string,
  ): Promise<HttpResponse<VariantResponseDto>> {
    const query = new GetVariantByIdQuery(variantId);
    const variant = await this.queryBus.execute(query);

    return {
      message: 'Variant retrieved successfully',
      data: VariantResponseDto.fromDomain(variant),
    };
  }

  // ============================================
  // UPDATE VARIANT
  // ============================================

  @Patch('variants/:variantId')
  @Roles(Role.ADMIN, Role.SELLER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update variant details',
    description:
      'Updates commerce attributes of a variant (price, stock, discount, etc.). Use dedicated endpoints for specific operations.',
  })
  @ApiParam({
    name: 'variantId',
    description: 'Variant UUID',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Variant updated successfully',
  })
  @ApiNotFoundResponse('Variant')
  @ApiCommonErrorResponses()
  @ApiAuthErrorResponses()
  async updateVariant(
    @Param('variantId', ParseCUIDPipe) variantId: string,
    @Body() updateVariantDto: UpdateVariantDto,
  ): Promise<HttpResponse> {
    const command = new UpdateVariantCommand(
      variantId,
      updateVariantDto.variantName,
      updateVariantDto.price,
      updateVariantDto.discountPercent,
      updateVariantDto.stock,
      updateVariantDto.status as any, // DTO enum matches domain enum
      updateVariantDto.isActive,
      updateVariantDto.sellerProfileId,
      updateVariantDto.attributes,
    );

    await this.commandBus.execute(command);

    return {
      message: 'Variant updated successfully',
    };
  }

  // ============================================
  // STOCK MANAGEMENT
  // ============================================

  @Patch('variants/:variantId/stock')
  @Roles(Role.ADMIN, Role.SELLER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update variant stock',
    description:
      'Dedicated endpoint for stock management. Supports set, add, and reduce operations.',
  })
  @ApiParam({
    name: 'variantId',
    description: 'Variant UUID',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Stock updated successfully',
  })
  @ApiNotFoundResponse('Variant')
  @ApiCommonErrorResponses()
  @ApiAuthErrorResponses()
  async updateStock(
    @Param('variantId', ParseCUIDPipe) variantId: string,
    @Body() updateStockDto: UpdateVariantStockDto,
  ): Promise<HttpResponse> {
    const command = new UpdateVariantStockCommand(
      variantId,
      updateStockDto.action,
      updateStockDto.quantity,
    );

    await this.commandBus.execute(command);

    return {
      message: `Stock ${updateStockDto.action} operation completed successfully`,
    };
  }

  // ============================================
  // VARIANT STATUS MANAGEMENT
  // ============================================

  @Patch('variants/:variantId/activate')
  @Roles(Role.ADMIN, Role.SELLER)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Activate variant',
    description: 'Makes variant available for purchase (if stock > 0).',
  })
  @ApiParam({
    name: 'variantId',
    description: 'Variant UUID',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Variant activated successfully',
  })
  @ApiNotFoundResponse('Variant')
  @ApiCommonErrorResponses()
  @ApiAuthErrorResponses()
  async activateVariant(
    @Param('variantId', ParseCUIDPipe) variantId: string,
  ): Promise<HttpResponse> {
    const command = new UpdateVariantCommand(
      variantId,
      undefined, // variantName
      undefined, // price
      undefined, // discountPercent
      undefined, // stock
      undefined, // status
      true, // isActive
    );

    await this.commandBus.execute(command);

    return {
      message: 'Variant activated successfully',
    };
  }

  @Patch('variants/:variantId/deactivate')
  @Roles(Role.ADMIN, Role.SELLER)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Deactivate variant',
    description: 'Makes variant unavailable for purchase (temporarily).',
  })
  @ApiParam({
    name: 'variantId',
    description: 'Variant UUID',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Variant deactivated successfully',
  })
  @ApiNotFoundResponse('Variant')
  @ApiCommonErrorResponses()
  @ApiAuthErrorResponses()
  async deactivateVariant(
    @Param('variantId', ParseCUIDPipe) variantId: string,
  ): Promise<HttpResponse> {
    const command = new UpdateVariantCommand(
      variantId,
      undefined, // variantName
      undefined, // price
      undefined, // discountPercent
      undefined, // stock
      undefined, // status
      false, // isActive
    );

    await this.commandBus.execute(command);

    return {
      message: 'Variant deactivated successfully',
    };
  }

  // ============================================
  // DELETE VARIANT
  // ============================================

  @Delete('variants/:variantId')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete variant (soft delete)',
    description: 'Soft deletes a variant. Admin only.',
  })
  @ApiParam({
    name: 'variantId',
    description: 'Variant UUID',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Variant deleted successfully',
  })
  @ApiNotFoundResponse('Variant')
  @ApiCommonErrorResponses()
  @ApiAuthErrorResponses()
  async deleteVariant(
    @Param('variantId', ParseCUIDPipe) variantId: string,
  ): Promise<HttpResponse> {
    // Soft delete by setting isActive = false and marking deleted
    const command = new UpdateVariantCommand(
      variantId,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      false, // isActive
    );

    await this.commandBus.execute(command);

    return {
      message: 'Variant deleted successfully',
    };
  }

  // ============================================
  // IMAGE MANAGEMENT
  // ============================================

  @Post('variants/:variantId/images')
  @Roles(Role.SELLER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Upload variant image',
    description: 'Uploads an image for a variant and associates it.',
  })
  @ApiParam({
    name: 'variantId',
    description: 'Variant CUID',
    type: 'string',
    format: 'cuid',
    example: 'lqctr0s04iwd0hmx46g2xd6b',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.CREATED,
      description: 'Image uploaded successfully',
    },
    UploadVariantImageResponseDto,
  )
  @ApiNotFoundResponse('Variant')
  @ApiCommonErrorResponses()
  @ApiAuthErrorResponses()
  async uploadVariantImage(
    @Param('variantId', ParseCUIDPipe) variantId: string,
  ): Promise<HttpResponse<UploadVariantImageResponseDto>> {
    const generateCommand = new GeneratePresignedImageUploadCommand(variantId);
    const data = await this.commandBus.execute(generateCommand);

    return {
      message: 'Image upload URL generated successfully',
      data: UploadVariantImageResponseDto.fromDomain(data),
    };
  }

  @Post('variants/:variantId/images/save')
  @Roles(Role.ADMIN, Role.SELLER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Save variant image',
    description: 'Saves the uploaded image information to the variant.',
  })
  @ApiParam({
    name: 'variantId',
    description: 'Variant UUID',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Image saved successfully',
  })
  @ApiNotFoundResponse('Variant')
  @ApiCommonErrorResponses()
  @ApiAuthErrorResponses()
  async saveVariantImage(
    @Param('variantId', ParseCUIDPipe) variantId: string,
    @Body() dto: SaveVariantImageDto,
  ): Promise<HttpResponse> {
    const command = new SaveVariantImageCommand(
      variantId,
      dto.publicId,
      dto.url,
    );
    await this.commandBus.execute(command);

    return {
      message: 'Image saved successfully',
    };
  }

  @Delete('variants/:variantId/images/:position')
  @Roles(Role.ADMIN, Role.SELLER)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete variant image',
    description: 'Deletes an image associated with a variant.',
  })
  @ApiParam({
    name: 'variantId',
    description: 'Variant UUID',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Image deleted successfully',
  })
  @ApiNotFoundResponse('Variant')
  @ApiCommonErrorResponses()
  @ApiAuthErrorResponses()
  async deleteVariantImage(
    @Param('variantId', ParseCUIDPipe) variantId: string,
    @Param('position', ParseIntPipe) position: number,
  ): Promise<HttpResponse> {
    const command = new DeleteVariantImageCommand(variantId, position);
    await this.commandBus.execute(command);

    return {
      message: 'Image deleted successfully',
    };
  }
}
