import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAddCategory } from '@/hooks/category.hooks';

type AddCategoryFormInputs = {
  name: string;
};

type AddCategoryCardProps = {
  open: boolean;
  onClose: () => void;
};

const AddCategoryCard: React.FC<AddCategoryCardProps> = ({ open, onClose }) => {
  const [serverError, setServerError] = useState<string | null>(null);

  const addCategoryMutation = useAddCategory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddCategoryFormInputs>();

  const onSubmit: SubmitHandler<AddCategoryFormInputs> = async data => {
    setServerError(null);

    const { error } = await addCategoryMutation.mutateAsync(data);

    if (error) {
      setServerError(error.message || 'Failed to add category');
      return;
    }

    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <p className="text-sm text-red-600 text-center">{serverError}</p>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Category name</Label>
            <Input
              id="name"
              placeholder="e.g. Vegetables"
              {...register('name', {
                required: 'Category name is required',
                minLength: {
                  value: 2,
                  message: 'Category name must be at least 2 characters',
                },
              })}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Category'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryCard;
