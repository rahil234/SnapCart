import React, { useState, useEffect, useCallback } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToHorizontalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Cropper, { Area } from 'react-easy-crop';
import { toast } from 'sonner';
import { Edit, Upload, Trash } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import adminEndpoints from '@/api/adminEndpoints';

interface Banner {
  _id: string;
  image: string;
  order: number;
}

function SortableBanner({ banner, onEdit, onRemove }: { banner: Banner, onEdit: () => void, onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: banner._id });

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
      {banner.image ? (
        <img src={'http://localhost:3000/' + banner.image} alt="Banner" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <Upload className="text-gray-400" size={24} />
        </div>
      )}
      <Button
        className="absolute bottom-2 right-2 bg-white text-gray-800 hover:bg-gray-100"
        size="sm"
        onMouseDown={(e) => {
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
        onMouseDown={(e) => {
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
  const [banners, setBanners] = useState<Banner[]>([]);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await adminEndpoints.getBanners();
      setBanners(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error('Failed to fetch banners');
    }
  };

  const handleEdit = (bannerId: string) => {
    const bannerToEdit = banners.find(banner => banner._id === bannerId);
    if (bannerToEdit) {
      setEditingBanner(bannerToEdit);
      setIsDialogOpen(true);
    }
  };

  const handleRemove = async (bannerId: string) => {
    try {
      await adminEndpoints.deleteBanner(bannerId);
      setBanners(banners.filter(banner => banner._id !== bannerId));
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
    const newBanner: Banner = { _id: Date.now().toString(), image: '', order: banners.length + 1 };
    setBanners([...banners, newBanner]);
  };

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result as string));
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

  const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob | null> => {
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

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
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
        const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
        if (croppedImageBlob) {
          const formData = new FormData();
          formData.append('image', croppedImageBlob, `banner_${editingBanner._id}_${Date.now()}.jpg`);
          formData.append('bannerId', editingBanner._id.toString());

          const response = await adminEndpoints.uploadBannerImage(formData);
          handleImageUpload(editingBanner._id, response.data.imageUrl);
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

  const handleImageUpload = (_id: string, imageUrl: string) => {
    setBanners((prevBanners) =>
      prevBanners.map((banner) =>
        banner._id === _id ? { ...banner, image: imageUrl } : banner
      )
    );
    setIsDialogOpen(false);
    setImageSrc(null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setBanners((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        const updatedItems = newItems.map((item, index) => ({ ...item, order: index + 1 }));

        // Update the order on the server
        updateBannerOrder(updatedItems);

        return updatedItems;
      });
    }
  };

  const updateBannerOrder = async (updatedBanners: Banner[]) => {
    try {
      await adminEndpoints.updateBannerOrder(updatedBanners.map(banner => ({ id: parseInt(banner._id, 10), order: banner.order })));
      toast.success('Banner order updated successfully');
    } catch (error) {
      console.error('Error updating banner order:', error);
      toast.error('Failed to update banner order');
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-semibold mb-2">Top banner</h2>
        <Button onClick={handleAddBanner}>Add Banner</Button>
      </div>
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={banners.map(banner => banner._id)} strategy={horizontalListSortingStrategy}>
          <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
            {banners.map((banner) => (
              <SortableBanner
                key={banner._id}
                banner={banner}
                onEdit={() => handleEdit(banner._id)}
                onRemove={() => handleRemove(banner._id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Update Banner Image</DialogTitle>
          </DialogHeader>
          {editingBanner && (
            <>
              {!imageSrc ? (
                <div className="w-full h-32 flex items-center justify-center bg-gray-200 rounded mb-4">
                  <Button onClick={() => document.getElementById('fileInput')?.click()}>
                    Choose Image
                  </Button>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                <div className="h-[400px] relative">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={16 / 9}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>
              )}
            </>
          )}
          <div className="flex justify-end gap-2 mt-4">
            {imageSrc && (
              <Button onClick={handleSaveCroppedImage} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Save Cropped Image'}
              </Button>
            )}
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <h2 className="text-2xl font-semibold text-gray-500">{title} Management Coming Soon</h2>
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
            <Upload className="w-4 h-4 mr-2" />
            Banners
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <Upload className="w-4 h-4 mr-2" />
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