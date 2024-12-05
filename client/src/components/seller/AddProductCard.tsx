import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler, FieldErrors } from 'react-hook-form';
import { GripVertical, ImageIcon, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import productEndpoints from '@/api/productEndpoints';
import categoryEndpoints from '@/api/categoryEndpoints';
import {
  Category as OriginalCategory,
  Subcategory,
  VariantImage,
} from 'shared/types';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '../ui/card';
import {
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import AddImageCropper from './addImageCropper';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { AxiosProgressEvent } from 'axios';

interface Category extends OriginalCategory {
  subcategories: Subcategory[];
}

interface Variant {
  id: number;
  variantName: string;
  price: string;
  stock: string;
  images: VariantImage[];
}

interface FormValues {
  productName: string;
  description: string;
  category: string;
  subcategory: string;
  variants: Variant[];
}

function SortableImage({
  image,
  variantId,
  removeVariantImage,
}: {
  image: VariantImage;
  variantId: number;
  removeVariantImage: (variantId: number, id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group"
    >
      <img
        src={image.preview}
        alt="Product variant"
        className="w-24 h-24 object-cover rounded-lg"
      />
      <button
        type="button"
        className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        onMouseDown={() => removeVariantImage(variantId, image.id)}
      >
        <X size={12} />
      </button>
      <div className="absolute top-1 left-1 cursor-move">
        <GripVertical size={16} className="text-white drop-shadow-lg" />
      </div>
    </div>
  );
}

function AddProductCard({ onClose }: { onClose: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>();

  const defaultVariant = {
    id: 0,
    variantName: `Variant 0`,
    price: '',
    stock: '',
    images: [],
  };

  const [variants, setVariants] = useState<Variant[]>([defaultVariant]);
  const [activeTab, setActiveTab] = useState(defaultVariant.id);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategory, setSubcategory] = useState<Subcategory[]>([]);

  const [cropperOpen, setCropperOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState<File[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const category = watch('category');

  useEffect(() => {
    (async () => {
      try {
        const data = await categoryEndpoints.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    })();
  }, []);

  useEffect(() => {
    const selectedCategory = categories.find(cat => cat._id === category);
    if (selectedCategory) {
      const activeSubcategories = selectedCategory.subcategories.filter(
        subcat => subcat.status !== 'Blocked'
      );
      setSubcategory(activeSubcategories);
    } else {
      setSubcategory([]);
    }
  }, [category, categories]);

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

  const pushCroppedImage = (image: VariantImage) => {
    setVariants((prevVariants: Variant[]) =>
      prevVariants.map((v: Variant) =>
        v.id === activeTab
          ? {
              ...v,
              images: [...v.images, { ...image, id: v.images.length }],
            }
          : v
      )
    );
  };

  const closeImageCropper = () => {
    setCropperOpen(false);
  };

  const addVariant = () => {
    if (variants.length >= 6) {
      alert('You can only add up to 6 variants.');
      return;
    }
    const newVariant = {
      id: variants.length,
      variantName: `Variant ${variants.length}`,
      price: '',
      stock: '',
      images: [],
    };
    setVariants(prev => [...prev, newVariant]);
    setActiveTab(newVariant.id);
  };

  const removeVariant = (id: number) => {
    // setActiveTab('0');
    // Update variants state
    setVariants(prevVariants => {
      return prevVariants
        .filter(variant => variant.id !== id)
        .map((variant, index) => ({ ...variant, id: index }));

      // const maxIndex = prevVariants.length;
      // for (let i = 0; i < maxIndex; i++) {
      //   setValue(`variants.${i+1}.name`, '');
      //   setValue(`variants.${i+1}.price`, '');
      //   setValue(`variants.${i+1}.stock`, '');
      //   clearErrors(`variants.${i+1}`);
      // }
    });
  };

  const removeVariantImage = (variantId: number, id: number) => {
    console.log('removeVariantImage', variantId, ' ', id);
    setVariants(prevVariants => {
      return prevVariants.map(variant => {
        if (variant.id === variantId) {
          return {
            ...variant,
            images: variant.images.filter(image => image.id !== id),
          };
        }
        return variant;
      });
    });
  };

  const onSubmit: SubmitHandler<FormValues> = async data => {
    try {
      console.log(data);
      const formData = new FormData();
      formData.append('productName', data.productName);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('subcategory', data.subcategory);

      variants.forEach((_variant, index) => {
        formData.append(
          `variants[${index}][name]`,
          data.variants[index].variantName
        );
        formData.append(
          `variants[${index}][price]`,
          data.variants[index].price
        );
        formData.append(
          `variants[${index}][stock]`,
          data.variants[index].stock
        );
      });
      variants.map((variant, index) => {
        variant.images.forEach((image, imgIndex) => {
          formData.append(
            `variants[${index}][images][${imgIndex}]`,
            image.file
          );
        });
      });

      // formData.forEach((value, key) => {
      //   console.log(key, value);
      // });

      const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.progress) {
          console.log(progressEvent.progress * 100 + '%');
        }
      };

      const response = await productEndpoints.addProduct(
        formData,
        onUploadProgress
      );

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

  function onInvalid(data: FieldErrors): void {
    console.log(data.variants);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="space-y-8 w-full max-h-[90vh] overflow-y-auto max-w-2xl p-6 bg-white rounded-lg shadow-lg relative"
      >
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
            {...register('productName', {
              required: 'Product Name is required',
            })}
          />
          {errors.productName && (
            <span className="text-red-500 text-xs">
              {errors.productName.message}
            </span>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            className="max-h-[250px] h-fit"
            {...register('description', {
              required: 'Description is required',
            })}
          />
          {errors.description && (
            <span className="text-red-500 text-xs">
              {errors.description.message}
            </span>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            {...register('category', { required: 'Category is required' })}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="text-red-500 text-xs">
              {errors.category.message}
            </span>
          )}
        </div>
        {category && (
          <div className="space-y-2">
            <Label htmlFor="subcategory">Subcategory</Label>
            <select
              id="subcategory"
              {...register('subcategory', {
                required: 'Subcategory is required',
              })}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Select a subcategory</option>
              {subcategory.map(subcategory => (
                <option key={subcategory._id} value={subcategory._id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
            {errors.subcategory && (
              <span className="text-red-500 text-xs">
                {errors.subcategory.message}
              </span>
            )}
          </div>
        )}
        <Tabs value={String(activeTab)} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <Label>Variants</Label>
          </div>
          <div className="flex space-x-2 overflow-x-auto p-4 items-center justify-center">
            <TabsList className="flex-grow flex space-x-2 bg-transparent h-22">
              {variants.map(variant => (
                <TabsTrigger
                  key={variant.id}
                  value={String(variant.id)}
                  className="relative flex flex-col items-center justify-center rounded-lg border-2 data-[state=active]:border-primary"
                  onClick={() => {
                    setActiveTab(variant.id);
                  }}
                >
                  <span className="text-sm font-medium">{`Variant ${variant.id}`}</span>
                  {variants.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      asChild
                      size="icon"
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={e => {
                        e.stopPropagation();
                        removeVariant(variant.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            {variants.length < 6 && (
              <Button
                type="button"
                onClick={addVariant}
                size="sm"
                className="shrink-0 h-16 w-16"
              >
                <Plus className="h-6 w-6" />
              </Button>
            )}
          </div>
          {variants.map(variant => (
            <TabsContent value={String(variant.id)} key={variant.id}>
              {cropperOpen && (
                <AddImageCropper
                  currentImages={currentImages}
                  pushCroppedImage={pushCroppedImage}
                  currentImageIndex={currentImageIndex}
                  setCurrentImageIndex={setCurrentImageIndex}
                  currentVariantId={variant.id}
                  onClose={closeImageCropper}
                />
              )}
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor={`variantName-${variant.id}`}>
                      Variant Name
                    </Label>
                    <Input
                      id={`variantName-${variant.id}`}
                      {...register(`variants.${variant.id}.variantName`, {
                        required: 'Variant Name is required',
                      })}
                    />
                    {errors.variants?.[variant.id]?.variantName && (
                      <span className="text-red-500 text-xs">
                        {errors.variants?.[variant.id]?.variantName?.message ??
                          ''}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`variantPrice-${variant.id}`}>
                        Price
                      </Label>
                      <Input
                        id={`variantPrice-${variant.id}`}
                        type="number"
                        min="1"
                        {...register(`variants.${variant.id}.price`, {
                          required: 'Price is required',
                          min: {
                            value: 1,
                            message: 'Price must be at least 1',
                          },
                        })}
                      />
                      {errors.variants?.[variant.id]?.price && (
                        <span className="text-red-500 text-xs">
                          {errors.variants[variant.id]?.price?.message}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`variantStock-${variant.id}`}>
                        Stock
                      </Label>
                      <Input
                        id={`variantStock-${variant.id}`}
                        type="number"
                        min="1"
                        {...register(`variants.${variant.id}.stock`, {
                          required: 'Stock is required',
                          min: {
                            value: 1,
                            message: 'Stock must be at least 1',
                          },
                        })}
                      />
                      {errors.variants?.[variant.id]?.stock && (
                        <span className="text-red-500 text-xs">
                          {errors.variants[variant.id]?.stock?.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Images (Max 6)</Label>
                    <div
                      className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => {
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
                        onChange={e =>
                          handleImageUpload(variant.id, e.target.files)
                        }
                        disabled={variant.images.length >= 6}
                      />
                      <Label
                        htmlFor={`imageUpload-${variant.id}`}
                        className="cursor-pointer"
                      >
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          {variant.images.length < 6
                            ? 'Drop image here or click to upload and crop'
                            : 'Maximum number of images reached'}
                        </span>
                      </Label>
                    </div>
                  </div>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    modifiers={[restrictToParentElement]}
                  >
                    <SortableContext
                      items={variant.images}
                      strategy={horizontalListSortingStrategy}
                    >
                      <div className="grid grid-cols-6 gap-x-1.5">
                        {variant.images.map((image, index) => (
                          <SortableImage
                            key={index}
                            image={image}
                            variantId={variant.id}
                            removeVariantImage={removeVariantImage}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
        <Button type="submit" className="w-full">
          Submit Product
        </Button>
      </form>
    </div>
  );
}

export default AddProductCard;
