import { toast } from 'sonner';
import React, { useState } from 'react';
import { Archive, ArchiveXIcon, Edit } from 'lucide-react';

import { Category } from '@/types';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import EditCategoryCard from '@/components/admin/EditCategoryCard';
import { useArchiveCategoryMutation } from '@/hooks/categories/use-archive-category-mutation.hook';
import { useUnarchiveCategoryMutation } from '@/hooks/categories/use-unarchive-category-mutation.hook';

type CategoryTableProps = {
  categories: Category[];
};

const CategoryTable: React.FC<CategoryTableProps> = ({ categories }) => {
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  const archiveCategory = useArchiveCategoryMutation();
  const unarchiveCategory = useUnarchiveCategoryMutation();

  const handleStatusToggle = async (
    categoryId: string,
    status: Category['status']
  ) => {
    const isActive = status === 'active';
    const mutation = isActive ? archiveCategory : unarchiveCategory;

    console.log(
      `Attempting to ${isActive ? 'deactivate' : 'activate'} category with ID: ${categoryId}`
    );

    const { error } = await mutation.mutateAsync(categoryId);

    if (error) {
      console.error(error);
      toast.error(`Failed to ${isActive ? 'deactivate' : 'activate'} category`);
      return;
    }

    toast.success(
      `Category ${isActive ? 'deactivated' : 'activated'} successfully`
    );
  };

  if (!categories.length) {
    return <div className="text-center py-6">No categories found</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {categories.map(category => (
            <tr key={category.id}>
              <td className="px-6 py-4">{category.name}</td>

              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    category.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {category.status}
                </span>
              </td>

              <td className="px-6 py-4 flex gap-3">
                {/* Edit */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setEditCategory(category)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Edit category</TooltipContent>
                </Tooltip>

                {/* Activate / Deactivate */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className={
                        category.status === 'active'
                          ? 'text-red-600 hover:text-red-900'
                          : 'text-green-600 hover:text-green-900'
                      }
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            {category.status === 'active' ? (
                              <Archive size={16} />
                            ) : (
                              <ArchiveXIcon size={16} />
                            )}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          {category.status === 'active'
                            ? 'Deactivate category'
                            : 'Activate category'}
                        </TooltipContent>
                      </Tooltip>
                    </button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will{' '}
                        {category.status === 'active'
                          ? 'deactivate'
                          : 'activate'}{' '}
                        the category.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          handleStatusToggle(category.id, category.status)
                        }
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editCategory && (
        <EditCategoryCard
          category={editCategory}
          onClose={() => {
            setEditCategory(null);
          }}
        />
      )}
    </div>
  );
};

export default CategoryTable;
