import React from 'react';
import { Offer, Product, Category } from 'shared/types';
import { useForm } from 'react-hook-form';
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
import { Button } from '@/components/ui/button';

interface OfferFormProps {
  offer?: Offer;
  onSubmit: (offer: Offer | Omit<Offer, 'id'>) => void;
  products?: Product[];
  categories?: Category[];
}

function EditOfferCard({
  offer,
  onSubmit,
  products,
  categories,
}: OfferFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Omit<Offer, 'id'>>({
    defaultValues: {
      title: offer?.title || '',
      discount: offer?.discount || 0,
      startDate: offer?.startDate
        ? new Date(offer.startDate).toISOString().split('T')[0]
        : '',
      expiryDate: offer?.expiryDate
        ? new Date(offer.expiryDate).toISOString().split('T')[0]
        : '',
      status: offer?.status || 'Inactive',
      products: offer?.products || [],
      categories: offer?.categories || [],
    },
  });

  const watchProducts = watch('products');
  const watchCategories = watch('categories');

  const onSubmitForm = (data: Omit<Offer, 'id'>) => {
    onSubmit(offer ? { ...data, _id: offer._id } : data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <DialogHeader>
        <DialogTitle>{offer ? 'Edit Offer' : 'Add New Offer'}</DialogTitle>
        <DialogDescription>
          {offer
            ? 'Make changes to your offer here.'
            : 'Create a new offer to add to your store.'}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Title
          </Label>
          <Input
            id="title"
            className="col-span-3"
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="discount" className="text-right">
            Discount (%)
          </Label>
          <Input
            id="discount"
            type="number"
            className="col-span-3"
            {...register('discount', {
              required: 'Discount is required',
              min: { value: 0, message: 'Discount must be at least 0' },
              max: { value: 100, message: 'Discount must be at most 100' },
            })}
          />
          {errors.discount && (
            <p className="text-red-500 text-sm">{errors.discount.message}</p>
          )}
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="startDate" className="text-right">
            Start Date
          </Label>
          <Input
            id="startDate"
            type="date"
            className="col-span-3"
            {...register('startDate', { required: 'Start date is required' })}
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm">{errors.startDate.message}</p>
          )}
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="expiryDate" className="text-right">
            End Date
          </Label>
          <Input
            id="expiryDate"
            type="date"
            className="col-span-3"
            {...register('expiryDate', { required: 'End date is required' })}
          />
          {errors.expiryDate && (
            <p className="text-red-500 text-sm">{errors.expiryDate.message}</p>
          )}
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">
            Status
          </Label>
          <Select
            onValueChange={(value: 'Active' | 'Inactive') =>
              setValue('status', value)
            }
            defaultValue={offer?.status}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="products" className="text-right">
            Products
          </Label>
          <Select
            onValueChange={value =>
              setValue('products', [...watchProducts, value])
            }
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select products" />
            </SelectTrigger>
            <SelectContent>
              {products?.map(product => (
                <SelectItem key={product._id} value={product._id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="categories" className="text-right">
            Categories
          </Label>
          <Select
            onValueChange={value =>
              setValue('categories', [...watchCategories, value])
            }
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select categories" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map(category => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">{offer ? 'Save changes' : 'Add offer'}</Button>
      </DialogFooter>
    </form>
  );
}

export default EditOfferCard;
