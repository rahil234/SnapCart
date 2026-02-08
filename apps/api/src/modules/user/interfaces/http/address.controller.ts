import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import {
  CreateAddressCommand,
  DeleteAddressCommand,
  UpdateAddressCommand,
} from '@/modules/user/application/commands';
import { Role } from '@/shared/enums/role.enum';
import {
  ApiAuthErrorResponses,
  ApiCommonErrorResponses,
  ApiNotFoundResponse,
} from '@/shared/decorators/api-error-responses.decorator';
import { Roles } from '@/shared/decorators/roles.decorator';
import { UserId } from '@/shared/decorators/user-id.decorator';
import { ParseCUIDPipe } from '@/shared/pipes/parse-cuid.pipe';
import { HttpResponse } from '@/shared/dto/common/http-response.dto';
import { GetAddressesQuery } from '@/modules/user/application/queries';
import { ApiResponseWithType } from '@/shared/decorators/api-response.decorator';
import { CreateAddressDto } from '@/modules/user/interfaces/http/dtos/request/create-address.dto';
import { UpdateAddressDto } from '@/modules/user/interfaces/http/dtos/request/update-address.dto';
import { AddressResponseDto } from '@/modules/user/interfaces/http/dtos/response/address-response.dto';

@ApiTags('Addresses')
@Controller('addresses')
export class AddressController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles(Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create address',
    description: 'Creates a new address for the authenticated user',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.CREATED,
      description: 'Address created successfully',
    },
    AddressResponseDto,
  )
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async create(
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

  @Get()
  @Roles(Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get my addresses',
    description:
      'Retrieves all addresses associated with the authenticated user',
  })
  @ApiResponseWithType(
    {
      isArray: true,
      status: HttpStatus.OK,
      description: 'List of addresses retrieved successfully',
    },
    AddressResponseDto,
  )
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async find(
    @UserId() userId: string,
  ): Promise<HttpResponse<AddressResponseDto[]>> {
    const query = new GetAddressesQuery(userId);

    const address = await this.queryBus.execute(query);

    return {
      message: 'Addresses retrieved successfully',
      data: address.map(AddressResponseDto.fromEntity),
    };
  }

  @Patch(':id')
  @Roles(Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update address',
    description: 'Updates an existing address for the authenticated user',
  })
  @ApiParam({
    name: 'id',
    description: 'Address UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Address updated successfully',
    },
    AddressResponseDto,
  )
  @ApiNotFoundResponse('Address')
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async update(
    @UserId() userId: string,
    @Param('id', ParseCUIDPipe) addressId: string,
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

  @Delete(':id')
  @Roles(Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete address',
    description: 'Deletes an existing address for the authenticated user',
  })
  @ApiParam({
    name: 'id',
    description: 'Address UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Address deleted successfully',
    },
    Object,
  )
  @ApiNotFoundResponse('Address')
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async delete(
    @UserId() userId: string,
    @Param('id', ParseCUIDPipe) addressId: string,
  ): Promise<HttpResponse<null>> {
    const command = new DeleteAddressCommand(addressId, userId);

    await this.commandBus.execute(command);

    return {
      message: 'Address deleted successfully',
      data: null,
    };
  }
}
