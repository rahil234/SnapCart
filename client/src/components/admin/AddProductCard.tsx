import React, { useState, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Plus, X, Image as ImageIcon } from 'lucide-react';
import { DndContext, useDroppable, useDraggable, closestCenter } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import ImageCropper from './ImageCropper';
import { Area } from 'react-easy-crop/types';

interface AddProductFormInputs {
  productName: string;
  category: string;
  price: number;
  piece: number;
}

interface ProductImage {
  id: string;
  file: File;
  preview: string;
}

function Draggable(props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useDraggable({
    id: props.id,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </li>
  );
}

function Droppable(props) {
  const { setNodeRef } = useDroppable({
    id: props.id,
  });

  return (
    <ul ref={setNodeRef} className="space-y-2">
      {props.children}
    </ul>
  );
}

const AddProductCard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<AddProductFormInputs>();
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [imagesToCrop, setImagesToCrop] = useState<string[]>([]);
  const [currentCropIndex, setCurrentCropIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const onSubmit: SubmitHandler<AddProductFormInputs> = (data) => {
    if (productImages.length < 3) {
      alert('Please add at least 3 images');
      return;
    }
    // Here you would typically handle the product addition logic
    console.log({ ...data, images: productImages });
    onClose();
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

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleImageUpload(files);
  }, []);

  const handleDragEnd = ({ active, over }) => {
    if (over && active.id !== over.id) {
      setProductImages((prevImages) => {
        const oldIndex = prevImages.findIndex((image) => image.id === active.id);
        const newIndex = prevImages.findIndex((image) => image.id === over.id);
        return arrayMove(prevImages, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add Product</h2>
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
              <option value="">Select a category</option>
              <option value="Snacks">Snacks</option>
              <option value="Diary">Diary</option>
              <option value="Drinks">Drinks</option>
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price (₹)
            </label>
            <input
              type="number"
              id="price"
              {...register("price", { required: "Price is required", min: 0 })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
          </div>
          <div>
            <label htmlFor="piece" className="block text-sm font-medium text-gray-700">
              Piece
            </label>
            <input
              type="number"
              id="piece"
              {...register("piece", { required: "Piece is required", min: 0 })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.piece && <p className="mt-1 text-sm text-red-600">{errors.piece.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Images (3-6 images required)</label>
            <div
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md ${
                isDragging ? 'border-blue-500 bg-blue-50' : ''
              }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
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
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={productImages.map(image => image.id)} strategy={sortableKeyboardCoordinates}>
                <Droppable id="droppable">
                  {productImages.map((image, index) => (
                    <Draggable key={image.id} id={image.id}>
                      <div className="flex items-center bg-gray-100 p-2 rounded-md">
                        <img src={image.preview} alt={`Product ${index + 1}`} className="w-16 h-16 object-cover rounded mr-2" />
                        <div className="flex-grow">
                          <p className="text-sm font-medium">Image {index + 1}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(image.id);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </Draggable>
                  ))}
                </Droppable>
              </SortableContext>
            </DndContext>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus size={20} className="mr-2" />
              Add Product
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

export default AddProductCard;