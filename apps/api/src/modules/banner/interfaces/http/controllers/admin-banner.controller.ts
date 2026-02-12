import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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

import { Role } from '@/shared/enums/role.enum';
import {
  ApiAuthErrorResponses,
  ApiCommonErrorResponses,
  ApiNotFoundResponse,
} from '@/shared/decorators/api-error-responses.decorator';
import { Roles } from '@/shared/decorators/roles.decorator';
import { HttpResponse } from '@/shared/dto/common/http-response.dto';
import { ApiResponseWithType } from '@/shared/decorators/api-response.decorator';
import {
  CreateBannerDto,
  GenerateBannerUploadUrlDto,
  ReorderBannersDto,
  UpdateBannerDto,
} from '../dtos/request';
import {
  GetAllBannersQuery,
  GetBannerQuery,
} from '@/modules/banner/application/queries';
import {
  CreateBannerCommand,
  DeleteBannerCommand,
  GenerateBannerUploadUrlCommand,
  ReorderBannersCommand,
  UpdateBannerCommand,
} from '@/modules/banner/application/commands';
import { BannerResponseDto, UploadUrlResponseDto } from '../dtos/response';

@ApiTags('Admin - Banners')
@ApiBearerAuth()
@Controller('admin/banners')
@Roles(Role.ADMIN)
export class AdminBannerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new banner',
    description: 'Create a new banner for the homepage',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.CREATED,
      description: 'Banner created successfully',
    },
    BannerResponseDto,
  )
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async create(
    @Body() dto: CreateBannerDto,
  ): Promise<HttpResponse<BannerResponseDto>> {
    const banner = await this.commandBus.execute(
      new CreateBannerCommand(dto.imageUrl, dto.order),
    );

    return {
      message: 'Banner created successfully',
      data: BannerResponseDto.fromDomain(banner),
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all banners',
    description:
      'Retrieve all banners (including inactive) for admin management',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Banners retrieved successfully',
      isArray: true,
    },
    BannerResponseDto,
  )
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async findAll(): Promise<HttpResponse<BannerResponseDto[]>> {
    const banners = await this.queryBus.execute(new GetAllBannersQuery(false));

    return {
      message: 'Banners retrieved successfully',
      data: banners.map(BannerResponseDto.fromDomain),
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get banner by ID',
    description: 'Retrieve a specific banner by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Banner ID',
    example: 'clx1234567890',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Banner retrieved successfully',
    },
    BannerResponseDto,
  )
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  @ApiNotFoundResponse()
  async findOne(
    @Param('id') id: string,
  ): Promise<HttpResponse<BannerResponseDto>> {
    const banner = await this.queryBus.execute(new GetBannerQuery(id));

    return {
      message: 'Banner retrieved successfully',
      data: BannerResponseDto.fromDomain(banner),
    };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a banner',
    description: 'Update an existing banner (image URL or active status)',
  })
  @ApiParam({
    name: 'id',
    description: 'Banner ID',
    example: 'clx1234567890',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Banners reordered successfully',
    },
    BannerResponseDto,
  )
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  @ApiNotFoundResponse()
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBannerDto,
  ): Promise<HttpResponse<BannerResponseDto>> {
    const banner = await this.commandBus.execute(
      new UpdateBannerCommand(id, dto.imageUrl, dto.isActive),
    );

    return {
      message: 'Banner updated successfully',
      data: BannerResponseDto.fromDomain(banner),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a banner',
    description: 'Permanently delete a banner',
  })
  @ApiParam({
    name: 'id',
    description: 'Banner ID',
    example: 'clx1234567890',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Banner deleted successfully',
  })
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  @ApiNotFoundResponse()
  async delete(@Param('id') id: string): Promise<HttpResponse> {
    await this.commandBus.execute(new DeleteBannerCommand(id));

    return {
      message: 'Banner deleted successfully',
    };
  }

  @Post('reorder')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reorder banners',
    description:
      'Update the display order of multiple banners at once (for drag and drop)',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Banners reordered successfully',
  })
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async reorder(@Body() dto: ReorderBannersDto): Promise<HttpResponse> {
    await this.commandBus.execute(new ReorderBannersCommand(dto.banners));

    return {
      message: 'Banners reordered successfully',
    };
  }

  @Post('generate-upload-url')
  @ApiOperation({
    summary: 'Generate presigned upload URL',
    description:
      'Generate a presigned URL for client-side banner image upload to Cloudinary',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.CREATED,
      description: 'Upload URL generated successfully',
    },
    UploadUrlResponseDto,
  )
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async generateUploadUrl(
    @Body() dto: GenerateBannerUploadUrlDto,
  ): Promise<HttpResponse<UploadUrlResponseDto>> {
    const uploadDescriptor = await this.commandBus.execute(
      new GenerateBannerUploadUrlCommand(dto.fileName),
    );

    return {
      message: 'Upload URL generated successfully',
      data: uploadDescriptor,
    };
  }
}
