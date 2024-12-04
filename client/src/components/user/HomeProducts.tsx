import React, { Suspense } from 'react';
import ProductCard from '@/components/user/ProductCard';
import { useNavigate } from 'react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import productEndpoints from '@/api/productEndpoints';
import { Product } from 'shared/types';

interface Products {
  categoryId: number;
  category: string;
  products: Product[];
}

const HomeProducts = () => {
  const { data: products } = useSuspenseQuery<Products[]>({
    queryKey: ['latest-products'],
    queryFn: productEndpoints.getLatestProducts,
  });

  const navigate = useNavigate();

  if (!products) return null;

  return (
    <>
      {products.map(category => (
        <React.Fragment key={category.categoryId}>
          {category.products.length === 0 ? null : (
            <section className="mb-8">
              <div className="flex justify-between items-center">
                <h2 className="text-lg lg:text-2xl font-semibold mb-4">
                  {category.category}
                </h2>
                <p
                  className="font-medium mb-4 text-green-700"
                  onClick={() => navigate(`/category/${category.categoryId}`)}
                >
                  see all
                </p>
              </div>
              <div className="flex gap-2 overflow-x-auto hide-scroll">
                {category.products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </section>
          )}
        </React.Fragment>
      ))}
      ;
    </>
  );
};

export default function HomeProduct() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeProducts />
    </Suspense>
  );
}
