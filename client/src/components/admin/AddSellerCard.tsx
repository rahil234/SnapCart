import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import sellerEndpoints from '@/api/sellerEndpoints';
import { catchError } from '@snapcart/shared/types';

interface AddSellerCardProps {
  onClose: () => void;
}

interface FormValues {
  firstName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const AddSellerCard: React.FC<AddSellerCardProps> = ({ onClose }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>();
  const [formError, setFormError] = useState<string | null>(null);

  const handleAddSeller: SubmitHandler<FormValues> = async (data) => {
    try {
      await sellerEndpoints.addSeller(data);
      onClose();
    } catch (error) {
      console.error('Failed to add seller:', (error as catchError).response?.data?.message || (error as catchError).message);
      setFormError('Failed to add seller. Please try again.');
    }
  };

  const password = watch('password');

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg relative w-1/3">
        <button onClick={onClose} className="absolute top-2 right-2">X</button>
        <form onSubmit={handleSubmit(handleAddSeller)} className="space-y-4">
          {formError && <div className="text-red-500 text-sm mb-4">{formError}</div>}
          <div>
            <label>First Name</label>
            <input
              type="text"
              {...register('firstName', { required: 'First Name is required' })}
              className="w-full px-4 py-2 border rounded"
            />
            {errors.firstName && <span className="text-red-500 text-xs">{errors.firstName.message}</span>}
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
              className="w-full px-4 py-2 border rounded"
            />
            {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
              className="w-full px-4 py-2 border rounded"
            />
            {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
          </div>
          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword', {
                required: 'Confirm Password is required',
                validate: value => value === password || 'Passwords do not match'
              })}
              className="w-full px-4 py-2 border rounded"
            />
            {errors.confirmPassword && <span className="text-red-500 text-xs">{errors.confirmPassword.message}</span>}
          </div>
          <Button type="submit" className="w-full">
            Add Seller
          </Button>
          <Button type="button" onClick={onClose} className="w-full">
            Cancel
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddSellerCard;
