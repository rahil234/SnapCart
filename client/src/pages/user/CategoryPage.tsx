import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '@/components/user/ProductCard';
import { Product } from 'shared/types';
import productEndpoints from '@/api/productEndpoints';


function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  const { category } = useParams();

  useEffect(() => {
    if (category) {
      productEndpoints.getProductByCategory(category).then(response => {
        setProducts(response.data);
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="px-4 mx-auto py-8">
        <div className="flex flex-wrap gap-4 justify-start">
          {products.length === 0 ? (
            <p>Currntly there are no products available in this category</p>
          ) : (
            products.map((product) => (
              <div key={product._id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/6">
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
