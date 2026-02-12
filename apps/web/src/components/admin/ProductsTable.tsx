import { toast } from 'sonner';
import React, { useState } from 'react';
import { ListMinus, ListPlus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

import { Product } from '@/types/product';
import { ProductService } from '@/services/product.service';

interface AdminProductsTableProps {
  products: Product[];
}

export default function ProductsTable({ products }: AdminProductsTableProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [actionType, setActionType] = useState<'list' | 'un-list'>('list');

  const queryClient = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: string }) => {
      if (action === 'list') {
        return ProductService.listProduct(id);
      }
      return ProductService.unlistProduct(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-products'] });

      toast.success(
        `Product ${selectedProduct?.name} ${
          actionType === 'list' ? 'listed' : 'unlisted'
        } successfully`
      );

      setSelectedProduct(null);
      setActionType('list');
    },
    onError: () => {
      toast.error('Failed to update product status');
      setSelectedProduct(null);
      setActionType('list');
    },
  });

  const handleAction = () => {
    if (!selectedProduct) return;

    statusMutation.mutate({
      id: selectedProduct.id,
      action: actionType,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {[
              'Product',
              'Category',
              'Variant',
              'Price',
              'Stock',
              'Status',
              'Action',
            ].map(header => (
              <TableHead key={header} className="text-center">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map(product => (
            <TableRow key={product.id}>
              <TableCell className="text-center text-xs">
                {product.name}
              </TableCell>

              <TableCell className="text-center text-xs">
                {product.name}
              </TableCell>

              <TableCell className="text-center">
                <span
                  className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                    product.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.status}
                </span>
              </TableCell>

              <TableCell className="text-center">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setActionType(
                          product.status === 'active' ? 'un-list' : 'list'
                        );
                      }}
                      className="cursor-pointer"
                    >
                      {product.status === 'active' ? (
                        <ListMinus className="w-5 h-5 text-red-500" />
                      ) : (
                        <ListPlus className="w-5 h-5 text-green-500" />
                      )}
                    </button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Action</AlertDialogTitle>
                      <AlertDialogDescription>
                        Do you want to {actionType} this product?
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleAction}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
