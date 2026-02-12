import { toast } from 'sonner';
import React, { useState } from 'react';
import { Edit, ListMinus, ListPlus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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

import { ProductWithVariants } from '@/types';
import { ProductService } from '@/services/product.service';

interface ProductsTableProps {
  products: ProductWithVariants[];
  onEdit: (product: ProductWithVariants) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({ products, onEdit }) => {
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithVariants | null>(null);
  const [actionType, setActionType] = useState<'list' | 'un-list'>('list');

  const queryClient = useQueryClient();

  // Mutation for listing a product
  const listProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await ProductService.listProduct(productId);
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      toast.success(
        `Product ${selectedProduct?.name} ${selectedProduct?.name} listed successfully`
      );
      setSelectedProduct(null);
      setActionType('list');
    },
    onError: error => {
      console.error('Failed to list product:', error);
      toast.error('Failed to list product');
      setSelectedProduct(null);
      setActionType('list');
    },
  });

  // Mutation for unlisting a product
  const unlistProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await ProductService.unlistProduct(productId);
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      toast.success(
        `Product ${selectedProduct?.name} ${selectedProduct?.name} unlisted successfully`
      );
      setSelectedProduct(null);
      setActionType('list');
    },
    onError: error => {
      console.error('Failed to unlist product:', error);
      toast.error('Failed to unlist product');
      setSelectedProduct(null);
      setActionType('list');
    },
  });

  const handleAction = () => {
    if (selectedProduct) {
      if (actionType === 'list') {
        listProductMutation.mutate(selectedProduct.id);
      } else {
        unlistProductMutation.mutate(selectedProduct.id);
      }
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
          {products.map((product, index) => (
            <tr key={index}>
              <td className="px-2 py-4 whitespace-nowrap text-xs text-center">
                {product.name}
              </td>
              <td className="px-2 py-4 whitespace-nowrap text-xs text-center">
                {product.name}
              </td>
              <td className="px-2 py-4 whitespace-nowrap text-xs text-center">
                {product.variants?.map(v => v.variantName).join(', ')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <button
                  className="text-blue-600 hover:text-blue-900 mr-4"
                  onClick={() => onEdit(product)}
                >
                  <Edit size={16} />
                </button>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className={`${
                            product.status === 'active'
                              ? 'text-red-600 hover:text-red-900'
                              : 'text-green-600 hover:text-green-900'
                          } cursor-pointer`}
                          onClick={() => {
                            setSelectedProduct(product);
                            setActionType(
                              product.status === 'active' ? 'un-list' : 'list'
                            );
                          }}
                        >
                          {product.status === 'active' ? (
                            <ListMinus className="w-5 h-5 text-red-500" />
                          ) : (
                            <ListPlus className="w-5 h-5 text-green-500" />
                          )}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white text-black shadow-lg">
                        <p>
                          {product.status === 'active'
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
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;
