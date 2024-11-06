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
        <div className='grid grid-cols-8'>
          {products.map((product) =>
            products.length === 0 ? null : (
              <ProductCard key={product._id} product={product} />
            )
          )}
        </div>
      </main>
    </div>
  );
}

export default HomePage;
