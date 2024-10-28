import React, { useEffect, useState, useContext } from 'react';
import userEndpoints from '@/api/userEndpoints';
import adminEndpoints from '@/api/adminEndpoints';
import { UIContext } from '@/context/UIContext';
import CartOverlay from '@/components/user/CartOverlay';
import ProductCard from '@/components/user/ProductCard';
import { Product } from 'shared/types';
import { ImportMeta } from 'shared/types';

interface Products {
  categoryId: number;
  category: string;
  products: Product[];
}

export default function Component() {
  const [data, setData] = useState<Products[]>([]);
  const { isCartOverlayOpen } = useContext(UIContext);
  const [banners, setBanners] = useState<{ _id: number; image: string; order: number }[]>([]);

  const imageUrl = (import.meta as unknown as ImportMeta).env.VITE_BUCKET_URL ;

  useEffect(() => {
    // Fetch products
    userEndpoints.fetchProducts().then(response => {
      setData(response.data);
      console.log(response.data);
    });

    // Fetch banners
    adminEndpoints.getBanners().then(response => {
      setBanners(response.data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="px-4 mx-auto py-8">
        <div className="flex gap-1 mb-8">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className="rounded-lg text-white w-full"
            >
              {banner.image ? (
                <img
                  src={imageUrl + banner.image}
                  alt="Banner"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <h2 className="text-lg font-semibold mb-2">Special Offer</h2>
                  <p className="text-sm">Save big on selected items!</p>
                </>
              )}
            </div>
          ))}
        </div>

        {data.map((category) => (
          <React.Fragment key={category.categoryId}> {/* Use unique key for each category */}
            {category.products.length === 0 ? null : (
              <section className="mb-8">
                <div className='flex justify-between items-center'>
                  <h2 className="text-2xl font-semibold mb-4">
                    {category.category}
                  </h2>
                  <p className="font-medium mb-4 text-green-700">
                    see all
                  </p>
                </div>
                <div className="flex gap-2 overflow-scroll hide-scroll">
                  {category.products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </section>
            )}
          </React.Fragment>
        ))}
      </main>
      {isCartOverlayOpen && <CartOverlay />}
    </div>
  );
}
