import {
  ChartNoAxesCombined,
  Edit,
  Image as ImageIcon,
  Trash,
  Upload,
} from 'lucide-react';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';
import {
  restrictToHorizontalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';
import { toast } from 'sonner';
import { CSS } from '@dnd-kit/utilities';
import Cropper, { Area } from 'react-easy-crop';
import React, { useCallback, useEffect, useState } from 'react';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BannerResponse, BannerService } from '@/services/banner.service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Type definition for Cloudinary upload descriptor
interface CloudinaryUploadDescriptor {
  provider: 'cloudinary';
  uploadUrl: string;
  method: 'POST';
  fields: Record<string, string>;
}

function SortableBanner({
  banner,
  onEdit,
  onRemove,
}: {
  banner: BannerResponse;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: banner.id });

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
      className="bg-white rounded-lg shadow-md w-48 h-28 cursor-move relative overflow-hidden"
    >
      {banner.imageUrl ? (
        <img
          src={banner.imageUrl}
          alt="Banner"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <Upload className="text-gray-400" size={24} />
        </div>
      )}
      <Button
        className="absolute bottom-2 right-2 bg-white text-gray-800 hover:bg-gray-100"
        size="sm"
        onMouseDown={e => {
          e.stopPropagation();
          onEdit();
        }}
      >
        <Edit className="w-4 h-4 mr-2" />
        Edit
      </Button>
      <Button
        className="absolute bottom-2 left-2 bg-white text-gray-800 hover:bg-gray-100"
        size="sm"
        onMouseDown={e => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <Trash className="w-4 h-4" />
      </Button>
    </div>
  );
}

