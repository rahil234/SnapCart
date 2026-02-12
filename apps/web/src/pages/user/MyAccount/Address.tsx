import React, { useEffect, useState } from 'react';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Address } from '@/types/address';
import { catchError } from '@/types/error';
import { Button } from '@/components/ui/button';
import AddressForm from '@/components/user/AddressForm';
import { Card, CardContent } from '@/components/ui/card';
import { AddressService } from '@/services/address.service';
import { ProfileFormValues } from '@/pages/user/MyAccount/Profile';
import { useGetAddresses } from '@/hooks/addresses/useGetAddresses';

function AddressesSection() {
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const { data: addresses, isLoading, isError } = useGetAddresses();

  const { control, reset } = useForm<ProfileFormValues>({
    defaultValues: {
      addresses: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'addresses',
    keyName: 'fieldId',
  });

  useEffect(() => {
    if (addresses) {
      reset({ addresses });
    }
  }, [addresses, reset]);

  const handleAddAddress = async (address: Address) => {
    try {
      await AddressService.addAddress(address);
      append(address);
      setIsAddressDialogOpen(false);
    } catch (error) {
      setError((error as catchError).response.data.message);
      console.log(error);
    }
  };

  const handleEditAddress = async (index: number, address: Address) => {
    const { data, error } = await AddressService.updateAddress(
      fields[index].id,
      address
    );

    if (error) {
      setError(error.response.data.message);
      return;
    }

    update(index, data);
    setEditingAddressIndex(null);
    setIsAddressDialogOpen(false);
  };

  const handleRemoveAddress = async (index: number) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      await AddressService.deleteAddress(fields[index].id);
      remove(index);
    }
  };

  if (isLoading) {
    return <p>Loading addresses...</p>;
  }

  if (isError) {
    return <p>Error loading addresses. Please try again later.</p>;
  }

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
              <strong>Pin Code:</strong> {field.pincode}
            </p>
            <div className="mt-2 flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingAddressIndex(index);
                  setError(null);
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
          <Button
            type="button"
            variant="outline"
            className="mt-2"
            onClick={() => setError(null)}
          >
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
            error={error}
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
