import React from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';

import ProductsTable from '@/components/admin/ProductsTable';
import { useGetAdminProducts } from '@/hooks/products/use-get-admin-products.hook';

export default function AdminProducts() {
  const { data: products, isLoading, isError, error } = useGetAdminProducts();

  if (isLoading) {
    return (
      <main className="p-8">
        <div className="text-center py-10">
          <p className="text-gray-500">Loading...</p>
        </div>
      </main>
    );
  }

  if (isError || !products) {
    return (
      <main className="p-8">
        <div className="text-center py-10">
          <p className="text-red-500">
            Error: {error?.message || "can't Fetch the products now"}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-8 overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <div></div>
        <div className="flex space-x-4">
          <div className="relative">
            <select className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8">
              <option>Filter by</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search product name"
              className="pl-10 pr-4 py-2 rounded-lg border"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
        </div>
      </div>
      {products.length > 0 ? (
        <>
          <ProductsTable products={products} />
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>Showing 1-09 of 78</span>
            <div className="flex space-x-2">
              <button className="p-2 rounded-md bg-white shadow">
                <ChevronLeft size={16} />
              </button>
              <button className="p-2 rounded-md bg-white shadow">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">You have no products available.</p>
        </div>
      )}
    </main>
  );
}
