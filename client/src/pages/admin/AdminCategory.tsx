import React, { useState, useEffect } from 'react';
import { Edit, Archive, ArchiveXIcon } from 'lucide-react';
import AddCategoryCard from '@/components/admin/AddCategoryCard';
import EditCategoryCard from '@/components/admin/EditCategoryCard';
import adminEndpoints from '@/api/adminEndpoints';

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

  const handleEditClick = (categoryName: string, subCategory: SubCategory, categoryId: string) => {
    setEditData({ ...subCategory, catId: categoryId, catName: categoryName });
    setIsEditCardOpen(true);
  };

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
                      {subCategory.status === 'Active' ? (
                        <button className="text-red-600 hover:text-red-900">
                          <Archive size={16} />
                        </button>
                      ) : (
                        <button className="text-green-600 hover:text-green-900">
                          <ArchiveXIcon size={16} />
                        </button>
                      )}
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
                    {category.status === 'Active' ? (
                      <button className="text-red-600 hover:text-red-900">
                        <Archive size={16} />
                      </button>
                    ) : (
                      <button className="text-green-600 hover:text-green-900">
                        <ArchiveXIcon size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {isEditCardOpen && editData && (
        <EditCategoryCard
          onClose={() => setIsEditCardOpen(false)}
          editData={{ ...editData, subCategories: editData?.name || '' }}
        />
      )}
    </div>
  );
};

const AdminCategory = () => {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    adminEndpoints.getCategories().then((response) => {
      setCategories(response.data);
      console.log(response.data);
    });
  }, []);

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
          <AddCategoryCard onClose={() => {
            adminEndpoints.getCategories().then((response) => {
              setCategories(response.data);
            });
            setIsAddingCategory(false)
          }} />
        )}
      </div>
      <CategoryTable categories={categories} />
    </main>
  );
}

export default AdminCategory;