import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { fetchProducts } from '@/api/userEndpoints';
import { Category } from 'shared/types';

export default function Component() {
  const [data, setData] = useState<Category[]>([]);

  const imageUrl = 'https://localhost/';

  useEffect(() => {
    fetchProducts().then(response => {
      setData(response.data);
      console.log(response.data);
    });
  }, []);

  return (
    <div className="min-h-[76vh] bg-gray-100">
      <main className="px-4 mx-auto py-8">
        <div className="flex gap-1 mb-8">
          {[1, 2, 3, 4].map((banner) => (
            <div
              key={banner}
              className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-6 text-white w-full"
            >
              <h2 className="text-lg font-semibold mb-2">Special Offer</h2>
              <p className="text-sm">Save big on selected items!</p>
            </div>
          ))}
        </div>
        {data.map((category) => (
          <React.Fragment key={category.categoryId}> {/* Use unique key for each category */}
            {category.products.length === 0 ? null : (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  {category.category}
                </h2>
                <div className="flex gap-2 overflow-scroll hide-scroll">
                  {category.products.map(product => (
                    <Link key={product._id} to={'/product/' + product._id}>
                      <div className="bg-white rounded-lg object-center shadow p-2 min-w-[170px] flex flex-col ">
                        <div className="">
                          <img
                            src={imageUrl+product.images[0]}
                            alt={product.name}
                            className="object-cover  h-[170px] mb-2"
                          />
                        </div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <h3 className="text-xs">{product.quantity}</h3>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-600">₹{product.price}</p>
                          <Button
                            className="border border-[#318615] text-[#318615]"
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
