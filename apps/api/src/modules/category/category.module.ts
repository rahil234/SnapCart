import { Module } from '@nestjs/common';

import { CategoryHttpModule } from '@/modules/category/interfaces/http/category.http.module';

@Module({
  imports: [CategoryHttpModule],
  exports: [CategoryHttpModule],
})
export class CategoryModule {}
