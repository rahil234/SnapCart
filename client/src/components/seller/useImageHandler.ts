import { useState } from 'react';
import { Area } from 'react-easy-crop';

interface ProductImage {
  id: string;
  file: File;
  preview: string;
}

const useImageHandler = () => {
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [imagesToCrop, setImagesToCrop] = useState<string[]>([]);
  const [currentCropIndex, setCurrentCropIndex] = useState<number>(0);

  const handleImageUpload = (files: File[]) => {
    if (productImages.length + files.length > 6) {
      alert('You can only upload a maximum of 6 images');
      return;
    }
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setImagesToCrop(prevImages => [...prevImages, ...imageUrls]);
    setCurrentCropIndex(prevIndex => prevIndex === 0 ? 0 : prevIndex);
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

  return {
    productImages,
    imagesToCrop,
    currentCropIndex,
    handleImageUpload,
    handleCropComplete,
    removeImage,
  };
};

export default useImageHandler;