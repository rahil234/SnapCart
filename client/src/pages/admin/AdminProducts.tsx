import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import AddProductCard from '@/components/admin/AddProductCard';
import EditProductCard from '@/components/admin/EditProductCard';

interface Product {
  productId: string;
  image: string;
  name: string;
  category: string;
  price: number;
  piece: number;
  availableVariant?: string;
  id: string;
  productName: string;
  images: { file: File; preview: string }[];
}

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({ products, onEdit }) => (
  <div className="bg-white rounded-lg shadow overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          {[
            'Image',
            'Product Name',
            'Category',
            'Price',
            'Piece',
            'Available Variant',
            'Action',
          ].map(header => (
            <th
              key={header}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {products.map((product: Product) => (
          <tr key={product.productId}>
            <td className="px-6 py-4 whitespace-nowrap">
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 object-cover rounded"
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
            <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
            <td className="px-6 py-4 whitespace-nowrap">₹{product.price}</td>
            <td className="px-6 py-4 whitespace-nowrap">{product.piece}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              {product.availableVariant || '-'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                className="text-blue-600 hover:text-blue-900 mr-4"
                onClick={() => onEdit(product)}
              >
                <Edit size={16} />
              </button>
              <button className="text-red-600 hover:text-red-900">
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function AdminProducts() {
  const [showAddProduct, setShowAddProduct] = useState<boolean>(false);
  const [showEditProduct, setShowEditProduct] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const products = [
    {
      productId: '1',
      id: '1',
      productName: 'Lite chawda',
      image: 'uploads/image1.webp',
      name: 'Lite chawda',
      category: 'Snacks',
      price: 45,
      piece: 63,
      images: [
        { file: new File([], 'placeholder1'), preview: 'https://via.placeholder.com/150' },
        { file: new File([], 'placeholder2'), preview: 'https://via.placeholder.com/150' },
      ],
    },
    {
      productId: '2',
      id: '2',
      productName: 'Amul Cheese',
      image: '/placeholder.svg?height=48&width=48',
      name: 'Amul Cheese',
      category: 'Diary',
      price: 35,
      piece: 13,
      images: [
        { file: new File([], 'placeholder'), preview: 'https://via.placeholder.com/150' },
        { file: new File([], 'placeholder'), preview: 'https://via.placeholder.com/150' },
      ],
    },
    {
      productId: '3',
      id: '3',
      productName: 'Milkymist Paneer',
      image: '/placeholder.svg?height=48&width=48',
      name: 'Milkymist Paneer',
      category: 'Diary',
      price: 45,
      piece: 635,
      images: [
        { file: null, preview: 'https://via.placeholder.com/150' },
        { file: null, preview: 'https://via.placeholder.com/150' },
      ],
    },
    {
      productId: '4',
      id: '4',
      productName: 'Homemade Lemonade',
      image: '/placeholder.svg?height=48&width=48',
      name: 'Homemade Lemonade',
      category: 'Drinks',
      price: 30,
      piece: 67,
      images: [
        { file: null, preview: 'https://via.placeholder.com/150' },
        { file: null, preview: 'https://via.placeholder.com/150' },
      ],
    },
    {
      productId: '5',
      id: '5',
      productName: 'Doritos',
      image: '/placeholder.svg?height=48&width=48',
      name: 'Doritos',
      category: 'Snacks',
      price: 30,
      piece: 52,
      images: [
        { file: null, preview: 'https://via.placeholder.com/150' },
        { file: null, preview: 'https://via.placeholder.com/150' },
      ],
    },
    {
      productId: '6',
      id: '6',
      productName: 'Doritos 2 in 1',
      image: '/placeholder.svg?height=48&width=48',
      name: 'Doritos 2 in 1',
      category: 'Snacks',
      price: 45,
      piece: 13,
      images: [
        { file: null, preview: 'https://via.placeholder.com/150' },
        { file: null, preview: 'https://via.placeholder.com/150' },
      ],
    },
  ];

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowEditProduct(true);
  };

  return (
    <main className="p-6">
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
      <ProductsTable products={products} onEdit={handleEditProduct} />
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
    </main>
  );
}
