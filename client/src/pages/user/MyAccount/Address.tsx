import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ProfileFormValues } from '@/pages/user/MyAccount/Profile';
import userEndpoints from '@/api/userEndpoints';

export interface Address {
  id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface AddressFormProps {
  onSubmit: (address: Address) => void;
  initialData?: Address;
}

function AddressForm({ onSubmit, initialData }: AddressFormProps) {
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
        <label
          htmlFor="street"
          className="block text-sm font-medium text-gray-700"
        >
          Street
        </label>
        <Input
          id="street"
          {...register('street', { required: 'Street is required' })}
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
          {...register('city', { required: 'City is required' })}
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
          {...register('state', { required: 'State is required' })}
          className="mt-1"
        />
        {errors.state && (
          <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="zipCode"
          className="block text-sm font-medium text-gray-700"
        >
          Zip Code
        </label>
        <Input
          id="zipCode"
          {...register('zipCode', { required: 'Zip Code is required' })}
          className="mt-1"
        />
        {errors.zipCode && (
          <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
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

function AddressesSection({
  addresses: initialAddresses,
}: {
  addresses: Address[];
}) {
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(
    null
  );

  const { control } = useForm<ProfileFormValues>({
    defaultValues: {
      addresses: initialAddresses,
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'addresses',
  });

  const handleAddAddress = async (address: Address) => {
    try {
      await userEndpoints.addAddress(address);
      append(address);
      setIsAddressDialogOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditAddress = (index: number, address: Address) => {
    update(index, address);
    setEditingAddressIndex(null);
    setIsAddressDialogOpen(false);
  };

  const handleRemoveAddress = (index: number) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      remove(index);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Addresses</h2>
      {fields.map((field, index) => (
        <Card key={field.id} className="mb-4">
          <CardContent className="pt-4">
            <p>
              <strong>Street:</strong> {field.street}
            </p>
            <p>
              <strong>City:</strong> {field.city}
            </p>
            <p>
              <strong>State:</strong> {field.state}
            </p>
            <p>
              <strong>Zip Code:</strong> {field.zipCode}
            </p>
            <div className="mt-2 flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingAddressIndex(index);
                  setIsAddressDialogOpen(true);
                }}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveAddress(index)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" className="mt-2">
            <Plus className="w-4 h-4 mr-2" />
            Add Address
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAddressIndex !== null
                ? 'Edit Address'
                : 'Add New Address'}
            </DialogTitle>
          </DialogHeader>
          <AddressForm
            onSubmit={
              editingAddressIndex !== null
                ? address => handleEditAddress(editingAddressIndex, address)
                : handleAddAddress
            }
            initialData={
              editingAddressIndex !== null
                ? fields[editingAddressIndex]
                : undefined
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddressesSection;
