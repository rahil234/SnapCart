import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { X } from 'lucide-react';
import categoryEndpoints from '@/api/categoryEndpoints';

interface AddCategoryFormInputs {
  category: string;
  subcategoryName: string;
  newCategoryName?: string;
}

const AddCategoryCard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [isAddingMainCategory, setIsAddingMainCategory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    categoryEndpoints.getCategories().then((response) => {
      setCategories(response.data);
    });
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddCategoryFormInputs>();

  const selectedCategory = watch('category');

  useEffect(() => {
    if (selectedCategory === 'add_new') {
      setIsAddingMainCategory(true);
    } else {
      setIsAddingMainCategory(false);
    }
  }, [selectedCategory]);

  const onSubmit: SubmitHandler<AddCategoryFormInputs> = async data => {
    setError(null);

    //if adding a new category
    if (isAddingMainCategory) {
      try {
        const formData = {
        categoryName: data.newCategoryName,
        subcategoryName: data.subcategoryName,
      };
        await categoryEndpoints.addCategory(formData);
      } catch (error: any) {
        setError(error.response.data.message);
        return;
      }
    } else {
      //if only adding a subcategory
        const formData = {
          categoryId: data.category,
          subcategoryName: data.subcategoryName,
        };

        try {
          await categoryEndpoints.addCategory(formData);
        } catch {
          setError('Failed to add subcategories. Please try again.');
        }
    }
    onClose();
  };

  const handleTrim = (field: keyof AddCategoryFormInputs) => {
    const value = watch(field);
    if (value) {
      setValue(field, value.trim());
    }
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
          <p className="text-red-500 text-sm h-[25px] text-center">
            {error && error}
          </p>
          <div className="mb-4">
            <label className="block text-gray-700">Category</label>
            <select
              {...register('category', {required: 'Main category is required'})}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
              <option value="add_new">Add a new category</option>
            </select>
            {errors.category && (
              <p className="mt-2 text-sm text-red-600">
                {errors.category.message}
              </p>
            )}
          </div>

          {isAddingMainCategory && (
            <div className="mb-4">
              <label className="block text-gray-700">New Category name</label>
              <input
                {...register('newCategoryName', {
                  required: 'New category name is required',
                  validate: value => (value?.trim() ?? '') !== '' || 'New category name cannot be empty',
                })}
                onBlur={() => handleTrim('newCategoryName')}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm mt-2"
              />
              {errors.newCategoryName && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.newCategoryName.message}
                </p>
              )}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700">Subcategory name</label>
            <input
              {...register('subcategoryName', {
                required: 'Subcategory are required',
                validate: value => value.trim() !== '' || 'Subcategory cannot be empty',
              })}
              onBlur={() => handleTrim('subcategoryName')}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
            {errors.subcategoryName && (
              <p className="mt-2 text-sm text-red-600">
                {errors.subcategoryName.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
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
