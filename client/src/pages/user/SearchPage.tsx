import React, { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import ProductCard from '@/components/user/ProductCard';
import { Category, Product } from 'shared/types';
import productEndpoints from '@/api/productEndpoints';
import categoryEndpoints from '@/api/categoryEndpoints';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryEndpoints.getCategories(),
  }) as { data: Category[] };

  const handleCategoryChange = useCallback(
    (value: string) => {
      setSearchParams(prevParams => {
        const params = Object.fromEntries(prevParams.entries());
        return {
          ...params,
          category: value,
        };
      });
    },
    [setSearchParams]
  );

  const handlePriceRangeChange = useCallback(
    (value: number[]) => {
      setSearchParams(prevParams => {
        const params = Object.fromEntries(prevParams.entries());
        return {
          ...params,
          minPrice: value[0].toString(),
          maxPrice: value[1].toString(),
        };
      });
    },
    [setSearchParams]
  );

  const handleSortChange = useCallback(
    (value: string) => {
      setSearchParams(prevParams => {
        const params = Object.fromEntries(prevParams.entries());
        return { ...params, sort: value };
      });
    },
    [setSearchParams]
  );

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">
        Search results for &quot;{searchParams.get('query')}&quot;
      </h1>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-64 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Filter by Category</h2>
            <Select
              onValueChange={handleCategoryChange}
              defaultValue={searchParams.get('category') || 'all'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Filter by Price</h2>
            <Slider
              min={0}
              max={1000}
              step={10}
              defaultValue={[
                parseInt(searchParams.get('minPrice') || '0'),
                parseInt(searchParams.get('maxPrice') || '1000'),
              ]}
              onValueChange={handlePriceRangeChange}
            />
            <div className="flex justify-between mt-2">
              <span>₹{searchParams.get('minPrice') || '0'}</span>
              <span>₹{searchParams.get('maxPrice') || '1000'}</span>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Sort</h2>
            <Select
              onValueChange={handleSortChange}
              defaultValue={searchParams.get('sort') || 'name.asc'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a sort option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name.asc">Name (A-Z)</SelectItem>
                <SelectItem value="name.desc">Name (Z-A)</SelectItem>
                <SelectItem value="price.asc">Price (Low to High)</SelectItem>
                <SelectItem value="price.desc">Price (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ProductsTable />
      </div>
    </div>
  );
}

const ProductsTable = React.memo(function ProductsTable() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || 'all';
  const minPrice = parseInt(searchParams.get('minPrice') || '0');
  const maxPrice = parseInt(searchParams.get('maxPrice') || '1000');
  const sortBy = searchParams.get('sort') || 'name.asc';

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products', query, category, minPrice, maxPrice, sortBy],
    queryFn: () =>
      productEndpoints.searchProducts({
        query,
        category,
        minPrice,
        maxPrice,
        sortBy,
      }),
  });

  if (isLoading)
    return <div className="text-center p-8">Loading products...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 p-8">
        Error: {(error as Error).message}
      </div>
    );

  if (products.length === 0) {
    return <div className="text-center p-8">No products found</div>;
  }

  return (
    <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product: Product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
});

export default SearchPage;
