import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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

import { Public } from '@/shared/decorators/public.decorator';
import { HttpResponse } from '@/shared/dto/common/http-response.dto';

// DTOs
import { CreateCategoryDto } from '@/application/category/dtos/request/create-category.dto';
import { UpdateCategoryDto } from '@/application/category/dtos/request/update-category.dto';
import { CategoryResponseDto } from '@/application/category/dtos/response/category-response.dto';

// Commands
import {
  CreateCategoryCommand,
  UpdateCategoryCommand,
  DeleteCategoryCommand,
} from '@/application/category/commands';

// Queries
import {
  GetCategoryByIdQuery,
  GetAllCategoriesQuery,
} from '@/application/category/queries';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Public()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new category',
    description:
      'Creates a new category with the provided details. Only admins can create categories.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Category created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Admin access required',
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Categories retrieved successfully',
    type: [CategoryResponseDto],
  })
  async findAll(): Promise<HttpResponse<CategoryResponseDto[]>> {
    const query = new GetAllCategoriesQuery();
    const categories = await this.queryBus.execute(query);

    categories.map((category) => ({
      id: category.id,
      name: category.getName(),
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }));

    return {
      message: 'Categories retrieved successfully',
      data: categories,
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
    description: 'Category ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category retrieved successfully',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CategoryResponseDto> {
    const query = new GetCategoryByIdQuery(id);
    const category = await this.queryBus.execute(query);

    return {
      id: category.id,
      name: category.getName(),
      description: category.getDescription(),
      imageUrl: category.getImageUrl(),
      parentId: category.getParentId(),
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  @Patch(':id')
  @Public()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update category',
    description:
      'Updates an existing category. Only admins can update categories.',
  })
  @ApiParam({
    name: 'id',
    description: 'Category ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Admin access required',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<HttpResponse> {
    const command = new UpdateCategoryCommand(
      id,
      updateCategoryDto.name,
      updateCategoryDto.description,
      updateCategoryDto.imageUrl,
      updateCategoryDto.parentId,
    );

    await this.commandBus.execute(command);

    return {
      message: 'Category updated successfully',
    };
  }

  @Delete(':id')
  @Public()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete category',
    description: 'Deletes a category. Only admins can delete categories.',
  })
  @ApiParam({
    name: 'id',
    description: 'Category ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Admin access required',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<HttpResponse> {
    const command = new DeleteCategoryCommand(id);

    await this.commandBus.execute(command);

    return {
      message: 'Category deleted successfully',
    };
  }
}
