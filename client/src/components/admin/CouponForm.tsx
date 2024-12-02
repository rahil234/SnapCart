import { useQuery } from '@tanstack/react-query';
import { Category, ICoupon, Product } from 'shared/types';
import productEndpoints from '@/api/productEndpoints';
import categoryEndpoints from '@/api/categoryEndpoints';
import React, { useState } from 'react';
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface CouponFormProps {
  coupon?: ICoupon;
  onSubmit: (coupon: ICoupon | Omit<ICoupon, 'id'>) => void;
}

function CouponForm({ coupon, onSubmit }: CouponFormProps) {
  const { data: products } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: productEndpoints.getAdminProducts,
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: categoryEndpoints.getCategories,
  });

  const [formData, setFormData] = useState<Omit<ICoupon, 'id'>>({
    _id: coupon?._id || '',
    code: coupon?.code || '',
    discount: coupon?.discount || 0,
    type: coupon?.type || 'percentage',
    minAmount: coupon?.minAmount || 0,
    maxDiscount: coupon?.maxDiscount || 0,
    startDate: coupon?.startDate || '',
    endDate: coupon?.endDate || '',
    status: coupon?.status || 'Active',
    applicableTo: coupon?.applicableTo || 'All',
    products: coupon?.products || [],
    categories: coupon?.categories || [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (
    name: 'products' | 'categories',
    id: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].includes(id)
        ? prev[name].filter(item => item !== id)
        : [...prev[name], id],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(coupon ? { ...formData, _id: coupon._id } : formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{coupon ? 'Edit Coupon' : 'Add New Coupon'}</DialogTitle>
        <DialogDescription>
          {coupon
            ? 'Make changes to your coupon here.'
            : 'Create a new coupon to add to your store.'}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="code" className="text-right">
            Code
          </Label>
          <Input
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="discount" className="text-right">
            Discount
          </Label>
          <Input
            id="discount"
            name="discount"
            type="number"
            value={formData.discount}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="type" className="text-right">
            Type
          </Label>
          <Select
            name="type"
            value={formData.type}
            onValueChange={value => handleSelectChange('type', value)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="fixed">Fixed Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="discount" className="text-right">
            Min Amount
          </Label>
          <Input
            id="minAmount"
            name="minAmount"
            type="number"
            value={formData.minAmount}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="discount" className="text-right">
            Max Discount
          </Label>
          <Input
            id="maxDiscount"
            name="maxDiscount"
            type="number"
            value={formData.maxDiscount}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="startDate" className="text-right">
            Start From
          </Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="endDate" className="text-right">
            End Date
          </Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="applicableTo" className="text-right">
            Applicable To
          </Label>
          <Select
            name="applicableTo"
            value={formData.applicableTo}
            onValueChange={value =>
              handleSelectChange(
                'applicableTo',
                value as 'All' | 'Products' | 'Categories'
              )
            }
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select applicability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Products</SelectItem>
              <SelectItem value="Products">Specific Products</SelectItem>
              <SelectItem value="Categories">Specific Categories</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {formData.applicableTo === 'Products' && products && (
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">Products</Label>
            <div className="col-span-3 space-y-2">
              {products.map(product => (
                <div key={product._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`product-${product._id}`}
                    checked={formData.products.includes(product._id)}
                    onCheckedChange={() =>
                      handleCheckboxChange('products', product._id)
                    }
                  />
                  <label htmlFor={`product-${product._id}`}>
                    {product.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
        {formData.applicableTo === 'Categories' && categories && (
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">Categories</Label>
            <div className="col-span-3 space-y-2">
              {categories.map(category => (
                <div key={category._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category._id}`}
                    checked={formData.categories.includes(category._id)}
                    onCheckedChange={() =>
                      handleCheckboxChange('categories', category._id)
                    }
                  />
                  <label htmlFor={`category-${category._id}`}>
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <DialogFooter>
        <Button type="submit">{coupon ? 'Save changes' : 'Add coupon'}</Button>
      </DialogFooter>
    </form>
  );
}

export default CouponForm;
