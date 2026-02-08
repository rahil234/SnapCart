import React from 'react';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Category } from '@/types';
import { useEditCategory } from '@/hooks/category.hooks';

interface EditCategoryCardProps {
  onClose: () => void;
  category: Category;
}

const EditCategoryCard: React.FC<EditCategoryCardProps> = ({
  onClose,
  category,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Category>({
    defaultValues: category,
  });

  const editCategoryMutation = useEditCategory();

  const onSubmit: SubmitHandler<Category> = async data => {
    const { error } = await editCategoryMutation.mutateAsync({
      id: category.id,
      data,
    });

    if (error) {
      console.error(error);
      toast.error('Failed to update category');
      return;
    }

    toast.success('Category updated successfully');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Edit Category</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700">Category Name</label>
            <input
              {...register('name', {
                required: 'Category name is required',
                pattern: {
                  value: /\S+/,
                  message: 'Category name cannot contain only spaces',
                },
              })}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryCard;
