import React from 'react';
import { toast } from 'sonner';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { IOffer } from '@/types/offer';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { OfferService } from '@/api/offer/offer.service';

interface OfferFormProps {
  offer?: IOffer;
  onClose: () => void;
}

const OfferForm: React.FC<OfferFormProps> = ({ offer, onClose }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IOffer>({
    defaultValues: offer || {},
  });

  const mutation = useMutation({
    mutationFn: (data: IOffer) => {
      return offer
        ? OfferService.updateOffer(offer._id, data)
        : OfferService.addOffer(data);
    },
    onSuccess: () => {
      toast.success(offer ? 'Offer updated' : 'Offer added');
      queryClient.invalidateQueries({ queryKey: ['admin-offers'] });
      onClose();
    },
    onError: () => {
      toast.error('An error occurred');
    },
  });

  const onSubmit: SubmitHandler<IOffer> = data => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Offer Name</Label>
        <Input
          id="title"
          {...register('title', { required: 'Offer name is required' })}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
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
          {...register('expiryDate', { required: 'End date is required' })}
        />
        {errors.expiryDate && (
          <p className="text-red-500 text-sm">{errors.expiryDate.message}</p>
        )}
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default OfferForm;
