import React, { useState } from 'react';

import { useGetCategories } from '@/hooks/category.hooks';
import CategoryTable from '@/components/admin/CategoryTable';
import AddCategoryCard from '@/components/admin/AddCategoryCard';

const AdminCategory = () => {
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const { data: categories } = useGetCategories();

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
            open={isAddingCategory}
            onClose={() => {
              setIsAddingCategory(false);
            }}
          />
        )}
      </div>
      <CategoryTable categories={categories} />
    </main>
  );
};

export default AdminCategory;
