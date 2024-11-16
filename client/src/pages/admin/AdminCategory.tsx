import React, { useState } from 'react';
import { Edit, Archive, ArchiveXIcon } from 'lucide-react';
import AddCategoryCard from '@/components/admin/AddCategoryCard';
import EditCategoryCard from '@/components/admin/EditCategoryCard';
import categoryEndpoints from '@/api/categoryEndpoints';
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
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type SubCategory = {
  _id: string;
  name: string;
  status: 'Active' | 'Blocked';
  catId: string;
  catName: string;
};

type Category = {
  _id: string;
  name: string;
  status: string;
  subcategories: SubCategory[];
};

type CategoryTableProps = {
  categories: Category[];
};

const CategoryTable: React.FC<CategoryTableProps> = ({ categories }) => {
  const [isEditCardOpen, setIsEditCardOpen] = useState(false);
  const [editData, setEditData] = useState<SubCategory | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [actionType, setActionType] = useState<'block' | 'unblock' | null>(null);

  const queryClient = useQueryClient();

  const handleEditClick = (categoryName: string, subCategory: SubCategory, categoryId: string) => {
    setEditData({ ...subCategory, catId: categoryId, catName: categoryName });
    setIsEditCardOpen(true);
  };

  const handleBlockSubCategory = async (subCategoryId: string) => {
    try {
      await categoryEndpoints.archiveCategory(subCategoryId);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Subcategory archived successfully');
    } catch (error) {
      console.error('Failed to archive subcategory:', error);
      toast.error('Failed to archive subcategory');
    }
  };

  const handleUnblockSubCategory = async (subCategoryId: string) => {
    try {
      await categoryEndpoints.unarchiveCategory(subCategoryId);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Subcategory unarchived successfully');
    } catch (error) {
      console.error('Failed to unarchived subcategory:', error);
      toast.error('Failed to unarchived subcategory');
    }
  };

  const handleAction = () => {
    if (selectedSubCategory && actionType) {
      if (actionType === 'block') {
        handleBlockSubCategory(selectedSubCategory._id);
      } else if (actionType === 'unblock') {
        handleUnblockSubCategory(selectedSubCategory._id);
      }
      setSelectedSubCategory(null);
      setActionType(null);
    }
  };


  if (!categories) {
    return <div className="text-center">No categories found</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sub Categories
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((category) => (
            <React.Fragment key={category._id}>
              {category.subcategories.length > 0 ? (
                category.subcategories.map((subCategory, subIndex) => (
                  <tr key={subCategory._id}>
                    {subIndex === 0 && (
                      <td
                        className="px-6 py-4 whitespace-nowrap"
                        rowSpan={category.subcategories.length}
                      >
                        {category.name}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {subCategory.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs text-center leading-5 font-semibold rounded-full ${subCategory.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {subCategory.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        onClick={() => handleEditClick(category.name, subCategory, category._id)}
                      >
                        <Edit size={16} />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span
                                className={`${subCategory.status === 'Active'
                                  ? 'text-red-600 hover:text-red-900'
                                  : 'text-green-600 hover:text-green-900'
                                  } cursor-pointer`}
                                onClick={() => {
                                  setSelectedSubCategory(subCategory);
                                  setActionType(subCategory.status === 'Active' ? 'block' : 'unblock');
                                }}
                              >
                                {subCategory.status === 'Active' ? (
                                  <Archive size={16} />
                                ) : (
                                  <ArchiveXIcon size={16} />
                                )}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white text-black shadow-lg">
                              <p>{subCategory.status === 'Active' ? 'Block subcategory' : 'Unblock subcategory'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-gray-100">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-red-600">Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-700">
                              Do you want to {actionType === 'block' ? 'block' : 'unblock'} the subcategory.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-gray-200 text-gray-700">Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-600 hover:bg-red-400 text-white" onClick={handleAction}>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))
              ) : (
                <tr key={category._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">No Subcategories</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs text-center leading-5 font-semibold rounded-full ${category.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {category.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      onClick={() => handleEditClick(category.name, { _id: '', name: '', status: 'Active', catId: category._id, catName: category.name }, category._id)}
                    >
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {isEditCardOpen && editData && (
        <EditCategoryCard
          editData={{ ...editData, subCategories: editData?.name || '' }}
          onClose={() => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setIsEditCardOpen(false)
          }}
        />
      )}
    </div>
  );
};

const AdminCategory = () => {
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const queryClient = useQueryClient();

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: categoryEndpoints.getCategories,
  });

  if (!categories) {
    return <div className="text-center">No categories found</div>;
  }

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={() => setIsAddingCategory(true)}
        >
          Add Category
        </button>
        {isAddingCategory && (
          <AddCategoryCard
            onClose={() => {
              queryClient.invalidateQueries({ queryKey: ['categories'] });
              setIsAddingCategory(false)
            }} />
        )}
      </div>
      <CategoryTable categories={categories!} />
    </main>
  );
}

export default AdminCategory;