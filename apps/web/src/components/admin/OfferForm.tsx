import React from 'react';
import { toast } from 'sonner';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Offer } from '@/types/offer';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAddOffer } from '@/hooks/offers/use-add-offer.hook';
import { useEditOffer } from '@/hooks/offers/use-edit-offer.hook';

interface OfferFormProps {
  offer?: Offer;
  onClose: () => void;
}

const OfferForm: React.FC<OfferFormProps> = ({ offer, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Offer>({
    defaultValues: offer,
  });

  const addMutation = useAddOffer();
  const editMutation = useEditOffer();

  const onSubmit: SubmitHandler<Offer> = async data => {
    const { error } = await addMutation.mutateAsync(data);
    if (error) {
      toast.error('Failed to save offer. Please try again.');
      return;
    }
    toast.success('Offer saved successfully!');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Offer Name</Label>
        <Input
          id="name"
          {...register('name', { required: 'Offer name is required' })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="discount">Discount (%)</Label>
        <Input
          id="discount"
          type="number"
          {...register('discount', {
            required: 'Discount is required',
            valueAsNumber: true,
          })}
        />
        {errors.discount && (
          <p className="text-red-500 text-sm">{errors.discount.message}</p>
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
      <div>
        <Label htmlFor="startDate">Start Date</Label>
        <Input
          id="startDate"
          type="date"
          {...register('startDate', { required: 'Start date is required' })}
        />
        {errors.startDate && (
          <p className="text-red-500 text-sm">{errors.startDate.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="expiryDate">End Date</Label>
        <Input
          id="expiryDate"
          type="date"
          {...register('endDate', { required: 'End date is required' })}
        />
        {errors.endDate && (
          <p className="text-red-500 text-sm">{errors.endDate.message}</p>
        )}
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={addMutation.isPending || editMutation.isPending}
        >
          {addMutation.isPending || editMutation.isPending
            ? 'Saving...'
            : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default OfferForm;
