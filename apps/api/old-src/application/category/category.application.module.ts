import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CategoryDomainModule } from '../../domain/category/category.domain.module';

// Query Handlers
import {
  GetCategoryByIdHandler,
  GetAllCategoriesHandler,
} from './queries/handlers';

const QueryHandlers = [GetCategoryByIdHandler, GetAllCategoriesHandler];

@Module({
  imports: [
    CqrsModule,
    CategoryDomainModule,
  ],
  providers: [...QueryHandlers],
  exports: [...QueryHandlers],
})
export class CategoryApplicationModule {}
