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
  ApiAuthErrorResponses,
  ApiCommonErrorResponses,
  ApiNotFoundResponse,
} from '@/shared/decorators/api-error-responses.decorator';
import { Public } from '@/shared/decorators/public.decorator';
import { HttpResponse } from '@/shared/dto/common/http-response.dto';
import { ApiResponseWithType } from '@/shared/decorators/api-response.decorator';

// Commands
import {
  CreateCategoryCommand,
  DeleteCategoryCommand,
  UpdateCategoryCommand,
} from '@/modules/category/application/commands';

// Queries
import {
  GetAllCategoriesQuery,
  GetCategoryByIdQuery,
} from '@/modules/category/application/queries';
import { Role } from '@/shared/enums/role.enum';
import { Roles } from '@/shared/decorators/roles.decorator';
import { ParseCUIDPipe } from '@/shared/pipes/parse-cuid.pipe';
import { CreateCategoryDto } from '@/modules/category/interfaces/http/dtos/request/create-category.dto';
import { UpdateCategoryDto } from '@/modules/category/interfaces/http/dtos/request/update-category.dto';
import { CategoryResponseDto } from '@/modules/category/interfaces/http/dtos/response/category-response.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new category',
    description:
      'Creates a new category with the provided details. Only admins can create categories.',
  })
  @ApiResponseWithType({
    status: HttpStatus.CREATED,
    description: 'Category created successfully',
  })
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<HttpResponse> {
    const command = new CreateCategoryCommand(
      createCategoryDto.name,
      createCategoryDto.description,
      createCategoryDto.imageUrl,
      createCategoryDto.parentId,
    );

    await this.commandBus.execute(command);

    return {
      message: 'Category created successfully',
    };
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Get all categories',
    description: 'Retrieves all categories',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Categories retrieved successfully',
      isArray: true,
    },
    CategoryResponseDto,
  )
  @ApiCommonErrorResponses()
  async findAll(): Promise<HttpResponse<CategoryResponseDto[]>> {
    const query = new GetAllCategoriesQuery();
    const categories = await this.queryBus.execute(query);

    return {
      message: 'Categories retrieved successfully',
      data: categories.map(CategoryResponseDto.fromDomain),
    };
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Get category by ID',
    description: 'Retrieves a single category by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Category CUID',
    type: 'string',
    format: 'cuid',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Category retrieved successfully',
    },
    CategoryResponseDto,
  )
  @ApiNotFoundResponse('Category')
  @ApiCommonErrorResponses()
  async findOne(
    @Param('id', ParseCUIDPipe) id: string,
  ): Promise<HttpResponse<CategoryResponseDto>> {
    const query = new GetCategoryByIdQuery(id);
    const category = await this.queryBus.execute(query);

    return {
      message: 'Category retrieved successfully',
      data: CategoryResponseDto.fromDomain(category),
    };
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update category',
    description:
      'Updates an existing category. Only admins can update categories.',
  })
  @ApiParam({
    name: 'id',
    description: 'Category CUID',
    type: 'string',
    format: 'cuid',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Category updated successfully',
  })
  @ApiNotFoundResponse('Category')
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async update(
    @Param('id', ParseCUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<HttpResponse> {
    const command = new UpdateCategoryCommand(
      id,
      updateCategoryDto.name,
      updateCategoryDto.status,
    );

    await this.commandBus.execute(command);

    return {
      message: 'Category updated successfully',
    };
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete category',
    description: 'Deletes a category. Only admins can delete categories.',
  })
  @ApiParam({
    name: 'id',
    description: 'Category CUID',
    type: 'string',
    format: 'cuid',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Category deleted successfully',
  })
  @ApiNotFoundResponse('Category')
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async remove(@Param('id', ParseCUIDPipe) id: string): Promise<HttpResponse> {
    const command = new DeleteCategoryCommand(id);

    await this.commandBus.execute(command);

    return {
      message: 'Category deleted successfully',
    };
  }
}
