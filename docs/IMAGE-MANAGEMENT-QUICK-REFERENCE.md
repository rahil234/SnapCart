# 🖼️ Image Management - Quick Reference Guide

## 📌 At a Glance

| Item | Details |
|------|---------|
| **Max Images** | 6 per variant |
| **Primary Image** | Position 1 (auto-selected for thumbnails) |
| **Upload Method** | Presigned credentials → Client uploads to Cloudinary |
| **Position Logic** | 1-6, no reordering on delete (gaps preserved) |
| **Auto-Position** | Yes, `getNextImagePosition()` finds next slot |

---

## 🔗 API Endpoints

### 1. Generate Presigned Upload Credentials
```http
GET /api/products/{productId}/variants/{variantId}/upload-image

Response:
{
  "uploadUrl": "https://api.cloudinary.com/v1_1/.../image/upload",
  "fields": {
    "api_key": "...",
    "timestamp": "...",
    "signature": "...",
    "public_id": "...",
    "folder": "..."
  }
}
```

### 2. Confirm Image Upload
```http
POST /api/products/{productId}/variants/{variantId}/images

Body:
{
  "publicId": "snapcart/variants/abc123",
  "url": "https://res.cloudinary.com/..."
}

Response:
{
  "id": "img-123",
  "publicId": "snapcart/variants/abc123",
  "url": "https://res.cloudinary.com/...",
  "position": 1,
  "isPrimary": true,
  "createdAt": "2026-02-03T10:00:00Z"
}
```

### 3. Get Variant with Images
```http
GET /api/products/{productId}/variants/{variantId}

Response includes:
{
  "id": "var-123",
  "sku": "SKU-001",
  "images": [
    { "id": "img-1", "position": 1, "isPrimary": true, "url": "..." },
    { "id": "img-2", "position": 2, "isPrimary": false, "url": "..." }
  ],
  "primaryImage": { "id": "img-1", ... }
}
```

---

## 💾 Database Schema

```prisma
model VariantImage {
  id        String @id @default(cuid())
  variantId String
  publicId  String
  url       String
  position  Int           // 1-6
  createdAt DateTime
  
  variant ProductVariant @relation(...)
  
  @@unique([variantId, position])  // One image per slot
  @@index([variantId])
}
```

---

## 🏗️ Domain Objects

### VariantImage (Value Object)
```typescript
// Create
const image = VariantImage.create(
  variantId,
  'snapcart/variants/abc',
  'https://...',
  1  // position
);

// Query
image.getPublicId()    // string
image.getUrl()         // string
image.getPosition()    // 1-6
image.isPrimary()      // boolean
```

### ProductVariant (Entity)
```typescript
// Image management
variant.addImage(image)           // Add with validation
variant.removeImage(imageId)      // Remove
variant.getImages()               // VariantImage[]
variant.getPrimaryImage()         // VariantImage | null
variant.canAddImage()             // boolean
variant.getImageCount()           // number
```

---

## 🎯 Key Concepts

### Position Assignment
```typescript
// Position starts at 1, increments until 6
const nextPos = await repo.getNextImagePosition(variantId);
// Returns: 1, 2, 3, 4, 5, or 6
// If already 6, throw error: "Max 6 images"

// Positions are NOT reordered on delete
// Example: Delete position 2 from [1,2,3,4] → [1,3,4]
// Next upload goes to position 5 (not 2)
```

### Primary Image Selection
```typescript
// Position 1 = primary image
const primary = variant.getPrimaryImage();

// Or from response
const primary = response.primaryImage;

// Display as thumbnail
if (primary) <img src={primary.url} />
```

### Image Collection
```typescript
// All images sorted by position
const images = variant.getImages();  // [pos1, pos2, pos3, ...]

// Response includes both
{
  images: [...all images...],       // Complete array
  primaryImage: {...pos1 image...}  // Convenience
}
```

---

## 🚀 Frontend Integration Example

