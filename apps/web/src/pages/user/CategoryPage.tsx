import React, { useEffect } from 'react';
import { ScrollRestoration, useNavigate, useParams } from 'react-router';

import ProductCard from '@/components/user/ProductCard';
import { useGetProductsByCategoryId } from '@/hooks/product.hooks';

function CategoryPage() {
  const { category: categoryId } = useParams<{ category: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!categoryId) {
      navigate('/not-found', { replace: true });
    }
  }, [categoryId, navigate]);

  const {
    data: products = [],
    isLoading,
    isError,
  } = useGetProductsByCategoryId(categoryId!);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading products</p>;
  }

  if (products.length === 0) {
    return <p>No products available in this category</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <ScrollRestoration />
      <main className="px-4 mx-auto py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-7 gap-4">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default CategoryPage;
