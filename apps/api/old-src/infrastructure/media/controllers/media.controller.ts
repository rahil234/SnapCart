import { Controller, Delete, Get, Param } from '@nestjs/common';

import { Role } from '@/common/enums/role.enum';
import { Roles } from '@/common/decorators/roles.decorator';
import { HttpResponse } from '@/common/dto/http-response.dto';
import { MediaService } from '@/domain/media/services/media.service';
import { UserId } from '@/common/decorators/user-id.decorator';
import { ApiResponseWithType } from '@/common/decorators/api-response.decorator';
import { UploadMediaResponseDto } from '@/media/dto/response/upload-media.response.dto';

@Controller('media')
export class MediaController {
  constructor(private readonly _mediaService: MediaService) {}

  /* ---------- CATEGORY ---------- */

  @Get('/upload/category/:categoryId')
  @Roles(Role.ADMIN)
  @ApiResponseWithType({}, UploadMediaResponseDto)
  getCategoryUploadUrl(
    @Param('categoryId') categoryId: string,
  ): HttpResponse<UploadMediaResponseDto> {
    const data = this._mediaService.getCategoryUploadUrl(categoryId);

    return {
      data: new UploadMediaResponseDto(data),
      message: 'Upload URL generated successfully',
      success: true,
    };
  }

  @Delete('/category/:categoryId')
  @Roles(Role.ADMIN)
  async removeCategoryImages(
    @Param('categoryId') categoryId: string,
  ): Promise<HttpResponse> {
    await this._mediaService.removeCategoryImages(categoryId);

    return {
      success: true,
      message: 'Category images removed successfully',
    };
  }

  /* ---------- PRODUCT ---------- */

  @Get('/upload/product/:productId/thumbnail')
  @Roles(Role.ADMIN)
  @ApiResponseWithType({}, UploadMediaResponseDto)
  getProductThumbnailUploadUrl(
    @Param('productId') productId: string,
  ): HttpResponse<UploadMediaResponseDto> {
    const data = this._mediaService.getProductThumbnailUploadUrl(productId);

    return {
      data: new UploadMediaResponseDto(data),
      message: 'Upload URL generated successfully',
      success: true,
    };
  }

  @Get('/upload/product/:productId/:order')
  @Roles(Role.ADMIN)
  @ApiResponseWithType({}, UploadMediaResponseDto)
  getProductUploadUrl(
    @Param('productId') productId: string,
    @Param('order') order: number,
  ): HttpResponse<UploadMediaResponseDto> {
    const data = this._mediaService.getProductUploadUrl(productId, order);

    return {
      data: new UploadMediaResponseDto(data),
      message: 'Upload URL generated successfully',
      success: true,
    };
  }

  @Delete('/product/:productId/thumbnail')
  @Roles(Role.ADMIN)
  async removeProductThumbnail(
    @Param('productId') productId: string,
  ): Promise<HttpResponse> {
    await this._mediaService.removeProductThumbnail(productId);

    return {
      success: true,
      message: 'Product thumbnail removed successfully',
    };
  }

  @Delete('/product/:productId/images')
  @Roles(Role.ADMIN)
  async removeAllProductImages(
    @Param('productId') productId: string,
  ): Promise<HttpResponse> {
    await this._mediaService.removeAllProductImages(productId);

    return {
      success: true,
      message: 'Product images removed successfully',
    };
  }

  @Delete('/product/:productId/:order')
  @Roles(Role.ADMIN)
  async removeAllProductImageByOrder(
    @Param('productId') productId: string,
    @Param('order') order: number,
  ): Promise<HttpResponse> {
    await this._mediaService.removeAllProductImageByOrder(productId, order);

    return {
      success: true,
      message: 'Product images removed successfully',
    };
  }

  /* ---------- USER TRY-ON ---------- */

  @Get('/upload/user/try-on')
  @Roles(Role.USER)
  @ApiResponseWithType({}, UploadMediaResponseDto)
  getUserTryOnUploadUrl(
    @UserId() userId: string,
  ): HttpResponse<UploadMediaResponseDto> {
    const data = this._mediaService.getUserTryOnUploadUrl(userId);

    return {
      data: new UploadMediaResponseDto(data),
      message: 'Upload URL generated successfully',
      success: true,
    };
  }

  @Delete('/user/try-on')
  @Roles(Role.USER)
  async removeUserTryOnImages(@UserId() userId: string): Promise<HttpResponse> {
    await this._mediaService.removeUserTryOnImages(userId);

    return {
      success: true,
      message: 'User try-on images removed successfully',
    };
  }

  /* ---------- HERO IMAGE ---------- */

  @Get('/upload/hero-image')
  @Roles(Role.ADMIN)
  @ApiResponseWithType({}, UploadMediaResponseDto)
  getHeroImageUploadUrl(): HttpResponse<UploadMediaResponseDto> {
    const data = this._mediaService.getHeroImageUploadUrl();

    return {
      data: new UploadMediaResponseDto(data),
      message: 'Upload URL generated successfully',
      success: true,
    };
  }

  @Delete('/hero-image')
  @Roles(Role.ADMIN)
  async removeHeroImage(): Promise<HttpResponse> {
    await this._mediaService.removeHeroImage();

    return {
      success: true,
      message: 'Hero image removed successfully',
    };
  }
}