function BannerManagement() {
  const [banners, setBanners] = useState<BannerResponse[]>([]);
  const [editingBanner, setEditingBanner] = useState<BannerResponse | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const result = await BannerService.getAllBanners();
        if (result.error) {
          throw new Error(result.error.message);
        }
        if (result.data) {
          setBanners(result.data);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
        toast.error('Failed to fetch banners');
      }
    })();
  }, []);

  const handleEdit = (bannerId: string) => {
    const bannerToEdit = banners.find(banner => banner.id === bannerId);
    if (bannerToEdit) {
      setEditingBanner(bannerToEdit);
      setIsDialogOpen(true);
    }
  };

  const handleRemove = async (bannerId: string) => {
    try {
      const result = await BannerService.deleteBanner(bannerId);
      if (result.error) {
        throw new Error(result.error.message);
      }
      setBanners(banners.filter(banner => banner.id !== bannerId));
      toast.success('Banner removed successfully');
    } catch (error) {
      console.error('Error removing banner:', error);
      toast.error('Failed to remove banner');
    }
  };

  const handleAddBanner = () => {
    if (banners.length >= 5) {
      toast.error('You can only add up to 5 banners.');
      return;
    }
    const newBanner: BannerResponse = {
      id: Date.now().toString(),
      imageUrl: '',
      order: banners.length + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBanners([...banners, newBanner]);
  };

  const onCropComplete = useCallback(
    async (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
      // Generate preview - use the current imageSrc from the callback parameter
      if (imageSrc) {
        try {
          const preview = await getCroppedImgPreview(
            imageSrc,
            croppedAreaPixels
          );
          setCroppedPreview(preview);
        } catch (error) {
          console.error('Error generating preview:', error);
          toast.error('Failed to generate preview');
        }
      }
    },
    [imageSrc]
  );

  const getCroppedImgPreview = async (
    imageSrc: string,
    pixelCrop: Area
  ): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Set canvas dimensions to match the cropped area
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

    return canvas.toDataURL('image/jpeg', 0.95); // Add quality parameter
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size should be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const imageUrl = reader.result as string;
        setImageSrc(imageUrl);
        setCroppedPreview(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
      });
      reader.readAsDataURL(file);
    }
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', error => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area
  ): Promise<Blob | null> => {
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

    return new Promise(resolve => {
      canvas.toBlob(blob => {
        if (!blob) {
          console.error('Canvas is empty');
          resolve(null);
          return;
        }
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  const handleSaveCroppedImage = async () => {
    if (croppedAreaPixels && imageSrc && editingBanner) {
      try {
        setIsUploading(true);
        const croppedImageBlob = await getCroppedImg(
          imageSrc,
          croppedAreaPixels
        );
        if (croppedImageBlob) {
          // Generate presigned upload URL
          const uploadResult = await BannerService.generateUploadUrl(
            `banner_${editingBanner.id}_${Date.now()}.jpg`
          );

          if (uploadResult.error) {
            throw new Error(uploadResult.error.message);
          }

          const uploadDescriptor = uploadResult.data!;
          let imageUrl: string;

          if (uploadDescriptor.provider === 'cloudinary') {
            // Upload to Cloudinary - type assertion needed for union type
            imageUrl = await BannerService.uploadToCloudinary(
              uploadDescriptor as CloudinaryUploadDescriptor,
              croppedImageBlob
            );
          } else {
            // Handle Azure upload if needed
            throw new Error('Azure upload not implemented');
          }

          // Update banner with new image URL
          if (editingBanner.imageUrl) {
            // Update existing banner
            const updateResult = await BannerService.updateBanner(
              editingBanner.id,
              { imageUrl }
            );
            if (updateResult.error) {
              throw new Error(updateResult.error.message);
            }
            handleImageUpload(editingBanner.id, imageUrl);
          } else {
            // Create a new banner
            const createResult = await BannerService.createBanner({
              imageUrl,
              order: editingBanner.order,
            });

            if (createResult.error) {
              throw new Error(createResult.error.message);
            }

            setBanners(prevBanners =>
              prevBanners.map(banner =>
                banner.id === editingBanner.id ? createResult.data! : banner
              )
            );
            setIsDialogOpen(false);
            setImageSrc(null);
          }

          toast.success('Banner image updated successfully');
        }
      } catch (e) {
        console.error(e);
        toast.error('Failed to update banner image');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleImageUpload = (id: string, imageUrl: string) => {
    setBanners(prevBanners =>
      prevBanners.map(banner =>
        banner.id === id ? { ...banner, imageUrl } : banner
      )
    );
    setIsDialogOpen(false);
    setImageSrc(null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setBanners(items => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          order: index,
        }));

        // Update the order on the server
        updateBannerOrder(updatedItems);

        return updatedItems;
      });
    }
  };

  const updateBannerOrder = async (updatedBanners: BannerResponse[]) => {
    try {
      const result = await BannerService.reorderBanners(
        updatedBanners.map(banner => ({
          id: banner.id,
          order: banner.order,
        }))
      );

      if (result.error) {
        throw new Error(result.error.message);
      }

      toast.success('Banner order updated successfully');
    } catch (error) {
      console.error('Error updating banner order:', error);
      toast.error('Failed to update banner order');
    }
  };

  return (
    <div className="space-y-6 max-w-[80vw]">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-semibold mb-2">Top banner</h2>
        <Button onClick={handleAddBanner}>Add Banner</Button>
      </div>
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={banners.map(banner => banner.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
            {banners.map(banner => (
              <SortableBanner
                key={banner.id}
                banner={banner}
                onEdit={() => handleEdit(banner.id)}
                onRemove={() => handleRemove(banner.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <Dialog
        open={isDialogOpen}
        onOpenChange={open => {
          setIsDialogOpen(open);
          if (!open) {
            // Reset all states when dialog closes
            setImageSrc(null);
            setCroppedPreview(null);
            setCroppedAreaPixels(null);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setEditingBanner(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Banner Image</DialogTitle>
            <p className="text-sm text-gray-500">
              Recommended dimensions: 1920x1080 or similar 16:9 aspect ratio
            </p>
          </DialogHeader>
          {editingBanner && (
            <>
              {!imageSrc ? (
                <div className="w-full h-48 flex flex-col items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                  <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                  <Button
                    onClick={() =>
                      document.getElementById('fileInput')?.click()
                    }
                  >
                    Choose Image
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    Upload a banner image (16:9 ratio recommended)
                  </p>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Cropper Section */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      Adjust Your Banner (16:9 Aspect Ratio)
                    </h3>
                    <div className="relative h-[400px] bg-gray-900 rounded-lg overflow-hidden">
                      <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={16 / 9}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        restrictPosition={true}
                      />
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Zoom</label>
                        <span className="text-xs text-gray-500">
                          {zoom.toFixed(1)}x
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={e => setZoom(Number(e.target.value))}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Adjust the crop area and zoom to frame your banner
                        perfectly
                      </p>
                    </div>
                  </div>

                  {/* Preview Section */}
                  {croppedPreview ? (
                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        Preview (How it will appear on homepage)
                      </h3>
                      <div className="space-y-3">
                        {/* Desktop Preview */}
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500">
                            Desktop View (1280px+)
                          </p>
                          <div className="w-full h-[320px] rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                            <img
                              src={croppedPreview}
                              alt="Desktop Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Tablet Preview */}
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500">
                            Tablet View (768px - 1024px)
                          </p>
                          <div className="w-full max-w-2xl h-[240px] rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                            <img
                              src={croppedPreview}
                              alt="Tablet Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Mobile Preview */}
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500">
                            Mobile View (&lt; 640px)
                          </p>
                          <div className="w-full max-w-md h-[180px] rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                            <img
                              src={croppedPreview}
                              alt="Mobile Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <p className="text-sm text-gray-500">
                        Adjust the crop area above to see the preview
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          <div className="flex justify-between items-center gap-2 mt-4 pt-4 border-t">
            <div>
              {imageSrc && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setImageSrc(null);
                    setCroppedPreview(null);
                    setCroppedAreaPixels(null);
                  }}
                >
                  Choose Different Image
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setImageSrc(null);
                  setCroppedPreview(null);
                }}
              >
                Cancel
              </Button>
              {imageSrc && (
                <Button onClick={handleSaveCroppedImage} disabled={isUploading}>
                  {isUploading ? 'Uploading...' : 'Save & Upload Banner'}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <h2 className="text-2xl font-semibold text-gray-500">
        {title} Management Coming Soon
      </h2>
    </div>
  );
}

export default function AdminBanner() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Ads Management</h1>
      <Tabs defaultValue="banners" className="space-y-4">
        <TabsList>
          <TabsTrigger value="banners" className="flex items-center">
            <ImageIcon className="w-4 h-4 mr-2" />
            Banners
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <ChartNoAxesCombined className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>
        <TabsContent value="banners">
          <Card>
            <CardContent className="pt-6">
              <BannerManagement />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="campaigns">
          <Card>
            <CardContent>
              <PlaceholderPage title="Campaign" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardContent>
              <PlaceholderPage title="Analytics" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
