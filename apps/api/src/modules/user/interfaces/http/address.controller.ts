import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';

import { HttpResponse } from '@/shared/dto/common/http-response.dto';
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
import { CreateAddressDto } from '@/modules/user/application/dtos/request/create-address.dto';
import { UpdateAddressDto } from '@/modules/user/application/dtos/request/update-address.dto';
import { AddressResponseDto } from '@/modules/user/application/dtos/response/address-response.dto';

// Commands
import {
  CreateAddressCommand,
  UpdateAddressCommand,
  DeleteAddressCommand,
} from '@/modules/user/application/commands';

@ApiTags('Addresses')
@Controller('addresses')
export class AddressController {
  constructor(private readonly commandBus: CommandBus) {}

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
    @Param('id', ParseUUIDPipe) addressId: string,
  ): Promise<HttpResponse<null>> {
    const command = new DeleteAddressCommand(addressId, userId);

    await this.commandBus.execute(command);

    return {
      message: 'Address deleted successfully',
      data: null,
    };
  }
}
