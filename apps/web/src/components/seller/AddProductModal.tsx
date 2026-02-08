import React, { useState } from 'react';
import { Plus, X, ImageIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import { ProductService } from '@/services/product.service';
import { ProductVariantService } from '@/services/product-variant.service';
import AddImageCropper from './addImageCropper';

import { uploadImageToProvider } from '@/utils/upload-image-to-provider';
import { useGetCategories } from '@/hooks/category.hooks';

/* -------------------------------------------------------------------------- */
/* TYPES                                                                       */
/* -------------------------------------------------------------------------- */

interface VariantImage {
  id: string;
  preview: string;
  file?: File;
}

interface DraftVariant {
  uiId: string;
  variantName: string;
  price: number;
  stock: number;
  images: VariantImage[];
}

interface FormValues {
  productName: string;
  description: string;
  category: string;
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                   */
/* -------------------------------------------------------------------------- */

export default function AddProductModal({ onClose }: { onClose: () => void }) {
  const { register, handleSubmit, watch } = useForm<FormValues>();

  const [variants, setVariants] = useState<DraftVariant[]>([]);
  const [activeTab, setActiveTab] = useState<string | undefined>();

  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropFiles, setCropFiles] = useState<File[]>([]);
  const [cropIndex, setCropIndex] = useState(0);
  const [cropVariantUiId, setCropVariantUiId] = useState<string | null>(null);

  const category = watch('category');

  const { data: categories, error: CategoryFetchError } = useGetCategories();

  /* ----------------------------- VARIANTS ----------------------------- */

  const addVariant = () => {
    const v: DraftVariant = {
      uiId: crypto.randomUUID(),
      variantName: '',
      price: 0,
      stock: 0,
      images: [],
    };
    setVariants(prev => [...prev, v]);
    setActiveTab(v.uiId);
  };

  /* ----------------------------- IMAGES ----------------------------- */

  const handleImageUpload = (variantUiId: string, files: FileList | null) => {
    if (!files) return;
    setCropFiles(Array.from(files));
    setCropIndex(0);
    setCropVariantUiId(variantUiId);
    setCropperOpen(true);
  };

  const pushCroppedImage = (image: VariantImage) => {
    setVariants(prev =>
      prev.map(v =>
        v.uiId === cropVariantUiId ? { ...v, images: [...v.images, image] } : v
      )
    );
  };

  /* ----------------------------- SUBMIT ----------------------------- */

  const onSubmit = async (data: FormValues) => {
    try {
      const { data: product } = await ProductService.createProduct({
        name: data.productName,
        description: data.description,
        categoryId: category,
      });

      if (!product) throw new Error('Product creation failed');

      for (const variant of variants) {
        const { data: createdVariant } =
          await ProductVariantService.createVariant(product.id, {
            variantName: variant.variantName,
            price: variant.price,
            stock: variant.stock,
            sku: `SKU-${Date.now()}`,
          });

        if (!createdVariant) {
          throw new Error('Variant creation failed');
        }

        for (const img of variant.images) {
          if (!img.file) continue;

          const { data: descriptor } =
            await ProductVariantService.uploadVariantImage(createdVariant.id);

          if (!descriptor) {
            throw new Error('Upload descriptor failed');
          }

          const uploaded = await uploadImageToProvider(descriptor, img.file);

          await ProductVariantService.saveVariantImage(
            createdVariant.id,
            uploaded
          );
        }
      }

      toast.success('Product created successfully');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create product');
    }
  };

  if (!categories || CategoryFetchError) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
        <div className="bg-white w-full max-w-3xl p-6 rounded-lg">
          <p className="text-red-500">
            Failed to load categories. Please try again later.
          </p>
          <Button onClick={onClose} className="mt-4">
            Close
          </Button>
        </div>
      </div>
    );
  }

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
              <Input {...register('productName', { required: true })} />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea {...register('description', { required: true })} />
            </div>

            <div>
              <Label>Category</Label>
              <select
                {...register('category', { required: true })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
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

                  <div className="grid grid-cols-6 gap-2">
                    {variant.images.map(img => (
                      <img
                        key={img.id}
                        src={img.preview}
                        alt="Variant"
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
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

        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          className="w-full"
        >
          Create Product
        </Button>
      </div>
    </div>
  );
}
