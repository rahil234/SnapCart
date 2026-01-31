import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Query,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { Role } from '@/common/enums/role.enum';
import { Roles } from '@/common/decorators/roles.decorator';
import {
  HttpPaginatedResponse,
  HttpResponse,
} from '@/common/dto/http-response.dto';
import { UserId } from '@/common/decorators/user-id.decorator';
import { AddressService } from '@/domain/user/services/address.service';
import { UpdateUserDto } from '@/application/user/dtos/request/update-user.dto';
import { UserResponseDto } from '@/application/user/dtos/response/user-response.dto';
import { UpdateAddressDto } from '@/application/user/dtos/request/update-address.dto';
import { CreateAddressDto } from '@/application/user/dtos/request/create-address.dto';
import { AddressResponseDto } from '@/application/user/dtos/response/address-response.dto';
import { UpdateStatusUserDto } from '@/application/user/dtos/request/update-status-user.dto';
import { ApiResponseWithType } from '@/common/decorators/api-response.decorator';
import { UserPaginatedQueryDto } from '@/application/user/dtos/request/user-paginated-query.dto';

// Commands
import { UpdateUserCommand, UpdateUserStatusCommand } from '@/application/user/commands';

// Queries
import { GetUserByIdQuery, GetUsersQuery } from '@/application/user/queries';

@Controller('user')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly _addressService: AddressService,
  ) {}

  @Get('me')
  @Roles(Role.USER)
  @ApiResponseWithType({}, UserResponseDto)
  async me(@UserId() userId: string): Promise<HttpResponse<UserResponseDto>> {
    const query = new GetUserByIdQuery(userId);
    const data = await this.queryBus.execute(query);

    return {
      success: true,
      message: 'User profile fetched successfully',
      data: UserResponseDto.fromEntity(data),
    };
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiResponseWithType({ isArray: true }, UserResponseDto)
  async find(
    @Query() query: UserPaginatedQueryDto,
  ): Promise<HttpPaginatedResponse<UserResponseDto[]>> {
    const getUsersQuery = new GetUsersQuery(query.page, query.limit, query.search, query.status);
    const { data, total } = await this.queryBus.execute(getUsersQuery);

    return {
      success: true,
      message: 'Users fetched successfully',
      data: data.map(UserResponseDto.fromEntity),
      total,
      page: query.page,
      limit: query.limit,
    };
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiResponseWithType({}, UserResponseDto)
  async findOne(
    @Param('id') id: string,
  ): Promise<HttpResponse<UserResponseDto>> {
    const query = new GetUserByIdQuery(id);
    const data = await this.queryBus.execute(query);

    return {
      message: 'User fetched successfully',
      success: true,
      data: UserResponseDto.fromEntity(data),
    };
  }

  @Patch()
  @Roles(Role.USER)
  @ApiResponseWithType({}, UserResponseDto)
  async update(
    @UserId() userId: string,
    @Body() dto: UpdateUserDto,
  ): Promise<HttpResponse<UserResponseDto>> {
    const command = new UpdateUserCommand(userId, dto.name, dto.email, dto.phone, dto.dob, dto.gender);
    const data = await this.commandBus.execute(command);

    return {
      success: true,
      message: 'User profile updated successfully',
      data: UserResponseDto.fromEntity(data),
    };
  }

  @Post('address')
  @Roles(Role.USER)
  @ApiResponseWithType({}, AddressResponseDto)
  async createAddress(
    @UserId() userId: string,
    @Body() dto: CreateAddressDto,
  ): Promise<HttpResponse<AddressResponseDto>> {
    const data = await this._addressService.create(userId, dto);

    return {
      success: true,
      message: 'User address created successfully',
      data: AddressResponseDto.fromEntity(data),
    };
  }

  @Patch('address/:id')
  @Roles(Role.USER)
  @ApiResponseWithType({}, UserResponseDto)
  async updateAddress(
    @UserId() userId: string,
    @Body() dto: UpdateAddressDto,
    @Param('id') addressId: string,
  ): Promise<HttpResponse<AddressResponseDto>> {
    const data = await this._addressService.update(addressId, userId, dto);

    return {
      success: true,
      message: 'User address updated successfully',
      data: AddressResponseDto.fromEntity(data),
    };
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  @ApiResponseWithType({}, UserResponseDto)
  async updateStatus(
    @Param('id') userId: string,
    @Body() dto: UpdateStatusUserDto,
  ): Promise<HttpResponse<UserResponseDto>> {
    const data = await this._userService.updateStatus(userId, dto);

    return {
      success: true,
      message: 'User profile rahil successfully',
      data: UserResponseDto.fromEntity(data),
    };
  }
}