```typescript
// Step 1: Get upload credentials
const credResponse = await fetch(
  `/api/products/${productId}/variants/${variantId}/upload-image`
);
const { uploadUrl, fields } = await credResponse.json();

// Step 2: Upload to Cloudinary
const formData = new FormData();
formData.append('file', selectedFile);
Object.entries(fields).forEach(([key, val]) => {
  formData.append(key, val);
});

const uploadResponse = await fetch(uploadUrl, {
  method: 'POST',
  body: formData
});
const { public_id, secure_url } = await uploadResponse.json();

// Step 3: Confirm to backend
const confirmResponse = await fetch(
  `/api/products/${productId}/variants/${variantId}/images`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      publicId: public_id,
      url: secure_url
    })
  }
);
const variantImage = await confirmResponse.json();
```

---

## 🔄 Image Lifecycle

```
┌─────────────────┐
│  User selects   │
│    image        │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ GET presigned credentials   │
│ (GeneratePresignedCommand)  │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Upload directly to          │
│ Cloudinary (client-side)    │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Confirm upload to backend   │
│ (SaveVariantImageCommand)   │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Image saved to database     │
│ Position auto-assigned      │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Return VariantImage DTO     │
│ Position = 1, 2, 3, etc.    │
└─────────────────────────────┘
```

---

## ⚠️ Validation Rules

| Check | Rule | Error |
|-------|------|-------|
| **Variant Exists** | Must exist before upload | "Variant not found" |
| **Max Images** | Can't exceed 6 | "Max 6 images reached" |
| **Position Unique** | (variantId, position) unique | DB constraint violation |
| **URL Valid** | Must be valid URL | "@IsUrl() validation" |
| **Cloudinary Keys** | Must be configured | Missing env vars |

---

## 🧪 Testing Checklist

```typescript
// Unit Tests
✓ VariantImage.create() validates inputs
✓ ProductVariant.addImage() validates < 6
✓ ProductVariant.getImages() returns sorted
✓ ProductVariant.getPrimaryImage() finds position 1

// Integration Tests
✓ Save image to DB
✓ Fetch images with variant
✓ Auto-position assignment works
✓ Position uniqueness enforced

// E2E Tests
✓ Full upload flow (presigned → upload → confirm)
✓ Multiple images (1-6)
✓ Verify can't add 7th
✓ Primary image appears in response
```

---

## 📚 File References

| What | Where |
|------|-------|
| **Value Object** | `domain/value-objects/variant-image.ts` |
| **Entity** | `domain/entities/product-variant.entity.ts` |
| **DTOs** | `interfaces/http/dtos/{request,response}/` |
| **Commands** | `application/commands/` |
| **Handlers** | `application/commands/handlers/` |
| **Mappers** | `infrastructure/persistence/mappers/` |
| **Repository** | `infrastructure/persistence/repositories/` |
| **Cloudinary Service** | `shared/infrastructure/storage/cloudinary/` |

---

## 🎓 Concepts

### Value Object
- Immutable image representation
- No setters, only getters
- Factory methods: `create()`, `from()`
- Should be treated as immutable data

### Aggregate Root
- ProductVariant is the aggregate root
- Owns and manages VariantImage collection
- Enforces business rules (max 6 images)
- Only variant can modify images

### Repository
- Abstracts DB access
- Image-specific methods:
  - `getNextImagePosition()` - Auto-position
  - `saveVariantImage()` - Persist
  - `deleteVariantImage()` - Remove
  - `findVariantImages()` - Query

---

## 💡 Best Practices

1. **Always use primary image for thumbnails** - Position 1 is reserved
2. **Don't reorder positions** - Let users control order
3. **Validate at domain level** - Not just API level
4. **Load images eagerly** - Prevent N+1 queries
5. **Use presigned URLs** - Never expose credentials
6. **Delete rarely** - Preserve user's intended order

---

**Last Updated**: February 3, 2026  
**Version**: 1.0  
**Status**: Production Ready ✅
