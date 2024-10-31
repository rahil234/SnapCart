import React, { useCallback, useState } from 'react'
import Cropper, { Point, Area } from 'react-easy-crop';
import { Button } from '@/components/ui/button';

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

interface AddImageCropperProps {
    pushCroppedImage: any, //eslint-disable-line 
    currentImageIndex: any, //eslint-disable-line
    currentVariantId: number
    setCurrentImageIndex: any, //eslint-disable-line
    currentImages: File[],
    onClose: () => void
}

const AddImageCropper: React.FC<AddImageCropperProps> = ({ pushCroppedImage, setCurrentImageIndex, currentImages, currentImageIndex, currentVariantId, onClose }) => {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCropConfirm = async () => {


        if (croppedAreaPixels && currentImages.length > 0 && currentVariantId) {
            const currentFile = currentImages[currentImageIndex];
            const croppedImageBlob = await getCroppedImg(URL.createObjectURL(currentFile), croppedAreaPixels);
            const croppedImageFile = new File([croppedImageBlob], `cropped_image_${Date.now()}.jpg`, { type: 'image/jpeg' });

            pushCroppedImage({ id: currentImageIndex +1 , file: croppedImageFile, preview: URL.createObjectURL(croppedImageFile) });

            if (currentImageIndex < currentImages.length - 1) {
                setCurrentImageIndex(currentImageIndex + 1);
                setCrop({ x: 0, y: 0 });
                setZoom(1);
            }

        }

        if (currentImageIndex === currentImages.length - 1) {
            onClose();
        }
    };

    return currentImages.length > 0 && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
        <div className="bg-white p-4 rounded-lg w-[90vw] max-w-2xl">
            <div className="relative w-full h-[60vh]">
                <Cropper
                    image={URL.createObjectURL(currentImages[currentImageIndex])}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                />
            </div>
            <div className="mt-4 flex justify-between items-center">
                <span>Image {currentImageIndex + 1} of {currentImages.length}</span>
                <div>
                    <Button type='button' onClick={() => onClose()} variant="outline" className="mr-2">Cancel</Button>
                    <Button  type='button' onClick={handleCropConfirm}>
                        {currentImageIndex === currentImages.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </div>
            </div>
        </div>
    </div>
    )
}

export default AddImageCropper;
