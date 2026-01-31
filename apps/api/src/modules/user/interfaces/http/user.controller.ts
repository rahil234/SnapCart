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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
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

// DTOs
import { UpdateUserDto } from '@/modules/user/application/dtos/request/update-user.dto';
import { UpdateUserStatusDto } from '@/modules/user/application/dtos/request/update-user-status.dto';
import { CreateAddressDto } from '@/modules/user/application/dtos/request/create-address.dto';
import { UpdateAddressDto } from '@/modules/user/application/dtos/request/update-address.dto';
import { GetUsersDto } from '@/modules/user/application/dtos/request/get-users.dto';
import { UserResponseDto } from '@/modules/user/application/dtos/response/user-response.dto';
import { AddressResponseDto } from '@/modules/user/application/dtos/response/address-response.dto';

// Commands
import {
  UpdateUserCommand,
  UpdateUserStatusCommand,
  CreateAddressCommand,
  UpdateAddressCommand,
} from '@/modules/user/application/commands';

// Queries
import {
  GetUserByIdQuery,
  GetUsersQuery,
} from '@/modules/user/application/queries';
import { ApiResponseWithType } from '@/shared/decorators/api-response.decorator';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('me')
  @Roles(Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Retrieves the authenticated user profile',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'User profile fetched successfully',
    },
    UserResponseDto,
  )
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  async getMe(
    @UserId() userId: string,
  ): Promise<HttpResponse<UserResponseDto>> {
    const query = new GetUserByIdQuery(userId);
    const user = await this.queryBus.execute(query);

    return {
      message: 'User profile fetched successfully',
      data: UserResponseDto.fromEntity(user),
    };
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieves all users with pagination. Admin only.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users retrieved successfully',
    type: [UserResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Admin access required',
  })
  async findAll(
    @Query() query: GetUsersDto,
  ): Promise<HttpPaginatedResponse<UserResponseDto[]>> {
    const getUsersQuery = new GetUsersQuery(
      query.page,
      query.limit,
      query.search,
      query.status,
    );
    const result = await this.queryBus.execute(getUsersQuery);

    return {
      message: 'Users fetched successfully',
      data: result.users.map(UserResponseDto.fromEntity),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieves a single user by ID. Admin only.',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Admin access required',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<HttpResponse<UserResponseDto>> {
    const query = new GetUserByIdQuery(id);
    const user = await this.queryBus.execute(query);

    return {
      message: 'User fetched successfully',
      data: UserResponseDto.fromEntity(user),
    };
  }

  @Patch()
  @Roles(Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update current user',
    description: 'Updates the authenticated user profile',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  async update(
    @UserId() userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<HttpResponse<UserResponseDto>> {
    const command = new UpdateUserCommand(
      userId,
      updateUserDto.name,
      updateUserDto.email,
      updateUserDto.phone,
      updateUserDto.dob,
      updateUserDto.gender,
    );

    const user = await this.commandBus.execute(command);

    return {
      message: 'User profile updated successfully',
      data: UserResponseDto.fromEntity(user),
    };
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update user status',
    description: 'Updates user account status. Admin only.',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User status updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Admin access required',
  })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStatusDto: UpdateUserStatusDto,
  ): Promise<HttpResponse<UserResponseDto>> {
    const command = new UpdateUserStatusCommand(id, updateStatusDto.status);

    const user = await this.commandBus.execute(command);

    return {
      message: 'User status updated successfully',
      data: UserResponseDto.fromEntity(user),
    };
  }

  @Post('addresses')
  @Roles(Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create address',
    description: 'Creates a new address for the authenticated user',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Address created successfully',
    type: AddressResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  async createAddress(
    @UserId() userId: string,
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<HttpResponse<AddressResponseDto>> {
    const command = new CreateAddressCommand(
      userId,
      createAddressDto.houseNo ?? null,
      createAddressDto.street ?? null,
      createAddressDto.city ?? null,
      createAddressDto.state ?? null,
      createAddressDto.country ?? null,
      createAddressDto.pincode ?? null,
      createAddressDto.isPrimary ?? false,
    );

    const address = await this.commandBus.execute(command);

    return {
      message: 'Address created successfully',
      data: AddressResponseDto.fromEntity(address),
    };
  }

  @Patch('addresses/:id')
  @Roles(Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update address',
    description: 'Updates an existing address for the authenticated user',
  })
  @ApiParam({
    name: 'id',
    description: 'Address ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Address updated successfully',
    type: AddressResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Address not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'You do not have permission to update this address',
  })
  async updateAddress(
    @UserId() userId: string,
    @Param('id', ParseUUIDPipe) addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<HttpResponse<AddressResponseDto>> {
    const command = new UpdateAddressCommand(
      addressId,
      userId,
      updateAddressDto.houseNo,
      updateAddressDto.street,
      updateAddressDto.city,
      updateAddressDto.state,
      updateAddressDto.country,
      updateAddressDto.pincode,
      updateAddressDto.isPrimary,
    );

    const address = await this.commandBus.execute(command);

    return {
      message: 'Address updated successfully',
      data: AddressResponseDto.fromEntity(address),
    };
  }
}
