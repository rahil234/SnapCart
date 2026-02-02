import React, { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '@/components/user/ProductCard';
import { ProductService } from '@/services/product.service';
import { IProduct } from '@/types/product';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);

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
    <div className="mx-auto w-[90vw]">
      <h1 className="text-2xl font-bold mb-4">
        Search results for &quot;{searchParams.get('query')}&quot;
      </h1>
      <Toggle
        size="lg"
        variant="outline"
        className="w-20 mb-4 data-[state=on]:bg-black data-[state=on]:text-white"
        pressed={filterOpen}
        onClick={() => setFilterOpen(!filterOpen)}
      >
        Filter
      </Toggle>
      <div className="flex flex-col md:flex-row gap-4">
        {filterOpen && (
          <ProductsFilterCard
            searchParams={searchParams}
            handleCategoryChange={handleCategoryChange}
            handlePriceRangeChange={handlePriceRangeChange}
            handleSortChange={handleSortChange}
          />
        )}
        <ProductsTable filterOpen={filterOpen} />
      </div>
    </div>
  );
}

const ProductsTable = React.memo(function ProductsTable({
  filterOpen,
}: {
  filterOpen: boolean;
}) {
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
      ProductService.searchProducts({
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
    <div
      className={`flex-grow grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ${filterOpen ? 'md:grid-cols-3 lg:grid-cols-5 gap-7' : ''}`}
    >
      {products.map((product: IProduct) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
});

export default SearchPage;
