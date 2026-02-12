# Profile Picture API - Quick Start Guide

## ✅ Implementation Complete

Profile picture upload functionality has been fully implemented and is ready to use!

## 🚀 Quick Start

### For Frontend Developers

#### 1. Import the Service
```typescript
import { ProfilePictureService } from '@/services/profile-picture.service';
import { UserService } from '@/services/user.service';
```

#### 2. Upload a Profile Picture
```typescript
const handleUploadProfilePicture = async (imageBlob: Blob) => {
  try {
    const imageUrl = await ProfilePictureService.uploadProfilePicture(imageBlob);
    console.log('Uploaded!', imageUrl);
    
    // Optionally refresh user data
    await UserService.getMe();
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

#### 3. Display Profile Picture
```typescript
const { data: user } = await UserService.getMe();
const profilePicture = user?.customerProfile?.profilePicture;

// Use in component
<img src={profilePicture || '/default-avatar.png'} alt="Profile" />
```

## 📡 API Endpoints

### 1. Generate Upload URL
```http
POST /api/users/profile-picture/generate-upload-url
Authorization: Bearer <token>

Request:
{
  "fileName": "profile_1234567890.jpg"
}

Response:
{
  "message": "Profile picture upload URL generated successfully",
  "data": {
    "provider": "cloudinary",
    "uploadUrl": "https://api.cloudinary.com/v1_1/demo/image/upload",
    "method": "POST",
    "fields": {
      "timestamp": "1234567890",
      "signature": "abc123...",
      "api_key": "your_api_key",
      "folder": "profile-pictures"
    }
  }
}
```

### 2. Save Profile Picture URL
```http
POST /api/users/profile-picture
Authorization: Bearer <token>

Request:
{
  "url": "https://res.cloudinary.com/demo/image/upload/v123/profile.jpg"
}

Response:
{
  "message": "Profile picture updated successfully"
}
```

### 3. Get User Profile (with picture)
```http
GET /api/users/me
Authorization: Bearer <token>

Response:
{
  "message": "User profile fetched successfully",
  "data": {
    "id": "user123",
    "email": "user@example.com",
    "customerProfile": {
      "id": "profile123",
      "name": "John Doe",
      "profilePicture": "https://res.cloudinary.com/demo/image/upload/v123/profile.jpg"
    }
  }
}
```

## 🎨 UI Integration Examples

### Basic File Upload
```typescript
const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Upload directly
  try {
    const url = await ProfilePictureService.uploadProfilePicture(file);
    console.log('Success!', url);
  } catch (error) {
    console.error('Error:', error);
  }
};

<input 
  type="file" 
  accept="image/*" 
  onChange={handleFileChange} 
/>
```

### With Image Cropping
```typescript
import Cropper from 'react-easy-crop';

const [crop, setCrop] = useState({ x: 0, y: 0 });
const [zoom, setZoom] = useState(1);
const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

const onCropComplete = (croppedArea, croppedAreaPixels) => {
  setCroppedAreaPixels(croppedAreaPixels);
};

const handleSave = async () => {
  const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
  const url = await ProfilePictureService.uploadProfilePicture(croppedBlob);
  console.log('Uploaded:', url);
};

<Cropper
  image={imageSrc}
  crop={crop}
  zoom={zoom}
  aspect={1}
  cropShape="round"
  onCropChange={setCrop}
  onZoomChange={setZoom}
  onCropComplete={onCropComplete}
/>
```

### Avatar Component
```typescript
import { UserService } from '@/services/user.service';
import { useQuery } from '@tanstack/react-query';

const Avatar = () => {
  const { data } = useQuery({
    queryKey: ['me'],
    queryFn: () => UserService.getMe(),
  });

  const profilePicture = data?.data?.customerProfile?.profilePicture;
  const name = data?.data?.customerProfile?.name || 'User';
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
      {profilePicture ? (
        <img src={profilePicture} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          {initials}
        </div>
      )}
    </div>
  );
};
```

## 🔧 ProfilePictureService API

### Methods

#### `uploadProfilePicture(imageBlob: Blob): Promise<string>`
Complete upload flow. Returns the Cloudinary URL.

```typescript
const url = await ProfilePictureService.uploadProfilePicture(blob);
```

#### `generateUploadUrl(fileName: string)`
Get presigned upload credentials.

```typescript
const { data, error } = await ProfilePictureService.generateUploadUrl('profile.jpg');
```

#### `uploadToCloudinary(uploadDescriptor, imageBlob): Promise<string>`
Upload to Cloudinary using credentials.

```typescript
const url = await ProfilePictureService.uploadToCloudinary(descriptor, blob);
```

#### `saveProfilePicture(url: string)`
Save the uploaded URL to user profile.

```typescript
await ProfilePictureService.saveProfilePicture(cloudinaryUrl);
```

## 📦 Helper: Image Cropping

```typescript
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
): Promise<Blob> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

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
    pixelCrop.height,
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!);
    }, 'image/jpeg', 0.9);
  });
};
```

## 🔐 Security

- ✅ Authentication required for all endpoints
- ✅ Images stored in user-specific folders
- ✅ Presigned URLs expire after upload
- ✅ URL validation on backend

## 📊 Database Schema

```sql
-- CustomerProfile.profilePicture stores the full Cloudinary URL
SELECT id, name, "profilePicture" FROM "CustomerProfile";
```

## ⚙️ Environment Variables

Ensure these are set in your `.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🧪 Testing

### Test Upload
```typescript
// Create a test blob
const canvas = document.createElement('canvas');
canvas.width = 200;
canvas.height = 200;
const ctx = canvas.getContext('2d')!;
ctx.fillStyle = '#4F46E5';
ctx.fillRect(0, 0, 200, 200);

canvas.toBlob(async (blob) => {
  const url = await ProfilePictureService.uploadProfilePicture(blob!);
  console.log('Test upload successful:', url);
});
```

### Test with cURL
```bash
# 1. Get upload URL
curl -X POST http://localhost:4000/api/users/profile-picture/generate-upload-url \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fileName":"test.jpg"}'

# 2. Upload to Cloudinary (use response from step 1)
curl -X POST CLOUDINARY_UPLOAD_URL \
  -F "file=@/path/to/image.jpg" \
  -F "timestamp=..." \
  -F "signature=..." \
  -F "api_key=..."

# 3. Save URL
curl -X POST http://localhost:4000/api/users/profile-picture \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url":"CLOUDINARY_URL"}'

# 4. Get profile
curl http://localhost:4000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🐛 Troubleshooting

### Profile picture not showing
- Check if `customerProfile` exists
- Verify `profilePicture` field is populated
- Check Cloudinary URL is accessible
- Clear browser cache

### Upload fails
- Verify Cloudinary credentials in `.env`
- Check file size (max 10MB recommended)
- Ensure file is a valid image format
- Check network connectivity

### Backend errors
- Ensure database migration has run
- Verify user is authenticated
- Check user has customer profile
- Review server logs for details

## 📚 Related Documentation

- [Full Implementation Details](/docs/PROFILE-PICTURE-IMPLEMENTATION.md)
- [Banner Upload Pattern](/docs/IMAGE-MANAGEMENT-COMPLETE.md)
- [Clean Architecture Guide](/docs/DDD-ARCHITECTURE-DIAGRAMS.md)

## 🎉 That's It!

You're ready to integrate profile picture uploads into your UI. The backend is fully implemented and tested. Just call `ProfilePictureService.uploadProfilePicture(blob)` and you're done!
