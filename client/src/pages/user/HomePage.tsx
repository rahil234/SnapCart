import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import userEndpoints from '@/api/userEndpoints';
import adminEndpoints from '@/api/adminEndpoints'; // Import adminEndpoints to fetch banners
import { Product } from 'shared/types';

interface Products {
  categoryId: number;
  category: string;
  products: Product[];
}

export default function Component() {
  const [data, setData] = useState<Products[]>([]);
  const [banners, setBanners] = useState<{ _id: number; image: string; order: number }[]>([]); // State to store banners

  const imageUrl = 'http://localhost:3000/';

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
                    <Link key={product._id} to={'/product/' + product._id}>
                      <div className="bg-white rounded-lg object-center shadow p-2 min-w-[170px] flex flex-col ">
                        <div className="rounded-sm overflow-hidden">
                          <img
                            src={imageUrl + product.images[0]}
                            alt={product.name}
                            className="object-cover  h-[170px] mb-2"
                          />
                        </div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <h3 className="text-xs">{product.quantity}</h3>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-600">₹{product.price}</p>
                          <Button
                            className="border border-[#318615] bg-white text-[#318615]"
                            size="sm"
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </Link>
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
