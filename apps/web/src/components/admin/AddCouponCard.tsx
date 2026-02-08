import React from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';

import { Coupon } from '@/types/coupon';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAddCoupon } from '@/hooks/coupons/use-add-coupon.hook';

const AddCouponCard = ({ onClose }: { onClose: () => void }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Coupon>();

  const { mutateAsync } = useAddCoupon();

  const onSubmit = async (data: Coupon) => {
    console.log(data);
    const { error } = await mutateAsync(data);
    if (error) {
      toast.error(error.message || 'Failed to add coupon');
      return;
    }
    onClose();
  };

  const codeValue = watch('code');

  React.useEffect(() => {
    if (codeValue) {
      setValue('code', codeValue.toUpperCase(), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [codeValue, setValue]);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-h-[70vh] overflow-y-auto"
    >
      <div className="grid gap-4 py-4">
        {/* Code Field */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="code" className="text-right">
            Code
          </Label>
          <Input
            id="code"
            className="col-span-3"
            {...register('code', {
              required: 'Code is required',
              maxLength: {
                value: 10,
                message: 'Code is too long (max 10 characters)',
              },
            })}
          />
          {errors.code && (
            <span className="text-red-500 text-xs col-span-4 justify-self-end">
              {errors.code.message}
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
              valueAsNumber: true,
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
        {/* Type Field */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="type" className="text-right">
            Type
          </Label>
          <select
            className="border outline-black border-gray-400 rounded-md p-2 col-span-3"
            {...register('type', {
              required: 'Type is required ',
            })}
          >
            <option>Select Offer Type</option>
            <option value="Percentage">Percentage</option>
            <option value="Flat">Flat Amount</option>
          </select>
          {errors.type && (
            <span className="text-red-500 text-xs col-span-4 justify-self-end">
              {errors.type.message}
            </span>
          )}
        </div>
        {/* Min Amount Field */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="minAmount" className="text-right">
            Min Amount
          </Label>
          <Input
            id="minAmount"
            type="number"
            className="col-span-3"
            {...register('minAmount', {
              required: 'Minimum amount is required',
              min: { value: 1, message: 'Minimum amount must be at least 1' },
            })}
          />
          {errors.minAmount && (
            <span className="text-red-500 text-xs col-span-4 justify-self-end">
              {errors.minAmount.message}
            </span>
          )}
        </div>
        {/* Max Discount Field */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="maxDiscount" className="text-right">
            Max Discount
          </Label>
          <Input
            id="maxDiscount"
            type="number"
            className="col-span-3"
            {...register('maxDiscount', {
              required: 'Maximum discount is required',
              min: { value: 1, message: 'Maximum discount must be at least 1' },
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
            Usage Limit
          </Label>
          <Input
            type="number"
            className="col-span-3"
            {...register('usageLimit', {
              required: 'limit is required',
              min: { value: 1, message: 'Limit must be at least 1' },
            })}
          />
          {errors.usageLimit && (
            <span className="text-red-500 text-xs col-span-4 justify-self-end">
              {errors.usageLimit.message}
            </span>
          )}
        </div>

        {/* Start Date Field */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="startDate" className="text-right">
            Start From
          </Label>
          <Input
            id="startDate"
            type="date"
            min={new Date().toISOString().split('T')[0]}
            max={watch('endDate') as unknown as string}
            className="col-span-3"
            {...register('startDate', {
              required: 'Start date is required',
              validate: value =>
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
            {...register('endDate', {
              required: 'End date is required',
              validate: value =>
                value > watch('startDate') ||
                'End date must be after start date',
            })}
          />
          {errors.endDate && (
            <span className="text-red-500 text-xs col-span-4 justify-self-end">
              {errors.endDate.message}
            </span>
          )}
        </div>
        {/* Applicable To Field */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="applicableTo" className="text-right">
            Applicable To
          </Label>
          <select
            className="border outline-black border-gray-400 rounded-md p-2 col-span-3"
            {...register('applicableTo', {
              required: 'Applicability is required',
            })}
          >
            <option>Select</option>
            <option value="all">All</option>
            <option value="specific_products">Specific Products</option>
            <option value="specific_categories">Specific Categories</option>
          </select>
          {errors.applicableTo && (
            <span className="text-red-500 text-xs col-span-4 justify-self-end">
              {errors.applicableTo.message}
            </span>
          )}
        </div>
        <div className="flex justify-end">
          <Button type="submit">Add Coupon</Button>
        </div>
      </div>
    </form>
  );
};

export default AddCouponCard;
