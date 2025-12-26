import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React from 'react';
import { Address } from '@snapcart/shared/types';

interface AddressFormProps {
  onSubmit: (address: Address) => void;
  initialData?: Address;
  error?: string | null;
}

function AddressForm({ onSubmit, initialData, error }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Address>({
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        {error && <p className="text-red-600">{error}</p>}
        <label
          htmlFor="street"
          className="block text-sm font-medium text-gray-700"
        >
          Street
        </label>
        <Input
          id="street"
          {...register('street', {
            required: 'Street is required',
            validate: {
              notEmpty: value => {
                const trimmedValue = value.trim();
                return (
                  trimmedValue !== '' ||
                  'Street must not be empty or just spaces'
                );
              },
              validCharacters: value => {
                const trimmedValue = value.trim();
                return (
                  /^[a-zA-Z0-9\s,]*$/.test(trimmedValue) ||
                  'Street must only contain letters, digits, spaces, and commas'
                );
              },
            },
          })}
          className="mt-1"
        />
        {errors.street && (
          <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="city"
          className="block text-sm font-medium text-gray-700"
        >
          City
        </label>
        <Input
          id="city"
          {...register('city', {
            required: 'City is required',
            validate: {
              notEmpty: value => {
                const trimmedValue = value.trim();
                return (
                  trimmedValue !== '' || 'City must not be empty or just spaces'
                );
              },
              validCharacters: value => {
                const trimmedValue = value.trim();
                return (
                  /^[a-zA-Z0-9\s,]*$/.test(trimmedValue) ||
                  'City must only contain letters, digits, spaces, and commas'
                );
              },
            },
          })}
          className="mt-1"
        />
        {errors.city && (
          <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="state"
          className="block text-sm font-medium text-gray-700"
        >
          State
        </label>
        <Input
          id="state"
          {...register('state', {
            required: 'State is required',
            validate: {
              notEmpty: value => {
                const trimmedValue = value.trim();
                return (
                  trimmedValue !== '' ||
                  'State must not be empty or just spaces'
                );
              },
              validCharacters: value => {
                const trimmedValue = value.trim();
                return (
                  /^[a-zA-Z0-9\s,]*$/.test(trimmedValue) ||
                  'State must only contain letters, digits, spaces, and commas'
                );
              },
            },
          })}
          className="mt-1"
        />
        {errors.state && (
          <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="pinCode"
          className="block text-sm font-medium text-gray-700"
        >
          Pin Code
        </label>
        <Input
          id="pinCode"
          {...register('pinCode', {
            required: 'Pin Code is required',
            minLength: { value: 6, message: 'Pin Code must be 6 digits' },
            maxLength: { value: 6, message: 'Pin Code must be 6 digits' },
            validate: {
              a: value =>
                /^\d{6}$/.test(value) || 'Pin Code must only contain digits',
            },
          })}
          className="mt-1"
        />
        {errors.pinCode && (
          <p className="mt-1 text-sm text-red-600">{errors.pinCode.message}</p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full"
        onClick={e => e.stopPropagation()}
      >
        {initialData ? 'Update Address' : 'Add Address'}
      </Button>
    </form>
  );
}

export default AddressForm;
