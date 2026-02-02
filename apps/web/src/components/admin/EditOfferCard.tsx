import { toast } from 'sonner';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { IOffer } from '@/types/offer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { OfferService } from '@/services/offer.service';

function EditOfferCard({
  offer,
  onClose,
}: {
  offer: IOffer;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IOffer>({
    defaultValues: offer,
  });

  const queryClient = useQueryClient();

  console.log(offer);

  useEffect(() => {
    const expiryDate = offer.expiryDate
      .toString()
      .split('T')[0] as unknown as Date;
    const startDate = offer.startDate
      .toString()
      .split('T')[0] as unknown as Date;
    setValue('startDate', startDate);
    setValue('expiryDate', expiryDate);
    setValue('type', offer.type);
  }, []);

  const editOfferMutation = useMutation({
    mutationFn: (updatedOffer: IOffer) =>
      OfferService.updateOffer(offer._id, updatedOffer),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-offers'] });
      onClose();
      toast.success('Offer updated successfully');
    },
    onError: () => toast.error('Failed to update offer'),
  });

  const onSubmit = (data: IOffer) => {
    editOfferMutation.mutate(data);
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

        {/* max Discount Field */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="maxDiscount" className="text-right">
            Max Discount(%)
          </Label>
          <Input
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
            min={new Date(offer.startDate).toISOString().split('T')[0]}
            max={watch('expiryDate') as unknown as string}
            className="col-span-3"
            {...register('startDate', {
              required: 'Start date is required',
              validate: value =>
                // @ts-expect-error the value is a string
                value >=
                  new Date(offer.startDate).toISOString().split('T')[0] ||
                'Start date must be in the future',
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
          <Label htmlFor="expiryDate" className="text-right">
            Expiry Date
          </Label>
          <Input
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
        {/* Type Field */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">
            Status
          </Label>
          <select
            className="border outline-black border-gray-400 rounded-md p-2 col-span-3"
            {...register('status')}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {errors.status && (
            <span className="text-red-500 text-xs col-span-4 justify-self-end">
              {errors.status.message}
            </span>
          )}
        </div>
        <div className="flex justify-end">
          <Button type="submit">Update Coupon</Button>
        </div>
      </div>
    </form>
  );
}

export default EditOfferCard;
