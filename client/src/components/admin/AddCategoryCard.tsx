//@ts-nocheck
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { X } from 'lucide-react';

interface AddCategoryFormInputs {
  categoryName: string;
  subCategories: string;
  status: 'Active' | 'Blocked';
}

const AddCategoryCard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddCategoryFormInputs>();

  const onSubmit: SubmitHandler<AddCategoryFormInputs> = data => {
    console.log(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add Category</h2>
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
              {...register('categoryName', {
                required: 'Category name is required',
                pattern: {
                  value: /\S+/,
                  message: 'Category name cannot contain only spaces',
                },
              })}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.categoryName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.categoryName.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Subcategories</label>
            <input
              {...register('subCategories', {
                required: 'Subcategories are required',
                pattern: {
                  value: /\S+/,
                  message: 'Subcategories cannot contain only spaces',
                },
              })}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.subCategories && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subCategories.message}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryCard;
