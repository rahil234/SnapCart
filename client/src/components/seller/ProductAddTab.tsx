import React, { useState } from 'react';
import { X, Image as ImageIcon, GripVertical } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import AddImageCropper from './addImageCropper';
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { Variant, VariantImage } from 'shared/types';


interface FormValues {
  productName: string;
  description: string;
  category: string;
  subcategory: string;
  variants: Variant[];
}

function SortableImage({ image, onRemove }: { image: VariantImage; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative group">
      <img src={image.preview} alt="Product variant" className="w-24 h-24 object-cover rounded-lg" />
      <button
        onClick={onRemove}
        type='button'
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X size={12} />
      </button>
      <div className="absolute top-1 left-1 cursor-move">
        <GripVertical size={16} className="text-white drop-shadow-lg" />
      </div>
    </div>
  );
}

function ProductAddTab({ variant, setVariants, setValue, register,  errors, variants }: { variant: Variant; activeTab?: number; setVariants: React.Dispatch<React.SetStateAction<Variant[]>>; setValue: UseFormSetValue<FormValues>; register: UseFormRegister<FormValues>; errors: FieldErrors<FormValues>; variants: Variant[]; }) {
  const [cropperOpen, setCropperOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState<File[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  // const [croppedImages, setCroppedImages] = useState<VariantImage[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );


  const pushCroppedImage = (image: VariantImage) => {
    setVariants((prevVariants: Variant[]) => prevVariants.map((v: Variant) => v.id === variant.id ? { ...variant, images: [...variant.images, image] } : v));
  };

  const closeImageCropper = () => {
    setCropperOpen(false);
    // setCurrentImages([]);
  };

  const handleImageUpload = (variantId: number, files: FileList | null) => {
    if (files) {
      const variant = variants.find((v: Variant) => v.id === variantId);
      if (variant && variant.images.length + files.length > 6) {
        alert('You can only add up to 6 images per variant.');
        return;
      }
      setCurrentImages(Array.from(files));
      setCurrentImageIndex(0);
      setCropperOpen(true);
    }
  };


  const removeImage = (variantId: number, imageId: number) => {
    const updatedVariants = variants.map((variant: Variant) =>
      variant.id === variantId
        ? { ...variant, images: variant.images.filter((img: VariantImage) => img.id !== imageId) }
        : variant
    );
    setValue('variants', updatedVariants);
  };

  const handleDragEnd = (event: DragEndEvent, variantId: number) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const updatedVariants = variants.map((variant: Variant) => {
        if (variant.id === variantId) {
          const oldIndex = variant.images.findIndex((img: VariantImage) => img.id === active.id);
          const newIndex = variant.images.findIndex((img: VariantImage) => img.id === over.id);

          const newImages = [...variant.images];
          const [reorderedItem] = newImages.splice(oldIndex, 1);
          newImages.splice(newIndex, 0, reorderedItem);

          return { ...variant, images: newImages };
        }
        return variant;
      });
      setValue('variants', updatedVariants);
    }
  };

  // console.log('variant', variant);

  return (
    <TabsContent value={String(variant.id)}>
      {/* {cropperOpen && currentImages.length > 0 && <AddImageCropper currentImages={currentImages} pushCroppedImage={pushCroppedImage} currentImageIndex={currentImageIndex} setCurrentImageIndex={setCurrentImageIndex} currentVariantId={variant.id} onClose={closeImageCropper} />} */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor={`variantName-${variant.id}`}>Variant Name</Label>
            <Input
              id={`variantName-${variant.id}`}
              {...register(`variants.${variant.id}.name`, { required: 'Variant Name is required' })}
            />
            {errors.variants?.[variant.id]?.name && <span className="text-red-500 text-xs">{errors.variants?.[variant.id]?.name?.message ?? ''}</span>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`variantPrice-${variant.id}`}>Price</Label>
              <Input
                id={`variantPrice-${variant.id}`}
                type="number"
                min="1"
                {...register(`variants.${variant.id}.price`, { required: 'Price is required', min: { value: 1, message: 'Price must be at least 1' } })}
              />
              {errors.variants?.[variant.id]?.price && <span className="text-red-500 text-xs">{errors.variants[variant.id]?.price?.message}</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`variantStock-${variant.id}`}>Stock</Label>
              <Input
                id={`variantStock-${variant.id}`}
                type="number"
                min="1"
                {...register(`variants.${variant.id}.stock`, { required: 'Stock is required', min: { value: 1, message: 'Stock must be at least 1' } })}
              />
              {errors.variants?.[variant.id]?.stock && <span className="text-red-500 text-xs">{errors.variants[variant.id]?.stock?.message}</span>}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Images (Max 6)</Label>
            <div
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleImageUpload(variant.id, e.dataTransfer.files);
              }}
            >
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                multiple
                id={`imageUpload-${variant.id}`}
                onChange={(e) => handleImageUpload(variant.id, e.target.files)}
                disabled={variant.images.length >= 6}
              />
              <Label htmlFor={`imageUpload-${variant.id}`} className="cursor-pointer">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  {variant.images.length < 6
                    ? "Drop image here or click to upload and crop"
                    : "Maximum number of images reached"}
                </span>
              </Label>
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToParentElement]}
              onDragEnd={(event) => handleDragEnd(event, variant.id)}
            >
              <SortableContext items={variant.images} strategy={horizontalListSortingStrategy}>
                <div className='grid grid-cols-6'>
                  {variant.images.map((image, index) => (
                    <SortableImage
                      key={index}
                      image={image}
                      onRemove={() => removeImage(variant.id, image.id)}
                    />
                  )
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}

export default ProductAddTab;