import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import {
  HttpPaginatedResponse,
  HttpResponse,
} from '@/shared/dto/common/http-response.dto';
import { Role } from '@/shared/enums/role.enum';
import { Roles } from '@/shared/decorators/roles.decorator';
import { UserId } from '@/shared/decorators/user-id.decorator';
import { ApiResponseWithType } from '@/shared/decorators/api-response.decorator';
import {
  ApiCommonErrorResponses,
  ApiAuthErrorResponses,
  ApiNotFoundResponse,
} from '@/shared/decorators/api-error-responses.decorator';

// DTOs
import { UpdateUserDto } from '@/modules/user/application/dtos/request/update-user.dto';
import { UpdateUserStatusDto } from '@/modules/user/application/dtos/request/update-user-status.dto';
import { GetUsersDto } from '@/modules/user/application/dtos/request/get-users.dto';
import { UserResponseDto } from '@/modules/user/application/dtos/response/user-response.dto';
import { MeResponseDto } from '@/modules/user/application/dtos/response/me-response.dto';

// Commands
import {
  UpdateUserCommand,
  UpdateUserStatusCommand,
} from '@/modules/user/application/commands';

// Queries
import {
  GetUserByIdQuery,
  GetUsersQuery,
} from '@/modules/user/application/queries';
import { GetMeQuery } from '@/modules/user/application/queries/get-me/get-me.query';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('me')
  @Roles(Role.CUSTOMER, Role.SELLER, Role.ADMIN)
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
    MeResponseDto,
  )
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async getMe(@UserId() userId: string): Promise<HttpResponse<MeResponseDto>> {
    const query = new GetMeQuery(userId);
    const result = await this.queryBus.execute(query);

    return {
      message: 'User profile fetched successfully',
      data: MeResponseDto.fromResult(result),
    };
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieves all users with pagination. Admin only.',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Users retrieved successfully',
      pagination: true,
      isArray: true,
    },
    UserResponseDto,
  )
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
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
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
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
    description: 'User UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'User retrieved successfully',
    },
    UserResponseDto,
  )
  @ApiNotFoundResponse('User')
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
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
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'User updated successfully',
    },
    UserResponseDto,
  )
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
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
    description: 'User UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'User status updated successfully',
    },
    UserResponseDto,
  )
  @ApiNotFoundResponse('User')
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
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
}
