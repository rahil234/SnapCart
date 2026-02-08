import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CategoryController } from '@/modules/category/interfaces/http/controllers/category.controller';

import { CreateCategoryHandler } from '@/modules/category/application/commands/handlers/create-category.handler';
import { UpdateCategoryHandler } from '@/modules/category/application/commands/handlers/update-category.handler';
import { DeleteCategoryHandler } from '@/modules/category/application/commands/handlers/delete-category.handler';
import { GetCategoryByIdHandler } from '@/modules/category/application/queries/handlers/get-category-by-id.handler';
import { GetAllCategoriesHandler } from '@/modules/category/application/queries/handlers/get-all-categories.handler';
import { PrismaCategoryRepository } from '@/modules/category/infrastructure/persistence/repositories/prisma-category.repository';

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
export class CategoryHttpModule {}
