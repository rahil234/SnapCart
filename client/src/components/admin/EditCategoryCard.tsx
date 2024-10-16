import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { X } from 'lucide-react';
import { editCatogories } from '@/api/adminEndpoints'

interface EditCategoryFormInputs {
  catName: string;
  name: string;
  subCategories: string;
  status: 'Active' | 'Blocked';
}

interface EditCategoryCardProps {
  onClose: () => void;
  editData: EditCategoryFormInputs;
}

const EditCategoryCard: React.FC<EditCategoryCardProps> = ({ onClose, editData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditCategoryFormInputs>({
    defaultValues: editData,
  });

  console.log(editData);
  
  const onSubmit: SubmitHandler<EditCategoryFormInputs> = data => {
    editCatogories(data)
    // onClose();
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
              {...register('catName', {
                required: 'Category name is required',
                pattern: {
                  value: /\S+/,
                  message: 'Category name cannot contain only spaces',
                },
              })}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.catName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.catName.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Subcategories</label>
            <input
              {...register('name', {
                required: 'Subcategories are required',
                pattern: {
                  value: /\S+/,
                  message: 'Subcategories cannot contain only spaces',
                },
              })}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
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
