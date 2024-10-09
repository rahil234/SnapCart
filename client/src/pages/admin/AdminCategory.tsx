import React,{useState} from 'react';
import { Edit, Archive, ArchiveXIcon } from 'lucide-react';
import AddCategoryCard from '@/components/admin/AddCategoryCard';

type SubCategory = {
  name: string;
  status: string;
};

type Category = {
  name: string;
  subCategories: SubCategory[];
};

type CategoryTableProps = {
  categories: Category[];
};

const categories = [
  {
    name: 'Food',
    subCategories: [
      { name: 'Snacks', status: 'Active' },
      { name: 'Diary', status: 'Active' },
      { name: 'Drinks', status: 'Active' },
    ],
  },
  {
    name: 'Essentials',
    subCategories: [
      { name: 'Cooking Utensils', status: 'Active' },
      { name: 'Cutting tools', status: 'Active' },
      { name: 'Measuring tools', status: 'Blocked' },
    ],
  },
  {
    name: 'Groceries',
    subCategories: [
      { name: 'Fresh produce', status: 'Active' },
      { name: 'Pantry staples', status: 'Active' },
    ],
  },
  {
    name: 'BabyCare',
    subCategories: [
      { name: 'Diapering essentials', status: 'Active' },
      { name: 'Feeding necessities', status: 'Active' },
      { name: 'Bathing & Skincare', status: 'Active' },
    ],
  },
];

const CategoryTable: React.FC<CategoryTableProps> = ({ categories }) => (
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
        {categories.map((category, index) => (
          <React.Fragment key={index}>
            {category.subCategories.map((subCategory, subIndex) => (
              <tr key={`${index}-${subIndex}`}>
                {subIndex === 0 && (
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    rowSpan={category.subCategories.length}
                  >
                    {category.name}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  {subCategory.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs text-center leading-5 font-semibold rounded-full ${
                      subCategory.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {subCategory.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-4">
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
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  </div>
);

export default function AdminCategory() {
  const [isAddingCategory, setIsAddingCategory] = useState(false);

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
          <AddCategoryCard onClose={() => setIsAddingCategory(false)} />
        )}
      </div>
      <CategoryTable categories={categories} />
    </main>
  );
}
