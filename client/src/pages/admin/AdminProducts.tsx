import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ListPlus,
  ListMinus,
} from 'lucide-react';
import productEndpoints from '@/api/productEndpoints';
import { Product } from 'shared/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { ImportMeta } from 'types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type IVariantGroup = {
  _id: string;
  products: Product[];
};

interface ProductsTableProps {
  variantGroup: IVariantGroup[];
}

const imageUrl =
  (import.meta as unknown as ImportMeta).env.VITE_IMAGE_URL + '/products/';

const ProductsTable: React.FC<ProductsTableProps> = ({ variantGroup }) => {
  const [actionType, setActionType] = useState<'list' | 'un-list'>('list');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const queryClient = useQueryClient();

  const handleAction = async () => {
    if (selectedProduct) {
      try {
        if (actionType === 'list') {
          await productEndpoints.listProduct(selectedProduct._id);
          await queryClient.invalidateQueries({ queryKey: ['admin-products'] });
          toast.success('Product listed successfully');
        } else {
          await productEndpoints.unlistProduct(selectedProduct._id);
          await queryClient.invalidateQueries({ queryKey: ['admin-products'] });
          toast.success('Product unlisted successfully');
        }
      } catch (error) {
        console.error(`Failed to ${actionType} product:`, error);
        toast.error(`Failed to ${actionType} product`);
      }
      setSelectedProduct(null);
      setActionType('list');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            {[
              'Product Name',
              'Category/Subcategory',
              'Available Variants',
              'Image',
              'Price',
              'Stock',
              'Status',
              'Action',
            ].map(header => (
              <th
                key={header}
                className="px-2 py-3 text-xs text-center font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {variantGroup.map(variantGroup => (
            <React.Fragment key={variantGroup._id}>
              {variantGroup.products.map((product, index) => (
                <tr key={index}>
                  {index === 0 && (
                    <>
                      <td
                        className="px-2 py-4 text-xs text-center"
                        rowSpan={variantGroup.products.length}
                      >
                        {product.name}
                      </td>
                      <td
                        className="px-2 py-4 text-xs text-center"
                        rowSpan={variantGroup.products.length}
                      >{`${product.category.name}/ ${product.subcategory.name}`}</td>
                    </>
                  )}
                  <td className="px-2 py-4 text-xs text-center">
                    {product.variantName}
                  </td>
                  <td className="px-6 py-4">
                    <img
                      src={imageUrl + product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-2 py-4 text-xs text-center">
                    ₹{product.price}
                  </td>
                  <td className="px-2 py-4 text-xs text-center">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.status === 'Active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              className={`${
                                product.status === 'Active'
                                  ? 'text-red-600 hover:text-red-900'
                                  : 'text-green-600 hover:text-green-900'
                              } cursor-pointer`}
                              onClick={() => {
                                setSelectedProduct(product);
                                setActionType(
                                  product.status === 'Active'
                                    ? 'un-list'
                                    : 'list'
                                );
                              }}
                            >
                              {product.status === 'Active' ? (
                                <ListMinus className="w-5 h-5 text-red-500" />
                              ) : (
                                <ListPlus className="w-5 h-5 text-green-500" />
                              )}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="bg-white text-black shadow-lg">
                            <p>
                              {product.status === 'Active'
                                ? 'Un-list product'
                                : 'List product'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-gray-100">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-red-600">
                            Are you sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-700">
                            Do you want to {actionType} the product.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-200 text-gray-700">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-400 text-white"
                            onClick={handleAction}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function AdminProducts() {
  // const [variantGroup, setVariantGroup] = useState<IVariantGroup[]>([]);

  // useEffect(() => {
  //   (async () => {
  //     const data = await productEndpoints.getAdminProducts();
  //     setVariantGroup(data);
  //   })();
  // }, []);
  const { data: variantGroup, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: productEndpoints.getAdminProducts,
  });

  if (isLoading) {
    return (
      <main className="p-8">
        <div className="text-center py-10">
          <p className="text-gray-500">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-8 overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <div></div>
        <div className="flex space-x-4">
          <div className="relative">
            <select className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8">
              <option>Filter by</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search product name"
              className="pl-10 pr-4 py-2 rounded-lg border"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
        </div>
      </div>
      {variantGroup.length > 0 ? (
        <>
          <ProductsTable variantGroup={variantGroup} />
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>Showing 1-09 of 78</span>
            <div className="flex space-x-2">
              <button className="p-2 rounded-md bg-white shadow">
                <ChevronLeft size={16} />
              </button>
              <button className="p-2 rounded-md bg-white shadow">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">You have no products available.</p>
        </div>
      )}
    </main>
  );
}
