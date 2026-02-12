import React, { Suspense } from 'react';
import { useNavigate } from 'react-router';

import ProductCard from '@/components/user/ProductCard';
import { useGetUserFeed } from '@/hooks/feed/use-get-user-feed.hook';

const HomeProducts = () => {
  const navigate = useNavigate();

  const { data: feed } = useGetUserFeed();

  return feed!.map(category => (
    <React.Fragment key={category.id}>
      <section className="mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-lg lg:text-2xl font-semibold mb-4">
            {category.name}
          </h2>
          <p
            className="font-medium mb-4 text-green-700"
            onClick={() => navigate(`/category/${category.id}`)}
          >
            see all
          </p>
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scroll">
          {category.products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </React.Fragment>
  ));
};

export default function HomeProduct() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeProducts />
    </Suspense>
  );
}
