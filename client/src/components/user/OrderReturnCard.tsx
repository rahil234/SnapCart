'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { IOrder } from 'shared/types';
import { toast } from 'sonner';
import orderEndpoints from '@/api/orderEndpoints';
import { useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';

interface ReturnFormData {
  orderId: string;
  itemsToReturn: string[];
  returnReason: string;
  description: string;
  preferredSolution: string;
}

const OrderReturnCard = ({
  order,
  onClose,
}: {
  order: IOrder;
  onClose: () => void;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ReturnFormData>({
    defaultValues: {
      orderId: order.orderId,
      itemsToReturn: [],
      returnReason: '',
      description: '',
      preferredSolution: '',
    },
  });

  const queryClient = useQueryClient();

  const onSubmit = async (data: ReturnFormData) => {
    setIsSubmitting(true);
    try {
      await orderEndpoints.submitReturnRequest(data);
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast('Your return request has been successfully submitted.');
      onClose();
    } catch (error) {
      console.error('Error submitting return request:', error);
      toast('Failed to submit return request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleItemSelection = (itemId: string, checked: boolean) => {
    setSelectedItems(prev =>
      checked ? [...prev, itemId] : prev.filter(id => id !== itemId)
    );
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-end">
        <X className="w-8" onClick={()=>onClose()}/>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="order-number">Order Number</Label>
            <Input id="order-number" value={order.orderId} disabled />
          </div>
          <div className="space-y-2">
            <Label>Items to Return</Label>
            <div className="space-y-2">
              {order.items.map(item => (
                <div key={item._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`item-${item._id}`}
                    checked={selectedItems.includes(item._id)}
                    onCheckedChange={checked =>
                      handleItemSelection(item._id, checked as boolean)
                    }
                  />
                  <Label htmlFor={`item-${item._id}`}>
                    {item.name} - Quantity: {item.quantity}
                  </Label>
                </div>
              ))}
            </div>
            {selectedItems.length === 0 && (
              <p className="text-red-500 text-sm">
                Select at least one item to return
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="return-reason">Reason for Return</Label>
            <Select onValueChange={value => setValue('returnReason', value)}>
              <SelectTrigger id="return-reason">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wrong-size">Wrong Size</SelectItem>
                <SelectItem value="defective">Defective Item</SelectItem>
                <SelectItem value="not-as-described">
                  Not as Described
                </SelectItem>
                <SelectItem value="changed-mind">Changed Mind</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.returnReason && (
              <p className="text-red-500 text-sm">
                Please select a reason for return
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="return-description">Description</Label>
            <Textarea
              id="return-description"
              placeholder="Please provide more details about your return"
              rows={3}
              {...register('description', {
                required: 'Description is required',
                minLength: {
                  value: 10,
                  message: 'Description must be at least 10 characters',
                },
              })}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferred-solution">Preferred Solution</Label>
            <Select
              onValueChange={value => setValue('preferredSolution', value)}
            >
              <SelectTrigger id="preferred-solution">
                <SelectValue placeholder="Select a solution" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="refund">Refund</SelectItem>
                <SelectItem value="exchange">Exchange</SelectItem>
                <SelectItem value="store-credit">Store Credit</SelectItem>
              </SelectContent>
            </Select>
            {errors.preferredSolution && (
              <p className="text-red-500 text-sm">
                Please select a preferred solution
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            type="submit"
            disabled={isSubmitting || selectedItems.length === 0}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Return Request'}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
};

export default OrderReturnCard;
