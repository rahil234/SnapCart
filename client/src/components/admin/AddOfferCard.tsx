import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Offer } from 'shared/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function OfferForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Offer>();

  const validateFutureDate = (value: string) => {
    const date = new Date(value);
    const currentDate = new Date();
    return date >= currentDate || 'Date must be in the future';
  };

  const onSubmit = (data: Offer) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <Input
          id="title"
          {...register('title', {
            required: 'Title is required',
            pattern: {
              value: /^[a-zA-Z0-9\s]+$/,
              message: 'Only alphanumeric characters and spaces are allowed',
            },
          })}
          className="mt-1"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Type */}
      <div>
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700"
        >
          Type
        </label>
        <Select {...register('type', { required: 'Type is required' })}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select Offer Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Percentage">Percentage</SelectItem>
            <SelectItem value="Fixed">Fixed</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <Textarea
          id="description"
          {...register('description', {
            required: 'Description is required',
            pattern: {
              value: /^[a-zA-Z0-9\s.,!?]+$/,
              message:
                'Only alphanumeric characters and punctuation are allowed',
            },
          })}
          className="mt-1"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Discount */}
      <div>
        <label
          htmlFor="discount"
          className="block text-sm font-medium text-gray-700"
        >
          Discount
        </label>
        <Input
          id="discount"
          type="number"
          {...register('discount', {
            required: 'Discount is required',
            min: { value: 0, message: 'Discount must be a positive number' },
            valueAsNumber: true,
          })}
          className="mt-1"
        />
        {errors.discount && (
          <p className="mt-1 text-sm text-red-600">{errors.discount.message}</p>
        )}
      </div>

      {/* Minimum Price */}
      <div>
        <label
          htmlFor="minPrice"
          className="block text-sm font-medium text-gray-700"
        >
          Minimum Price
        </label>
        <Input
          id="minPrice"
          type="number"
          {...register('minPrice', {
            required: 'Minimum price is required',
            min: {
              value: 0,
              message: 'Minimum price must be a positive number',
            },
            valueAsNumber: true,
          })}
          className="mt-1"
        />
        {errors.minPrice && (
          <p className="mt-1 text-sm text-red-600">{errors.minPrice.message}</p>
        )}
      </div>

      {/* Start Date */}
      <div>
        <label
          htmlFor="startDate"
          className="block text-sm font-medium text-gray-700"
        >
          Start Date
        </label>
        <Controller
          name="startDate"
          control={control}
          rules={{ validate: validateFutureDate }}
          render={({ field }) => (
            <DatePicker
              id="startDate"
              selected={field.value ? new Date(field.value) : null}
              onChange={(date: Date | null) => field.onChange(date)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            />
          )}
        />
        {errors.startDate && (
          <p className="mt-1 text-sm text-red-600">
            {errors.startDate.message}
          </p>
        )}
      </div>

      {/* Expiry Date */}
      <div>
        <label
          htmlFor="expiryDate"
          className="block text-sm font-medium text-gray-700"
        >
          Expiry Date
        </label>
        <Controller
          name="expiryDate"
          control={control}
          rules={{ validate: validateFutureDate }}
          render={({ field }) => (
            <DatePicker
              id="expiryDate"
              selected={field.value ? new Date(field.value) : null}
              onChange={(date: Date| null) => field.onChange(date)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            />
          )}
        />
        {errors.expiryDate && (
          <p className="mt-1 text-sm text-red-600">
            {errors.expiryDate.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
}

export default OfferForm;
