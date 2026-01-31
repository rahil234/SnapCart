import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { HTTP_RESPONSE } from '@/common/types';
import { Role } from '@/common/enums/role.enum';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserId } from '@/common/decorators/user-id.decorator';
import { SellerService } from '@/domain/seller/services/seller.service';
import { CreateSellerDto } from '@/application/admin/dtos/request/create-seller.dto';
import { AdminResponseDto } from '@/application/admin/dtos/response/admin-response.dto';
import { SellerResponseDto } from '@/application/seller/dtos/response/seller-response.dto';
import { ApiResponseWithType } from '@/common/decorators/api-response.decorator';
import { HttpResponse } from '@/common/dto/http-response.dto';

@Controller('seller')
export class SellerController {
  constructor(private readonly _sellerService: SellerService) {}

  @Get('/me')
  @Roles(Role.SELLER)
  @ApiResponseWithType({}, AdminResponseDto)
  async getMe(
    @UserId() userId: string,
  ): Promise<HttpResponse<AdminResponseDto>> {
    const data = await this._sellerService.findById(userId);

    return {
      message: 'Admin fetched successfully',
      data: AdminResponseDto.fromEntity(data),
      success: true,
    };
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiResponseWithType({ isArray: true }, SellerResponseDto)
  async getSellers(): Promise<HttpResponse<SellerResponseDto[]>> {
    const data = await this._sellerService.findAll();

    return {
      message: 'Sellers fetched successfully',
      data: SellerResponseDto.fromEntities(data),
      success: true,
    };
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiResponseWithType({}, SellerResponseDto)
  async addSeller(
    @Body() createSellerDto: CreateSellerDto,
  ): Promise<HttpResponse<SellerResponseDto>> {
    const data = await this._sellerService.create(createSellerDto);

    return {
      message: 'Seller added successfully',
      data: SellerResponseDto.fromEntity(data),
      success: true,
    };
  }

  @Post('/:id/block')
  @Roles(Role.ADMIN)
  @ApiResponseWithType({}, Boolean)
  async blockSeller(@Param('id') id: string): Promise<HTTP_RESPONSE<boolean>> {
    await this._sellerService.updateStatus(id, 'active');

    return {
      message: 'Seller blocked successfully',
      data: true,
      success: true,
    };
  }

  @Post('/:id/allow')
  @Roles(Role.ADMIN)
  @ApiResponseWithType({}, Boolean)
  async allowSeller(@Param('id') id: string): Promise<HTTP_RESPONSE<boolean>> {
    await this._sellerService.updateStatus(id, 'active');

    return {
      success: true,
      message: 'Seller allowed successfully',
      data: true,
    };
  }
}
