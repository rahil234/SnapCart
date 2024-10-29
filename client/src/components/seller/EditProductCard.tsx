import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Save, X, Image as ImageIcon } from 'lucide-react';
import ImageCropper from './ImageCropper';
import { Area } from 'react-easy-crop';
import { Product, Category, Subcategory, ImportMeta } from 'shared/types';
import productEndpoints from '@/api/productEndpoints';

interface EditProductFormInputs {
  productName: string;
  category: string;
  subcategory: string;
  price: number;
  quantity: string;
  stock: number;
}

interface ProductImage {
  id: string;
  file: File;
  preview: string;
}

interface Categories extends Category {
  subcategories: Subcategory[];
}

const imageUrl = (import.meta as unknown as ImportMeta).env.VITE_imageUrl;

const EditProductCard: React.FC<{ product: Product; categories: Categories[]; onClose: () => void }> = ({ product, categories, onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<EditProductFormInputs>();
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [imagesToCrop, setImagesToCrop] = useState<string[]>([]);
  const [currentCropIndex, setCurrentCropIndex] = useState<number>(0);
  const [subCategories, setSubCategories] = useState<Subcategory[]>([]);


  const selectedCategory = watch('category');

  useEffect(() => {
    const category = categories.find((cat: Category) => cat._id === selectedCategory);
    if (category) {
      setSubCategories(category.subcategories);
    } else {
      setSubCategories([]);
    }
  }, [selectedCategory, categories]);


  const fetchImageFile = async (url: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], url.split('/').pop() || 'image.jpg', { type: blob.type });
  };

  useEffect(() => {
    reset({
      productName: product.name,
      category: product.category._id,
      subcategory: product.subcategory._id,
      price: product.price,
      quantity: product.quantity,
      stock: product.stock,
    });

    const fetchImages = async () => {
      const imagesWithFiles = await Promise.all(product.images.map(async (image, index) => {
        const file = await fetchImageFile(imageUrl + image);
        return {
          id: `existing-${index}`,
          file,
          preview: URL.createObjectURL(file),
        };
      }));
      setProductImages(imagesWithFiles);
      console.log(imagesWithFiles);
    };

    fetchImages();

  }, [product, categories]);


  const onSubmit: SubmitHandler<EditProductFormInputs> = async (data) => {

    if (productImages.length < 3) {
      alert('Please add at least 3 images');
      return;
    }
    const formData = new FormData();
    formData.append('productId', product._id);
    formData.append('productName', data.productName);
    formData.append('category', data.category);
    formData.append('subcategory', data.subcategory);
    formData.append('price', data.price.toString());
    formData.append('quantity', data.quantity);
    formData.append('stock', data.stock.toString());

    productImages.forEach((image) => {
      formData.append('images', image.file);
    });

    try {


      const response = await productEndpoints.editProduct(formData);
      console.log(response);
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleImageUpload = (files: File[]) => {
    if (productImages.length + files.length > 6) {
      alert('You can only upload a maximum of 6 images');
      return;
    }
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setImagesToCrop(prevImages => [...prevImages, ...imageUrls]);
    setCurrentCropIndex(prevIndex => prevIndex === 0 ? 0 : prevIndex);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleImageUpload(files);
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: Area) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return null;
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

    return new Promise<File>(resolve => {
      canvas.toBlob(blob => {
        if (blob) {
          resolve(
            new File([blob], `cropped_image_${Date.now()}.jpg`, {
              type: 'image/jpeg',
            })
          );
        }
      }, 'image/jpeg');
    });
  };

  const handleCropComplete = async (croppedAreaPixels: Area) => {
    const currentImage = imagesToCrop[currentCropIndex];
    if (currentImage) {
      const croppedImage = await getCroppedImg(currentImage, croppedAreaPixels);
      if (croppedImage) {
        const preview = URL.createObjectURL(croppedImage);
        setProductImages((prev) => [...prev, { id: `image-${Date.now()}`, file: croppedImage, preview }]);
      }
    }

    if (currentCropIndex < imagesToCrop.length - 1) {
      setCurrentCropIndex(currentCropIndex + 1);
    } else {
      setImagesToCrop([]);
      setCurrentCropIndex(0);
    }
  };

  const removeImage = (id: string) => {
    setProductImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    handleImageUpload(files);
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Edit Product</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              {...register("productName", { required: "Product name is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.productName && <p className="mt-1 text-sm text-red-600">{errors.productName.message}</p>}
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              {...register("category", { required: "Category is required" })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Select Category</option>
              {categories.map((category: Category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
          </div>
          {subCategories.length > 0 && (
            <div>
              <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
                Sub Category
              </label>
              <select
                id="subcategory"
                {...register("subcategory", { required: "Subcategory is required" })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Select Sub Category</option>
                {subCategories.map((subCategory: Subcategory) => (
                  <option key={subCategory._id} value={subCategory._id}>{subCategory.name}</option>
                ))}
              </select>
              {errors.subcategory && <p className="mt-1 text-sm text-red-600">{errors.subcategory.message}</p>}
            </div>
          )}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price (₹)
            </label>
            <input
              type="number"
              id="price"
              {...register("price", { required: "Price is required", min: 1 })}
              onWheel={(e) => e.currentTarget.blur()}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="text"
              id="quantity"
              {...register("quantity", { required: "Quantity is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>}
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              type="number"
              id="stock"
              {...register("stock", { required: "Stock is required", min: 1 })}
              onWheel={(e) => e.currentTarget.blur()}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Images (3-6 images required)</label>
            <div
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="space-y-1 text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="image-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload images</span>
                    <input
                      id="image-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      accept="image/*"
                      onChange={handleFileInputChange}
                      disabled={productImages.length >= 6}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
          {productImages.length > 0 && (
            <div className="space-y-2">
              {productImages.map((image) => (
                <div key={image.id} className="flex items-center bg-gray-100 p-2 rounded-md">
                  <img src={image.preview} alt="Product" className="w-16 h-16 object-cover rounded mr-2" />
                  <div className="flex-grow">
                    <p className="text-sm font-medium">Image</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="text-red-500  hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save size={20} className="mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
      {imagesToCrop.length > 0 && (
        <ImageCropper
          image={imagesToCrop[currentCropIndex]}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setImagesToCrop([]);
            setCurrentCropIndex(0);
          }}
          currentIndex={currentCropIndex}
          totalImages={imagesToCrop.length}
        />
      )}
    </div>
  );
};

export default EditProductCard;