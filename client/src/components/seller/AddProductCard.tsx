import React, { useState, useCallback, useEffect } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { Plus, X, Image as ImageIcon, GripVertical } from 'lucide-react';
import Cropper, { Point, Area } from 'react-easy-crop';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import productEndpoints from '@/api/productEndpoints';
import categoryEndpoints from '@/api/categoryEndpoints';
import { Category as OriginalCategory, Subcategory } from 'shared/types';

interface Category extends OriginalCategory {
  subcategories: Subcategory[];
}

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

interface FormValues {
  productName: string;
  description: string;
  category: string;
  subcategory: string;
  variants: Variant[];
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      resolve(blob);
    }, 'image/jpeg');
  });
};

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

export default function Component({ onClose }: { onClose: () => void }) {
  const { register, handleSubmit, control, setValue, formState: { errors }, watch } = useForm<FormValues>({
    defaultValues: {
      productName: '',
      description: '',
      category: '',
      variants: [{ id: '1', name: 'Variant 1', price: '', stock: '', images: [] }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants'
  });

  const [activeTab, setActiveTab] = useState(fields[0].id);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategory, setSubcategory] = useState<Subcategory[]>([]);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [currentImage, setCurrentImage] = useState<{ file: File; preview: string } | null>(null);
  const [currentVariantId, setCurrentVariantId] = useState<string | null>(null);

  const category = watch('category');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryEndpoints.getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const selectedCategory = categories.find(cat => cat._id === category);
    if (selectedCategory) {
      const activeSubcategories = selectedCategory.subcategories.filter(subcat => subcat.status !== 'Blocked');
      setSubcategory(activeSubcategories);
    } else {
      setSubcategory([]);
    }
  }, [category, categories]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addVariant = () => {
    if (fields.length >= 6) {
      alert('You can only add up to 6 variants.');
      return;
    }
    const newVariant = { id: Date.now().toString(), name: `Variant ${fields.length + 1}`, price: '', stock: '', images: [] };
    append(newVariant);
    setActiveTab(newVariant.id);
  };

  const removeVariant = (id: string) => {
    if (fields.length > 1) {
      const index = fields.findIndex((variant) => variant.id === id);

      if (activeTab === id) {
        const newIndex = index > 0 ? index - 1 : 1;
        setActiveTab(fields[newIndex].id);
      }

      remove(index);
    }
  };

  const handleImageUpload = (variantId: string, files: FileList | null) => {
    if (files && files.length > 0) {
      const variant = fields.find(v => v.id === variantId);
      if (variant && variant.images.length >= 6) {
        alert('You can only add up to 6 images per variant.');
        return;
      }

      const file = files[0];
      setCurrentImage({ file, preview: URL.createObjectURL(file) });
      setCurrentVariantId(variantId);
      setCropperOpen(true);
    }
  };

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropConfirm = async () => {
    if (croppedAreaPixels && currentImage && currentVariantId) {
      const croppedImageBlob = await getCroppedImg(currentImage.preview, croppedAreaPixels);
      const croppedImageFile = new File([croppedImageBlob], currentImage.file.name, { type: 'image/jpeg' });

      const newImage = {
        id: Date.now().toString(),
        file: croppedImageFile,
        preview: URL.createObjectURL(croppedImageBlob)
      };

      const updatedVariants = fields.map(variant =>
        variant.id === currentVariantId
          ? { ...variant, images: [...variant.images, newImage].slice(0, 6) }
          : variant
      );
      setValue('variants', updatedVariants);

      setCropperOpen(false);
      setCurrentImage(null);
      setCurrentVariantId(null);
    }
  };

  const removeImage = (variantId: string, imageId: string) => {
    const updatedVariants = fields.map(variant =>
      variant.id === variantId
        ? { ...variant, images: variant.images.filter(img => img.id !== imageId) }
        : variant
    );
    setValue('variants', updatedVariants);
  };

  const handleDragEnd = (event: DragEndEvent, variantId: string) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const updatedVariants = fields.map(variant => {
        if (variant.id === variantId) {
          const oldIndex = variant.images.findIndex(img => img.id === active.id);
          const newIndex = variant.images.findIndex(img => img.id === over.id);

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

  const onSubmit: SubmitHandler<FormValues> = async data => {
    try {
      const formData = new FormData();
      formData.append('productName', data.productName);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('subcategory', data.subcategory);

      data.variants.forEach((variant, index) => {
        formData.append(`variants[${index}][name]`, variant.name);
        formData.append(`variants[${index}][price]`, variant.price);
        formData.append(`variants[${index}][stock]`, variant.stock);

        variant.images.forEach((image, imgIndex) => {
          formData.append(`variants[${index}][images][${imgIndex}]`, image.file);
        });
      });

      const response = await productEndpoints.addProduct(formData);

      if (response.status === 201) {
        alert('Product added successfully!');
        onClose();
      } else {
        alert('Failed to add product. Please try again.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {cropperOpen && currentImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white p-4 rounded-lg w-[90vw] max-w-2xl">
            <div className="relative w-full h-[60vh]">
              <Cropper
                image={currentImage.preview}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="mt-4 flex justify-between">
              <Button onClick={() => setCropperOpen(false)} variant="outline">Cancel</Button>
              <Button onClick={handleCropConfirm}>Confirm</Button>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full max-h-[90vh] overflow-y-auto max-w-2xl p-6 bg-white rounded-lg shadow-lg relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-black"
        >
          <X size={25} />
        </button>
        <div className="space-y-2">
          <Label htmlFor="productName">Product Name</Label>
          <Input
            id="productName"
            {...register('productName', { required: 'Product Name is required' })}
          />
          {errors.productName && <span className="text-red-500 text-xs">{errors.productName.message}</span>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description', { required: 'Description is required' })}
          />
          {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            {...register('category', { required: 'Category is required' })}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <span className="text-red-500 text-xs">{errors.category.message}</span>}
        </div>
        {category &&
          <div className="space-y-2">
            <Label htmlFor="subcategory">Subcategory</Label>
            <select
              id="subcategory"
              {...register('subcategory', { required: 'Subcategory is required' })}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Select a subcategory</option>
              {subcategory.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
            {errors.subcategory &&
              <span className="text-red-500 text-xs">{errors.subcategory.message}</span>
            }
          </div>
        }
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <Label>Variants</Label>
          </div>
          <div className="flex space-x-2 overflow-x-auto p-2 items-center justify-center">
            <TabsList className="flex-grow flex ps-14 space-x-2 bg-transparent h-22">
              {fields.map((variant) => (
                <TabsTrigger
                  key={variant.id}
                  value={variant.id}
                  className="relative flex flex-col items-center justify-center rounded-lg border-2 data-[state=active]:border-primary"
                >
                  <span className="text-sm font-medium p-2 py-6">{variant.name}</span>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      asChild
                      size="icon"
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeVariant(variant.id);
                      }}
                    >
                      <X className="h-3 w-3"/>
                    </Button>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            {fields.length < 6 &&
              <Button type="button" onClick={addVariant} size="sm" className="shrink-0 h-24 w-24">
                <Plus className="h-6 w-6" />
              </Button>
            }
          </div>
          {fields.map((variant, index) => (
            <TabsContent key={variant.id} value={variant.id}>
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
                      onDragEnd={(event) => handleDragEnd(event, variant.id)}
                    >
                      <SortableContext items={variant.images} strategy={verticalListSortingStrategy}>
                        <div className="grid grid-cols-4 gap-2 mt-2">
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
          ))}
        </Tabs>
        <Button type="submit" className="w-full">Submit Product</Button>
      </form>
    </div>
  );
}