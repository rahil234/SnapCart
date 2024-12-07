import React from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IOffer } from 'shared/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import offerEndpoints from '@/api/offerEndpoints';
import { Label } from '@/components/ui/label';

function AddOfferCard({ onClose }: { onClose: () => void }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IOffer>();

  const queryClient = useQueryClient();

  const addOfferMutation = useMutation({
    mutationFn: offerEndpoints.addOffer,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-offers'] });
      toast.success('Coupon added successfully');
      onClose();
    },
    onError: () => toast.error('Failed to add coupon'),
  });

  const onSubmit = (data: IOffer) => {
    addOfferMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="code" className="text-right">
            Title
          </Label>
          <Input
            className="col-span-3"
            {...register('title', {
              required: 'Title is required',
              maxLength: {
                value: 10,
                message: 'Title is too long (max 10 characters)',
              },
              pattern: {
                value: /^[a-zA-Z0-9\s]+$/,
                message: 'Only alphanumeric characters and spaces are allowed',
              },
            })}
          />
          {errors.title && (
            <span className="text-red-500 text-xs col-span-4 justify-self-end">
              {errors.title.message}
            </span>
          )}
        </div>

        {/* Type Field */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="type" className="text-right">
            Discount Type
          </Label>
          <select
            className="border outline-black border-gray-400 rounded-md p-2 col-span-3"
            {...register('type', {
              required: 'Type is required ',
            })}
          >
            <option value="">Select Offer Type</option>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
          {errors.type && (
            <span className="text-red-500 text-xs col-span-4 justify-self-end">
              {errors.type.message}
            </span>
          )}
        </div>

        {/* Discount Field */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="discount" className="text-right">
            Discount
          </Label>
          <Input
            id="discount"
            type="number"
            className="col-span-3"
            {...register('discount', {
              required: 'Discount is required',
              min: { value: 1, message: 'Discount must be at least 1' },
            })}
          />
          {errors.discount && (
            <span className="text-red-500 text-xs col-span-4 justify-self-end">
              {errors.discount.message}
            </span>
          )}
        </div>

        {/* Min Amount Field */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="maxDiscount" className="text-right">
            Max Discount(%)
          </Label>
          <Input
            id="maxDiscount"
            type="number"
            className="col-span-3"
            {...register('maxDiscount', {
              required: 'Maximum amount is required',
              min: { value: 1, message: 'Max Discount must be at least 1' },
              max: { value: 100, message: 'Max Discount must be at most 100' },
            })}
          />
          {errors.maxDiscount && (
            <span className="text-red-500 text-xs col-span-4 justify-self-end">
              {errors.maxDiscount.message}
            </span>
          )}
        </div>

        {/* Limit Field */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="limit" className="text-right">
            Limit
          </Label>
          <Input
            type="number"
            className="col-span-3"
            {...register('limit', {
              required: 'Limit is required',
              min: { value: 1, message: 'Limit must be at least 1' },
              max: { value: 100, message: 'Limit must be at most 100' },
            })}
          />
          {errors.limit && (
            <span className="text-red-500 text-xs col-span-4 justify-self-end">
              {errors.limit.message}
            </span>
          )}
        </div>

        {/* Start Date Field */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="startDate" className="text-right">
            Start From
          </Label>
          <Input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            max={watch('expiryDate') as unknown as string}
            className="col-span-3"
            {...register('startDate', {
              required: 'Start date is required',
              validate: value =>
                // @ts-expect-error the value is a string
                value >= new Date().toISOString().split('T')[0] ||
                'Start date must be after today',
            })}
          />
          {errors.startDate && (
            <span className="text-red-500 text-xs col-span-4 justify-self-end">
              {errors.startDate.message}
            </span>
          )}
        </div>
        {/* End Date Field */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="endDate" className="text-right">
            End Date
          </Label>
          <Input
            id="endDate"
            type="date"
            min={watch('startDate') as unknown as string}
            className="col-span-3"
            {...register('expiryDate', {
              required: 'End date is required',
              validate: value =>
                value > watch('startDate') ||
                'End date must be after start date',
            })}
          />
          {errors.expiryDate && (
            <span className="text-red-500 text-xs col-span-4 justify-self-end">
              {errors.expiryDate.message}
            </span>
          )}
        </div>
        <div className="flex justify-end">
          <Button type="submit">Add Coupon</Button>
        </div>
      </div>
    </form>
  );
}

export default AddOfferCard;
