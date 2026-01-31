import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

import { Product } from '@/types';
import { ProductService } from '@/api/product/product.service';
import AddProductModal from '@/components/seller/AddProductModal';
import { ProductsTable } from '@/components/seller/ProductsTable';
import EditProductModal from '@/components/seller/EditProductModal';

function SellerProducts() {
  const [showAddProduct, setShowAddProduct] = useState<boolean>(false);
  const [showEditProduct, setShowEditProduct] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: products } = useQuery<Product[]>({
    queryKey: ['seller-products', showEditProduct, showAddProduct],
    queryFn: ProductService.getSellerProducts,
  });

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowEditProduct(true);
  };

  if (!products) {
    return <>Products loading...</>;
  }

  return (
    <main className="p-8 overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={() => setShowAddProduct(true)}
        >
          Add Products
        </button>
        {showAddProduct && (
          <AddProductModal onClose={() => setShowAddProduct(false)} />
        )}
        {showEditProduct && selectedProduct && (
          <EditProductModal
            onClose={() => setShowEditProduct(false)}
            product={selectedProduct}
          />
        )}
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
          <ProductsTable products={products} onEdit={handleEditProduct} />
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

export default SellerProducts;
