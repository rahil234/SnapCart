import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import adminEndpoints from '@/api/adminEndpoints';
import ProductCard from '@/components/user/ProductCard';
import { Product } from 'shared/types';
import { ImportMeta } from 'shared/types';
import productEndpoints from '@/api/productEndpoints';

const imageUrl = (import.meta as unknown as ImportMeta).env.VITE_BUCKET_URL+'/' ;
interface Products {
  categoryId: number;
  category: string;
  products: Product[];
}

function HomePage() {
  const [data, setData] = useState<Products[]>([]);
  const [banners, setBanners] = useState<{ _id: number; image: string; order: number }[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    productEndpoints.getLatestProducts().then(response => {
      setData(response.data);
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
          <React.Fragment key={category.categoryId}>
            {category.products.length === 0 ? null : (
              <section className="mb-8">
                <div className='flex justify-between items-center'>
                  <h2 className="text-2xl font-semibold mb-4">
                    {category.category}
                  </h2>
                  <p className="font-medium mb-4 text-green-700" onClick={()=>navigate(`/category/${category.categoryId}`)}>
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
    </div>
  );
}

export default HomePage;
