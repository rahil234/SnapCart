import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CategoryController } from '@/interfaces/http/category/category.controller';

import { CreateCategoryHandler } from '@/application/category/commands/handlers/create-category.handler';
import { UpdateCategoryHandler } from '@/application/category/commands/handlers/update-category.handler';
import { DeleteCategoryHandler } from '@/application/category/commands/handlers/delete-category.handler';
import { GetCategoryByIdHandler } from '@/application/category/queries/handlers/get-category-by-id.handler';
import { GetAllCategoriesHandler } from '@/application/category/queries/handlers/get-all-categories.handler';
import { PrismaCategoryRepository } from '@/infrastructure/category/persistence/repositories/prisma-category.repository';

export const CategoryHandlers = [
  CreateCategoryHandler,
  UpdateCategoryHandler,
  DeleteCategoryHandler,
  GetAllCategoriesHandler,
  GetCategoryByIdHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [CategoryController],
  providers: [
    ...CategoryHandlers,
    {
      provide: 'CategoryRepository',
      useClass: PrismaCategoryRepository,
    },
  ],
})
export class CategoryModule {}
