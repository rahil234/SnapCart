import { CategoryApi } from '@/api/generated';
import { apiConfig } from '@/api/client';
import { ICategory } from '@/types/category';
import { handleRequest } from '@/api/utils/handleRequest';

const categoryApi = new CategoryApi(apiConfig);

export const CategoryService = {
  getCategories: () => handleRequest(categoryApi.categoryControllerFindAll),
  getAllCategories: () => categoryApi.categoryControllerFindAll(),
  addCategory: (data: ICategory) => categoryApi.categoryControllerCreate(data),
  editCategory: (id: string, data: ICategory) =>
    categoryApi.categoryControllerUpdate(id, data),
  archiveCategory: (id: string) =>
    categoryApi.categoryControllerUpdate(id, {
      status: 'active',
    }),
  unarchiveCategory: (id: string) =>
    categoryApi.categoryControllerUpdate(id, {
      status: 'inactive',
    }),
  getTopCategories: () => categoryApi.categoryControllerFindAll(),
};
