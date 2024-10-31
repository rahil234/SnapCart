import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import productEndpoints from '@/api/productEndpoints';
import categoryEndpoints from '@/api/categoryEndpoints';
import { Category as OriginalCategory, Subcategory } from 'shared/types';
import ProductAddTab from './ProductAddTab';

interface Category extends OriginalCategory {
  subcategories: Subcategory[];
}

interface Variant {
  id: number;
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


function AddProductCard({ onClose }: { onClose: () => void }) {
  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm<FormValues>();


  const defaultVariant = { id: 1, name: `Variant 1`, price: '', stock: '', images: [] };

  const [variants, setVariants] = useState<Variant[]>([defaultVariant]);
  const [activeTab, setActiveTab] = useState(defaultVariant.id);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategory, setSubcategory] = useState<Subcategory[]>([]);

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


  const addVariant = () => {
    if (variants.length >= 6) {
      alert('You can only add up to 6 variants.');
      return;
    }
    const newVariant = { id: variants.length + 1, name: `Variant ${variants.length + 1}`, price: '', stock: '', images: [] };
    setVariants(prev => [...prev, newVariant]);
    setActiveTab(newVariant.id);
  };

  const removeVariant = (id: number) => {

    setActiveTab(currentActiveTab => {
      if (id === variants.length) return variants.length - 2;
      console.log("currentActiveTab", currentActiveTab);
      if (currentActiveTab === 1) return 1;
      if (variants.length === 2) return 1;
      if (id === 1) return 1;

      if (currentActiveTab !== id && variants.length > 2) return currentActiveTab;

      if (currentActiveTab === id && variants.length > 2) return currentActiveTab - 1;
      if (currentActiveTab > id) return currentActiveTab - 1;
      return currentActiveTab - 1
    });

    setVariants(prevVariants => {
      const updatedVariants = prevVariants
        .filter(variant => variant.id !== id)
        .map((variant, index) => ({ ...variant, id: index + 1 }));

      return updatedVariants;
    });
  };


  const onSubmit: SubmitHandler<FormValues> = async data => {
    console.log("data", data);

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

        variants.map((variant) => {
          variant.images.forEach((image, imgIndex) => {
            formData.append(`variants[${index}][images][${imgIndex}]`, image.file);
          });
        });
      });
      const response = await productEndpoints.addProduct(formData);

      formData.forEach((value, key) => {
        console.log(key, value);
      })


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
        <Tabs value={String(activeTab)} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <Label>Variants</Label>
          </div>
          <div className="flex space-x-2 overflow-x-auto p-2 items-center justify-center">
            <TabsList className="flex-grow flex ps-14 space-x-2 bg-transparent h-22">
              {variants.map((variant) => (
                <TabsTrigger
                  key={variant.id}
                  value={String(variant.id)}
                  className="relative flex flex-col items-center justify-center rounded-lg border-2 data-[state=active]:border-primary"
                  onClick={() => setActiveTab(variant.id)}
                >
                  <span className="text-sm font-medium p-2 py-6">{`Variant ${variant.id}`}</span>
                  {variants.length > 1 && (
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
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            {variants.length < 6 &&
              <Button type="button" onClick={addVariant} size="sm" className="shrink-0 h-24 w-24">
                <Plus className="h-6 w-6" />
              </Button>
            }
          </div>
          {
            activeTab && variants.find(variant => variant.id === activeTab) &&
            <ProductAddTab
              variant={variants.find(variant => variant.id === activeTab)!}
              setVariants={setVariants}
              setValue={setValue}
              register={register}
              errors={errors}
              variants={variants}
            />
          }
        </Tabs>
        <Button type="submit" className="w-full">Submit Product</Button>
      </form>
    </div >
  );
}


export default AddProductCard;