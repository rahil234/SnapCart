import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Category } from '@snapcart/shared/types';
import { useQuery } from '@tanstack/react-query';
import categoryEndpoints from '@/api/category/categoryEndpoints';

interface FilterCardProps {
  handleCategoryChange: (value: string) => void;
  searchParams: URLSearchParams;
  handlePriceRangeChange: (value: number[]) => void;
  handleSortChange: (value: string) => void;
}

const ProductsFilterCard = ({
  handleCategoryChange,
  searchParams,
  handlePriceRangeChange,
  handleSortChange,
}: FilterCardProps) => {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryEndpoints.getCategories(),
  }) as { data: Category[] };

  return (
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
  );
};

export default ProductsFilterCard;
