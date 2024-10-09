import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Plus, X } from 'lucide-react'

interface AddCategoryFormInputs {
  categoryName: string
  subCategories: string
  status: 'Active' | 'Blocked'
}

const AddCategoryCard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<AddCategoryFormInputs>()

  const onSubmit: SubmitHandler<AddCategoryFormInputs> = (data) => {
    // Here you would typically handle the category addition logic
    console.log(data)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add Category</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              {...register("categoryName", { required: "Category name is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
            {errors.categoryName && <p className="mt-1 text-sm text-red-600">{errors.categoryName.message}</p>}
          </div>
          <div>
            <label htmlFor="subCategories" className="block text-sm font-medium text-gray-700">
              Sub Categories
            </label>
            <input
              type="text"
              id="subCategories"
              {...register("subCategories", { required: "At least one sub-category is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Separate multiple sub-categories with commas"
            />
            {errors.subCategories && <p className="mt-1 text-sm text-red-600">{errors.subCategories.message}</p>}
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              {...register("status", { required: "Status is required" })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
            >
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
            </select>
            {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Plus size={20} className="mr-2" />
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCategoryCard;