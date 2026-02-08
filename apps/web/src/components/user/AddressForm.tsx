import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Address } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AddressFormProps {
  onSubmit: (address: Address) => void;
  initialData?: Address;
  error?: string | null;
}

function AddressForm({ onSubmit, initialData, error }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Address>({
    defaultValues: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      houseNo: '',
      country: '',
    },
  });

  // ✅ Rehydrate form safely when editing
  useEffect(() => {
    if (initialData) {
      reset({
        street: initialData.street ?? '',
        city: initialData.city ?? '',
        state: initialData.state ?? '',
        pincode: initialData.pincode ?? '',
        houseNo: initialData.houseNo ?? '',
        country: initialData.country ?? '',
      });
    } else {
      reset({
        street: '',
        city: '',
        state: '',
        pincode: '',
        houseNo: '',
        country: '',
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}

      {/* Street */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Street
        </label>
        <Input
          {...register('street', {
            required: 'Street is required',
            validate: value =>
              value?.trim() !== '' || 'Street must not be empty',
          })}
        />
        {errors.street && (
          <p className="text-sm text-red-600">{errors.street.message}</p>
        )}
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-medium text-gray-700">City</label>
        <Input
          {...register('city', {
            required: 'City is required',
            pattern: {
              value: /^[a-zA-Z\s,]+$/,
              message: 'City can contain only letters, spaces, and commas',
            },
          })}
        />
        {errors.city && (
          <p className="text-sm text-red-600">{errors.city.message}</p>
        )}
      </div>

      {/* State */}
      <div>
        <label className="block text-sm font-medium text-gray-700">State</label>
        <Input
          {...register('state', {
            required: 'State is required',
            pattern: {
              value: /^[a-zA-Z\s,]+$/,
              message: 'State can contain only letters, spaces, and commas',
            },
          })}
        />
        {errors.state && (
          <p className="text-sm text-red-600">{errors.state.message}</p>
        )}
      </div>

      {/* Pin Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Pin Code
        </label>
        <Input
          {...register('pincode', {
            required: 'Pin Code is required',
            minLength: {
              value: 6,
              message: 'Pin Code must be exactly 6 digits',
            },
            maxLength: {
              value: 6,
              message: 'Pin Code must be exactly 6 digits',
            },
            pattern: {
              value: /^\d{6}$/,
              message: 'Pin Code must be exactly 6 digits',
            },
          })}
        />
        {errors.pincode && (
          <p className="text-sm text-red-600">{errors.pincode.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full">
        {initialData ? 'Update Address' : 'Add Address'}
      </Button>
    </form>
  );
}

export default AddressForm;
