import { CategoryService } from '@/services/category.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Category } from '@/types';

export const useGetCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await CategoryService.getCategories();
      if (error) throw error;
      return data;
    },
  });
};

export const useGetCategoriesById = (categoryId: string) => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } =
        await CategoryService.getCategoriesById(categoryId);

      if (error) throw error;

      return data;
    },
  });
};

export const useGetAllCategories = () => {
  return useQuery({
    queryKey: ['all-categories'],
    queryFn: CategoryService.getCategories,
  });
};

export const useGetTopCategories = () => {
  return useQuery({
    queryKey: ['top-categories'],
    queryFn: CategoryService.getTopCategories,
  });
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Pick<Category, 'name'>) =>
      CategoryService.createCategory(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
      await queryClient.invalidateQueries({ queryKey: ['all-categories'] });
    },
  });
};

export const useEditCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Category }) =>
      CategoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['all-categories'] });
    },
  });
};

export const useArchiveCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => CategoryService.archiveCategory(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
      await queryClient.invalidateQueries({ queryKey: ['all-categories'] });
    },
  });
};

export const useUnarchiveCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => CategoryService.unarchiveCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['all-categories'] });
    },
  });
};
