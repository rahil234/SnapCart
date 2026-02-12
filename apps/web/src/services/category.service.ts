import { apiClient } from '@/api/axios';
import { apiConfig } from '@/api/client';
import {
  CategoriesApi,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@/api/generated';
import { handleRequest } from '@/api/utils/handleRequest';

const categoryApi = new CategoriesApi(apiConfig, undefined, apiClient);

export const CategoryService = {
  getCategories: () =>
    handleRequest(() => categoryApi.categoryControllerFindAll()),
  getCategoriesById: (categoryId: string) =>
    handleRequest(() => categoryApi.categoryControllerFindOne(categoryId)),
  createCategory: (data: CreateCategoryDto) =>
    handleRequest(() => categoryApi.categoryControllerCreate(data)),
  updateCategory: (id: string, data: UpdateCategoryDto) =>
    handleRequest(() => categoryApi.categoryControllerUpdate(id, data)),
  archiveCategory: (id: string) =>
    handleRequest(() =>
      categoryApi.categoryControllerUpdate(id, {
        status: 'inactive',
      })
    ),
  unarchiveCategory: (id: string) =>
    handleRequest(() =>
      categoryApi.categoryControllerUpdate(id, {
        status: 'active',
      })
    ),
  getTopCategories: () => categoryApi.categoryControllerFindAll(),
};
