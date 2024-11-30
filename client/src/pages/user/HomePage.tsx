import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import adminEndpoints from '@/api/adminEndpoints';
import ProductCard from '@/components/user/ProductCard';
import { Product } from 'shared/types';
import { ImportMeta } from '@types';
import productEndpoints from '@/api/productEndpoints';
import ReferalSuccess from '@/components/user/ReferalSuccess';
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
import ReferalFailed from '@/components/user/ReferalFailed';

const imageUrl =
  (import.meta as unknown as ImportMeta).env.VITE_IMAGE_URL + '/banners/';

interface Products {
  categoryId: number;
  category: string;
  products: Product[];
}

function HomePage() {
  const { referalId } = useParams();

  const [data, setData] = useState<Products[]>([]);
  const [banners, setBanners] = useState<
    { _id: number; image: string; order: number }[]
  >([]);
  const [showReferalSuccess, setShowReferalSuccess] = useState(false);
  const [showReferalFailure, setShowReferalFailure] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    productEndpoints.getLatestProducts().then(response => {
      setData(response.data);
    });

    adminEndpoints.getBanners().then(response => {
      setBanners(response.data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <AlertDialog open={showReferalSuccess}>
        <AlertDialogContent className="p-0 w-auto">
          <ReferalSuccess onClose={() => setShowReferalSuccess(false)} />
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showReferalFailure}>
        <AlertDialogContent className="p-0 w-auto">
          <ReferalFailed onClose={() => setShowReferalFailure(false)} />
        </AlertDialogContent>
      </AlertDialog>
      <main className="px-4 mx-auto py-8">
        <div className="flex overflow-x-auto hide-scroll gap-2 lg:gap-1 mb-8">
          {banners.map(banner => (
            <div
              key={banner._id}
              className="text-white flex-shrink-0 w-full lg:w-1/3 h-50 lg:h-60"
            >
              {banner.image ? (
                <img
                  src={imageUrl + banner.image}
                  alt="Banner"
                  className="w-full h-full object-cover rounded-lg lg:rounded-xl"
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

        {data.map(category => (
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
      </main>
    </div>
  );
}

export default HomePage;
