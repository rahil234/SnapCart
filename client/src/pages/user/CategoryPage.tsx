import React from 'react';
import { ScrollRestoration, useParams } from 'react-router';
import ProductCard from '@/components/user/ProductCard';
import { Product } from 'shared/types';
import productEndpoints from '@/api/productEndpoints';
import { useQuery } from '@tanstack/react-query';

function HomePage() {
  const { category } = useParams();

  const {
    data: products,
    isLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ['products', category],
    queryFn: () => productEndpoints.getProductByCategory(category!),
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>Error</p>;
  }

  if(!products?.length) {
    return <p>No products available in this category</p>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <ScrollRestoration />
      <main className="px-4 mx-auto py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-7 gap-4">
          {products.length === 0 ? (
            <p>Currently there are no products available in this category</p>
          ) : (
            products.map(product => (
              <div
                key={product._id}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/6"
              >
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default HomePage;
