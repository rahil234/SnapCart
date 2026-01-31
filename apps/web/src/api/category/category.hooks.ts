import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CategoryService } from './category.service';
import { ICategory } from '@/types/category';

export const useGetCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await CategoryService.getCategories();

      if (error) throw error;

      return data;
    },
  });
};

export const useGetAllCategories = () => {
  return useQuery({
    queryKey: ['all-categories'],
    queryFn: CategoryService.getAllCategories,
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
    mutationFn: (data: ICategory) => CategoryService.addCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['all-categories'] });
    },
  });
};

export const useEditCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ICategory }) =>
      CategoryService.editCategory(id, data),
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['all-categories'] });
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
