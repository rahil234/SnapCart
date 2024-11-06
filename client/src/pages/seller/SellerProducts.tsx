import React, { useState, useEffect } from 'react';
import { ImportMeta } from 'shared/types';
import {
  Search,
  ChevronDown,
  Edit,
  ChevronLeft,
  ChevronRight,
  ListPlus,
  ListMinus,
} from 'lucide-react';
import productEndpoints from '@/api/productEndpoints';
import categoryEndpoints from '@/api/categoryEndpoints';
import AddProductCard from '@/components/seller/AddProductCard';
import EditProductCard from '@/components/seller/EditProductCard';
import { Product, Category, Subcategory } from 'shared/types';
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
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from 'sonner';

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

interface Categories extends Category {
  subcategories: Subcategory[];
}

const imageUrl = (import.meta as unknown as ImportMeta).env.VITE_imageUrl;

const ProductsTable: React.FC<ProductsTableProps> = ({ products, onEdit, setProducts }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [actionType, setActionType] = useState<'list' | 'unlist'>('list');

  const handleAction = async () => {
    if (selectedProduct) {
      try {
        if (actionType === 'list') {
          await productEndpoints.listProduct(selectedProduct._id);
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product._id === selectedProduct._id ? { ...product, status: 'Active' } : product
            )
          );
          toast.success('Product listed successfully');
        } else {
          await productEndpoints.unlistProduct(selectedProduct._id);

          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product._id === selectedProduct._id ? { ...product, status: 'Inactive' } : product
            )
          );
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
              'Image',
              'Product Name',
              'Category/Subcategory',
              'Price',
              'Stock',
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
          {products.map((product: Product, index: number) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <img
                  src={imageUrl + product.images[0]}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded"
                />
              </td>
              <td className="px-2 py-4 whitespace-nowrap text-xs text-center">{product.name}</td>
              <td className="px-2 py-4 whitespace-nowrap text-xs text-center">{`${product.category.name}/ ${product.subcategory?.name}`}</td>
              <td className="px-2 py-4 whitespace-nowrap text-xs text-center">₹{product.price}</td>
              <td className="px-2 py-4 whitespace-nowrap text-xs text-center">{product.stock}</td>
              <td className="px-2 py-4 whitespace-nowrap text-xs text-center">
                {product.variants ? JSON.stringify(product.variants) : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}
                >
                  {product.status === 'Active' ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
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
                          className={`${product.status === 'Active'
                            ? 'text-red-600 hover:text-red-900'
                            : 'text-green-600 hover:text-green-900'
                            } cursor-pointer`}
                          onClick={() => {
                            setSelectedProduct(product);
                            setActionType(product.status === 'Active' ? 'unlist' : 'list');
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
                        <p>{product.status === 'Active' ? 'Unlist product' : 'List product'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gray-100">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-red-600">Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-700">
                        Do you want to {actionType} the product.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-200 text-gray-700">Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600 hover:bg-red-400 text-white" onClick={handleAction}>Continue</AlertDialogAction>
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

export default function SellerProducts() {
  const [showAddProduct, setShowAddProduct] = useState<boolean>(false);
  const [showEditProduct, setShowEditProduct] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Categories[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await productEndpoints.getSellerProducts();
      setProducts(data);
    })();
    (async () => {
      const response = await categoryEndpoints.getCategories();
      const data: Categories[] = response.data;
      setCategories(data);
    })();
  }, [setShowAddProduct, setShowEditProduct]);

  const handleEditProduct = async (product: Product) => {
    setSelectedProduct(product);
    setShowEditProduct(true);
  };

  return (
    <main className="p-8 overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={() => setShowAddProduct(true)}
        >
          Add Products
        </button>
        {showAddProduct && (
          <AddProductCard onClose={() => setShowAddProduct(false)} />
        )}
        {showEditProduct && selectedProduct && (
          <EditProductCard
            product={selectedProduct}
            categories={categories}
            onClose={() => setShowEditProduct(false)}
          />
        )}
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
      {products.length > 0 ? (<>
        <ProductsTable products={products} onEdit={handleEditProduct} setProducts={setProducts} />
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
      ) : (<div className="text-center py-10">
        <p className="text-gray-500">You have no products available.</p>
      </div>)
      }
    </main >
  );
}
