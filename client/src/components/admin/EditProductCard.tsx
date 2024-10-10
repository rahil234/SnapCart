//@ts-nocheck
import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Save, X, Image as ImageIcon } from 'lucide-react';
import ImageCropper from './ImageCropper';
import { Area } from 'react-easy-crop/types';

interface EditProductFormInputs {
  productName: string;
  category: string;
  price: number;
  piece: number;
}

interface ProductImage {
  file: File;
  preview: string;
}

interface ProductData {
  id: string;
  productName: string;
  category: string;
  price: number;
  piece: number;
  images: ProductImage[];
}

const EditProductCard: React.FC<{
  product: ProductData;
  onClose: () => void;
}> = ({ product, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EditProductFormInputs>();
  const [productImages, setProductImages] = useState<ProductImage[]>(
    product.images
  );
  const [croppingImage, setCroppingImage] = useState<string | null>(null);

  useEffect(() => {
    setValue('productName', product.productName);
    setValue('category', product.category);
    setValue('price', product.price);
    setValue('piece', product.piece);
  }, [product, setValue]);

  const onSubmit: SubmitHandler<EditProductFormInputs> = data => {
    // Here you would typically handle the product update logic
    console.log({ ...data, images: productImages });
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCroppingImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', error => reject(error));
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
            new File([blob], 'cropped_image.jpg', { type: 'image/jpeg' })
          );
        }
      }, 'image/jpeg');
    });
  };

  const handleCropComplete = async (croppedAreaPixels: Area) => {
    if (croppingImage) {
      const croppedImage = await getCroppedImg(
        croppingImage,
        croppedAreaPixels
      );
      if (croppedImage) {
        const preview = URL.createObjectURL(croppedImage);
        setProductImages(prev => [...prev, { file: croppedImage, preview }]);
        setCroppingImage(null);
      }
    }
  };

  const removeImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Edit Product</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              {...register('productName', {
                required: 'Product name is required',
              })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.productName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.productName.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              {...register('category', { required: 'Category is required' })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Select a category</option>
              <option value="Snacks">Snacks</option>
              <option value="Diary">Diary</option>
              <option value="Drinks">Drinks</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">
                {errors.category.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price (₹)
            </label>
            <input
              type="number"
              id="price"
              {...register('price', { required: 'Price is required', min: 0 })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">
                {errors.price.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="piece"
              className="block text-sm font-medium text-gray-700"
            >
              Piece
            </label>
            <input
              type="number"
              id="piece"
              {...register('piece', { required: 'Piece is required', min: 0 })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.piece && (
              <p className="mt-1 text-sm text-red-600">
                {errors.piece.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Images
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
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
                      onChange={handleImageUpload}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>
          {productImages.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {productImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.preview}
                    alt={`Product ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
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
      {croppingImage && (
        <ImageCropper
          image={croppingImage}
          onCropComplete={handleCropComplete}
          onCancel={() => setCroppingImage(null)}
          currentIndex={0} // or the appropriate index
          totalImages={productImages.length}
        />
      )}
    </div>
  );
};

export default EditProductCard;
