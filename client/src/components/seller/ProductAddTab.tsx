import React, { useEffect, useState } from 'react';
import { X, Image as ImageIcon, GripVertical } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import AddImageCropper from './addImageCropper';


interface Variant {
  id: string;
  name: string;
  price: string;
  stock: string;
  images: VariantImage[];
}

interface VariantImage {
  id: string;
  file: File;
  preview: string;
}

function SortableImage({ image, onRemove }: { image: VariantImage; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative">
      <img src={image.preview} alt="Product variant" className="w-24 h-24 object-cover rounded-lg" />
      <button
        onMouseDown={onRemove}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 hover:opacity-100 transition-opacity"
      >
        <X size={12} />
      </button>
      <div className="absolute top-1 left-1 cursor-move">
        <GripVertical size={16} className="text-white drop-shadow-lg" />
      </div>
    </div>
  );
}

function ProductAddTab({ variant, index, setValue, register, errors, fields }: { variant: Variant; index: number; setValue: any; register: any; errors: any; fields: any }) { //eslint-disable-line

  const [cropperOpen, setCropperOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState<File[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [currentVariantId, setCurrentVariantId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setCropperOpen(false);
    return () => {
      setCropperOpen(false);
    };
  }, []);

  const handleImageUpload = (variantId: string, files: FileList | null) => {
    if (files) {
      const variant = fields.find((v: any) => v.id === variantId); //eslint-disable-line
      if (variant && variant.images.length + files.length > 6) {
        alert('You can only add up to 6 images per variant.');
        return;
      }
      setCurrentImages(Array.from(files));
      setCurrentImageIndex(0);
      setCurrentVariantId(variantId);
      setCropperOpen(true);
    }
  };


  const removeImage = (variantId: string, imageId: string) => {
    const updatedVariants = fields.map((variant: any) => //eslint-disable-line
      variant.id === variantId
        ? { ...variant, images: variant.images.filter((img: any) => img.id !== imageId) } //eslint-disable-line
        : variant
    );
    setValue('variants', updatedVariants);
  };

  const handleDragEnd = (event: DragEndEvent, variantId: string) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const updatedVariants = fields.map((variant: any) => { //eslint-disable-line
        if (variant.id === variantId) {
          const oldIndex = variant.images.findIndex((img: any) => img.id === active.id); //eslint-disable-line
          const newIndex = variant.images.findIndex((img: any) => img.id === over.id); //eslint-disable-line

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

  return (
    <>
      <TabsContent key={variant.id} value={variant.id}>
        {cropperOpen && currentImages.length > 0 && <AddImageCropper currentImageIndex={currentImageIndex} currentImages={currentImages} currentVariantId={currentVariantId} fields={fields} setCropperOpen={setCropperOpen} setValue={setValue} setCurrentImageIndex={setCurrentImageIndex} setCurrentVariantId={setCurrentVariantId} setCurrentImages={setCurrentImages} />}
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor={`variantName-${variant.id}`}>Variant Name</Label>
              <Input
                id={`variantName-${variant.id}`}
                {...register(`variants.${index}.name`, { required: 'Variant Name is required' })}
              />
              {errors.variants?.[index]?.name && <span className="text-red-500 text-xs">{errors.variants[index].name?.message}</span>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`variantPrice-${variant.id}`}>Price</Label>
                <Input
                  id={`variantPrice-${variant.id}`}
                  type="number"
                  min="1"
                  {...register(`variants.${index}.price`, { required: 'Price is required', min: { value: 1, message: 'Price must be at least 1' } })}
                />
                {errors.variants?.[index]?.price && <span className="text-red-500 text-xs">{errors.variants[index].price?.message}</span>}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`variantStock-${variant.id}`}>Stock</Label>
                <Input
                  id={`variantStock-${variant.id}`}
                  type="number"
                  min="1"
                  {...register(`variants.${index}.stock`, { required: 'Stock is required', min: { value: 1, message: 'Stock must be at least 1' } })}
                />
                {errors.variants?.[index]?.stock && <span className="text-red-500 text-xs">{errors.variants[index].stock?.message}</span>}
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
                <SortableContext items={variant.images} strategy={verticalListSortingStrategy}>
                  <div className="flex mt-">
                    {variant.images.map((image) => (
                      <SortableImage
                        key={image.id}
                        image={image}
                        onRemove={() => removeImage(variant.id, image.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  )
}

export default ProductAddTab;