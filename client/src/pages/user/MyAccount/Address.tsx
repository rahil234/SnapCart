import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AddressForm from '@/components/user/AddressForm';
import { ProfileFormValues } from '@/pages/user/MyAccount/Profile';
import userEndpoints from '@/api/userEndpoints';
import { catchError, Address } from 'shared/types';

function AddressesSection({
  addresses: initialAddresses,
}: {
  addresses: Address[];
}) {
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

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
      setError((error as catchError).response.data.message);
      console.log(error);
    }
  };

  const handleEditAddress = async (index: number, address: Address) => {
    await userEndpoints.editAddress(fields[index]._id!, address);
    update(index, address);
    setEditingAddressIndex(null);
    setIsAddressDialogOpen(false);
  };

  const handleRemoveAddress = async (index: number) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      await userEndpoints.deleteAddress(fields[index]._id!);
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
              <strong>Pin Code:</strong> {field.pinCode}
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
