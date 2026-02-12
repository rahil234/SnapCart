import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { toast } from 'sonner';
import React, { useState } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useForm } from 'react-hook-form';
import { GripVertical, ImageIcon, Plus, Trash2, X } from 'lucide-react';

import { ProductWithVariants } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ProductService } from '@/services/product.service';
import AddImageCropper from '@/components/seller/addImageCropper';
import { uploadImageToProvider } from '@/utils/upload-image-to-provider';
import { ProductVariantService } from '@/services/product-variant.service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

interface EditableVariantImage {
  id: string;
  preview: string;
  file?: File;
}

interface EditableProductVariant {
  uiId: string;
  backendId?: string;
  variantName: string;
  price: number;
  stock: number;
  images: EditableVariantImage[];
}

/* -------------------------------------------------------------------------- */
/*                             SORTABLE IMAGE                                  */
/* -------------------------------------------------------------------------- */

function SortableImage({
  image,
  onRemove,
}: {
  image: EditableVariantImage;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
      className="relative group"
    >
      <img
        src={image.preview}
        alt="Variant image"
        className="w-24 h-24 object-cover rounded-lg"
      />
      <button
        type="button"
        className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
        onMouseDown={onRemove}
      >
        <X size={12} />
      </button>
      <div className="absolute top-1 left-1 cursor-move">
        <GripVertical size={16} className="text-white drop-shadow" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                 */
/* -------------------------------------------------------------------------- */

export default function EditProductModal({
  onClose,
  product,
}: {
  onClose: () => void;
  product: ProductWithVariants;
}) {
  /* ----------------------------- PRODUCT FORM ----------------------------- */

  const productForm = useForm({
    defaultValues: {
      name: product.name,
      description: product.description,
    },
  });

  /* ----------------------------- VARIANT STATE ----------------------------- */

  const [variants, setVariants] = useState<EditableProductVariant[]>(
    product.variants.map(v => ({
      uiId: crypto.randomUUID(),
      backendId: v.id,
      variantName: v.variantName,
      price: v.price,
      stock: v.stock,
      images: v.images.map(url => ({
        id: crypto.randomUUID(),
        preview: url,
      })),
    }))
  );

  const [activeTab, setActiveTab] = useState<string | undefined>(
    variants[0]?.uiId
  );

  /* ----------------------------- IMAGE CROP ----------------------------- */

  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropFiles, setCropFiles] = useState<File[]>([]);
  const [cropIndex, setCropIndex] = useState(0);
  const [cropVariantUiId, setCropVariantUiId] = useState<string | null>(null);

  /* ----------------------------- DND ----------------------------- */

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /* ----------------------------- PRODUCT SAVE ----------------------------- */

  const saveProduct = async () => {
    try {
      const values = productForm.getValues();
      await ProductService.updateProduct(product.id, {
        name: values.name,
        description: values.description,
      });
      toast.success('Product updated');
    } catch {
      toast.error('Failed to update product');
    }
  };

  /* ----------------------------- VARIANT SAVE ----------------------------- */

  const saveVariant = async (variant: EditableProductVariant) => {
    try {
      if (!variant.backendId) {
        const { data: created, error } =
          await ProductVariantService.createVariant(product.id, {
            variantName: variant.variantName,
            price: variant.price,
            stock: variant.stock,
          });

        if (error || !created) {
          throw new Error('Failed to create variant');
        }

        setVariants(prev =>
          prev.map(v =>
            v.uiId === variant.uiId ? { ...v, backendId: created.id } : v
          )
        );
      } else {
        await ProductVariantService.updateVariant(variant.backendId, {
          variantName: variant.variantName,
          price: variant.price,
          stock: variant.stock,
        });
      }

      toast.success('Variant saved');
    } catch {
      toast.error('Failed to save variant');
    }
  };

  /* ----------------------------- VARIANT DELETE ----------------------------- */

  const deleteVariant = async (variant: EditableProductVariant) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this variant?'
    );

    if (!confirmed) return;

    try {
      if (variant.backendId) {
        await ProductVariantService.deactivateVariant(variant.backendId);
      }

      setVariants(prev => prev.filter(v => v.uiId !== variant.uiId));

      if (activeTab === variant.uiId) {
        setActiveTab(prev =>
          prev === variant.uiId ? variants[0]?.uiId : prev
        );
      }

      toast.success('Variant deleted');
    } catch {
      toast.error('Failed to delete variant');
    }
  };

  /* ----------------------------- IMAGE SAVE ----------------------------- */

  const saveImages = async (variant: EditableProductVariant) => {
    try {
      if (!variant.backendId) {
        toast.error('Save variant before uploading images');
        return;
      }

      for (let i = 0; i < variant.images.length; i++) {
        const img = variant.images[i];

        if (!img.file) continue;

        // 1️⃣ Ask backend for upload instructions
        const { data: descriptor } =
          await ProductVariantService.uploadVariantImage(variant.backendId);

        if (!descriptor) {
          throw new Error('Failed to get upload descriptor');
        }

        // 2️⃣ Upload directly to provider
        const uploaded = await uploadImageToProvider(descriptor, img.file);

        // 3️⃣ Persist image metadata in backend
        await ProductVariantService.saveVariantImage(variant.backendId, {
          url: uploaded.url,
          publicId: uploaded.publicId,
        });

        // mark as saved
        img.file = undefined;
      }

      toast.success('Images uploaded successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload images');
    }
  };

  /* ----------------------------- UI HELPERS ----------------------------- */

  const addVariant = () => {
    const v: EditableProductVariant = {
      uiId: crypto.randomUUID(),
      variantName: '',
      price: 0,
      stock: 0,
      images: [],
    };
    setVariants(prev => [...prev, v]);
    setActiveTab(v.uiId);
  };

  const removeVariantImage = (variantUiId: string, imageId: string) => {
    setVariants(prev =>
      prev.map(v =>
        v.uiId === variantUiId
          ? { ...v, images: v.images.filter(i => i.id !== imageId) }
          : v
      )
    );
  };

  const handleImageUpload = (variantUiId: string, files: FileList | null) => {
    if (!files) return;
    setCropFiles(Array.from(files));
    setCropIndex(0);
    setCropVariantUiId(variantUiId);
    setCropperOpen(true);
  };

  const pushCroppedImage = (image: EditableVariantImage) => {
    setVariants(prev =>
      prev.map(v =>
        v.uiId === cropVariantUiId ? { ...v, images: [...v.images, image] } : v
      )
    );
  };

  /* ----------------------------- RENDER ----------------------------- */

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 rounded-lg space-y-8 relative">
        <button
          type="button"
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        {/* PRODUCT */}
        <Card>
          <CardContent className="space-y-4 pt-6">
            <h2 className="font-semibold text-lg">Product Details</h2>

            <div>
              <Label>Product Name</Label>
              <Input {...productForm.register('name')} />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea {...productForm.register('description')} />
            </div>

            <Button onClick={saveProduct}>Save Product</Button>
          </CardContent>
        </Card>

        {/* VARIANTS */}
        <Tabs value={activeTab}>
          <TabsList>
            {variants.map(v => (
              <TabsTrigger
                key={v.uiId}
                value={v.uiId}
                onClick={() => setActiveTab(v.uiId)}
              >
                {v.variantName || 'New Variant'}
              </TabsTrigger>
            ))}
            <Button size="icon" type="button" onClick={addVariant}>
              <Plus />
            </Button>
          </TabsList>

          {variants.map(variant => (
            <TabsContent key={variant.uiId} value={variant.uiId}>
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <Label>Variant Name</Label>
                    <Input
                      value={variant.variantName}
                      onChange={e =>
                        setVariants(prev =>
                          prev.map(v =>
                            v.uiId === variant.uiId
                              ? { ...v, variantName: e.target.value }
                              : v
                          )
                        )
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Price</Label>
                      <Input
                        type="number"
                        value={variant.price}
                        onChange={e =>
                          setVariants(prev =>
                            prev.map(v =>
                              v.uiId === variant.uiId
                                ? { ...v, price: +e.target.value }
                                : v
                            )
                          )
                        }
                      />
                    </div>

                    <div>
                      <Label>Stock</Label>
                      <Input
                        type="number"
                        value={variant.stock}
                        onChange={e =>
                          setVariants(prev =>
                            prev.map(v =>
                              v.uiId === variant.uiId
                                ? { ...v, stock: +e.target.value }
                                : v
                            )
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => saveVariant(variant)}>
                      Save Variant
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => saveImages(variant)}
                    >
                      Save Images
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => deleteVariant(variant)}
                    >
                      <Trash2 size={16} className="mr-1" />
                      Delete Variant
                    </Button>
                  </div>

                  <div>
                    <Label>Variant Images</Label>
                    <div
                      className="border-dashed border-2 p-4 text-center cursor-pointer"
                      onClick={() =>
                        document
                          .getElementById(`upload-${variant.uiId}`)
                          ?.click()
                      }
                    >
                      <ImageIcon className="mx-auto" />
                      <input
                        id={`upload-${variant.uiId}`}
                        type="file"
                        multiple
                        hidden
                        onChange={e =>
                          handleImageUpload(variant.uiId, e.target.files)
                        }
                      />
                    </div>
                  </div>

                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                  >
                    <SortableContext
                      items={variant.images.map(i => i.id)}
                      strategy={horizontalListSortingStrategy}
                    >
                      <div className="grid grid-cols-6 gap-2">
                        {variant.images.map(img => (
                          <SortableImage
                            key={img.id}
                            image={img}
                            onRemove={() =>
                              removeVariantImage(variant.uiId, img.id)
                            }
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

        {cropperOpen && cropVariantUiId && (
          <AddImageCropper
            currentImages={cropFiles}
            currentImageIndex={cropIndex}
            setCurrentImageIndex={setCropIndex}
            pushCroppedImage={pushCroppedImage}
            onClose={() => setCropperOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
