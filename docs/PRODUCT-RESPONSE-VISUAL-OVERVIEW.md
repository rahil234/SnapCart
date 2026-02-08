# Product Response DTOs - Visual Overview

## 🗺️ Architecture Map

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT APPLICATIONS                          │
│  (Web App, Mobile App, Admin Dashboard)                         │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/REST
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    INTERFACE LAYER (DTOs)                        │
│                                                                   │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │ ProductPublic        │  │ Product              │            │
│  │ Controller           │  │ Controller           │            │
│  └──────────────────────┘  └──────────────────────┘            │
│            │                         │                           │
│            │ Maps to DTOs            │ Maps to DTOs             │
│            ▼                         ▼                           │
│  ┌─────────────────────────────────────────────────────┐        │
│  │           RESPONSE DTOs                             │        │
│  │  • ProductWithVariantPreviewDto (Homepage)          │        │
│  │  • ProductWithCategoryDto (Basic + Category)        │        │
│  │  • ProductDetailDto (Full Detail)                   │        │
│  │  • ProductResponseDto (Admin List)                  │        │
│  └─────────────────────────────────────────────────────┘        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER (CQRS)                       │
│                                                                   │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │ GetProductsQuery     │  │ GetProductByIdQuery  │            │
│  │ Handler              │  │ Handler              │            │
│  └──────────────────────┘  └──────────────────────┘            │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │ GetVariantsByProduct │  │ GetCategoryByIdQuery │            │
│  │ IdQuery Handler      │  │ Handler              │            │
│  └──────────────────────┘  └──────────────────────┘            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DOMAIN LAYER                                │
│                                                                   │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │ Product Entity       │  │ ProductVariant       │            │
│  │ (Aggregate Root)     │  │ Entity               │            │
│  └──────────────────────┘  └──────────────────────┘            │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │ Category Entity      │  │ ProductRepository    │            │
│  │                      │  │ Interface            │            │
│  └──────────────────────┘  └──────────────────────┘            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE LAYER                            │
│                                                                   │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │ PrismaProduct        │  │ PrismaCategory       │            │
│  │ Repository           │  │ Repository           │            │
│  └──────────────────────┘  └──────────────────────┘            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                        DATABASE
```

---

## 📊 DTO Decision Tree

```
Need to show products?
│
├─ YES → What information do you need?
│        │
│        ├─ Minimal preview (homepage, listings)
│        │  └─ ProductWithVariantPreviewDto ✅
│        │     • Product basics (id, name, brand)
│        │     • First variant only
│        │     • Single image
│        │     • Fast & lightweight
│        │
│        ├─ Product with category info
│        │  └─ ProductWithCategoryDto ✅
│        │     • Product details
│        │     • Category populated
│        │     • No variants
│        │
│        ├─ Full product details
│        │  └─ ProductDetailDto ✅
│        │     • Complete product info
│        │     • Category populated
│        │     • All variants
│        │     • All images
│        │
│        └─ Admin/basic list
│           └─ ProductResponseDto ✅
│              • Basic product info
│              • No relations
│
└─ NO → See variant or category DTOs
```

---

## 🔄 Data Flow Diagram

### Homepage Listing (ProductWithVariantPreviewDto)

```
┌─────────────┐
│   Client    │
│  GET /api/  │
│  products   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│  ProductPublicController    │
│  findAll()                  │
│  ┌───────────────────────┐  │
│  │ 1. Execute query      │  │
│  │    GetProductsQuery   │  │
│  └───────────────────────┘  │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  GetProductsHandler         │
│  ┌───────────────────────┐  │
│  │ 2. Call repository    │  │
│  │    findProducts       │  │
│  │    ForCatalog()       │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ 3. Return:            │  │
│  │    {                  │  │
│  │      product,         │  │
│  │      variants[]       │  │
│  │    }                  │  │
│  └───────────────────────┘  │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  ProductPublicController    │
│  ┌───────────────────────┐  │
│  │ 4. Filter products    │  │
│  │    with variants      │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ 5. Map to DTO:        │  │
│  │    ProductWithVariant │  │
│  │    PreviewDto         │  │
│  │    .fromDomain(       │  │
│  │      product,         │  │
│  │      variants[0]      │  │
│  │    )                  │  │
│  └───────────────────────┘  │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────┐
│   Client    │
│ Receives:   │
│ [           │
│   {         │
│     id,     │
│     name,   │
│     brand,  │
│     variant:│
│     {       │
│       ...   │
│       imageUrl│
│     }       │
│   }         │
│ ]           │
└─────────────┘
```

---

### Product Detail Page (ProductDetailDto)

```
┌─────────────┐
│   Client    │
│  GET /api/  │
│  products/  │
│  {id}/with- │
│  variants   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│  ProductPublicController    │
│  getProductWithVariants()   │
│  ┌───────────────────────┐  │
│  │ 1. Get product        │  │
│  │    GetProductById     │  │
│  │    Query              │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ 2. Get category       │  │
│  │    GetCategoryById    │  │
│  │    Query              │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ 3. Get variants       │  │
│  │    GetVariantsBy      │  │
│  │    ProductIdQuery     │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ 4. Map to             │  │
│  │    ProductDetailDto   │  │
│  │    .fromDomain(       │  │
│  │      product,         │  │
│  │      category,        │  │
│  │      variants[]       │  │
│  │    )                  │  │
│  └───────────────────────┘  │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────┐
│   Client    │
│ Receives:   │
│ {           │
│   id,       │
│   name,     │
│   category: │
│   {         │
│     id,     │
│     name    │
│   },        │
│   variants: │
│   [         │
│     {       │
│       images│
│       [...]│
│     }       │
│   ]         │
│ }           │
└─────────────┘
```

---

## 🎨 DTO Structure Comparison

```
┌─────────────────────────────────────────────────────────────────┐
│                    ProductResponseDto                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ id, name, description, brand                              │  │
│  │ categoryId (just ID, not populated)                       │  │
│  │ status, isActive, isInCatalog                             │  │
│  │ createdAt, updatedAt                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              ProductWithVariantPreviewDto                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ id, name, brand                                           │  │
│  │ variant: VariantPreviewDto {                              │  │
│  │   id, variantName, price, discountPercent, finalPrice,   │  │
│  │   stock, imageUrl (single), availableForPurchase         │  │
│  │ }                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ⚡ LIGHTWEIGHT - Perfect for lists                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                 ProductWithCategoryDto                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ id, name, description, brand                              │  │
│  │ status, isActive, isInCatalog                             │  │
│  │ category: CategoryNestedDto {                             │  │
│  │   id, name, status                                        │  │
│  │ }                                                          │  │
│  │ createdAt, updatedAt                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│  📦 MEDIUM - Product info with category                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    ProductDetailDto                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ id, name, description, brand                              │  │
│  │ status, isActive                                          │  │
│  │ category: CategoryNestedDto {                             │  │
│  │   id, name, status                                        │  │
│  │ }                                                          │  │
│  │ variants: VariantResponseDto[] {                          │  │
│  │   id, variantName, price, discountPercent, finalPrice,   │  │
│  │   stock, status, isActive, inStock,                       │  │
│  │   availableForPurchase, sellerProfileId,                 │  │
│  │   attributes, images: string[] (all images),             │  │
│  │   createdAt, updatedAt                                    │  │
│  │ }                                                          │  │
│  │ createdAt, updatedAt                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│  🔥 COMPLETE - Full product details                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Performance Comparison

```
Response Size Comparison (Approximate):

ProductResponseDto
▓░░░░░░░░░ 250 bytes
Use: Admin lists, basic catalog

ProductWithVariantPreviewDto
▓▓░░░░░░░░ 400 bytes
Use: Homepage, search results, category pages

ProductWithCategoryDto
▓▓░░░░░░░░ 450 bytes
Use: Product info cards, seller views

ProductDetailDto
▓▓▓▓▓▓▓▓▓▓ 2-5 KB
Use: Product detail page only
```

---

## 📍 File Locations

```
apps/api/src/modules/product/interfaces/http/dtos/response/
├── index.ts                              ← Export all DTOs
├── product-response.dto.ts               ← Basic product DTO
├── product-with-variant-preview.dto.ts   ← 🆕 Homepage DTO
├── product-with-category.dto.ts          ← 🆕 Product + Category
├── product-detail.dto.ts                 ← 🆕 Full detail DTO
├── variant-response.dto.ts               ← Variant DTO
└── product-with-variants-response.dto.ts ← Legacy (consider deprecating)
```

---

## 🎯 Use Case Matrix

| Use Case | Endpoint | DTO | Category | Variants | Images |
|----------|----------|-----|----------|----------|--------|
| Homepage Grid | `GET /products` | `ProductWithVariantPreviewDto` | ❌ | First | First |
| Search Results | `GET /products?search=x` | `ProductWithVariantPreviewDto` | ❌ | First | First |
| Category Page | `GET /products?categoryId=x` | `ProductWithVariantPreviewDto` | ❌ | First | First |
| Product Card Info | `GET /products/:id` | `ProductWithCategoryDto` | ✅ | ❌ | ❌ |
| Product Detail Page | `GET /products/:id/with-variants` | `ProductDetailDto` | ✅ | All | All |
| Seller Product List | `GET /products` | `ProductResponseDto` | ❌ | ❌ | ❌ |
| Admin Dashboard | `GET /products` | `ProductResponseDto` | ❌ | ❌ | ❌ |

---

## 🧩 Integration Examples

### React Query Hook
```typescript
// Homepage products
export const useProducts = (page = 1) => {
  return useQuery({
    queryKey: ['products', page],
    queryFn: async () => {
      const response = await fetch(`/api/products?page=${page}&limit=12`);
      const data: HttpPaginatedResponse<ProductWithVariantPreviewDto[]> = 
        await response.json();
      return data;
    }
  });
};

// Product detail
export const useProductDetail = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}/with-variants`);
      const data: HttpResponse<ProductDetailDto> = await response.json();
      return data.data;
    }
  });
};
```

### Next.js Page
```typescript
// app/products/page.tsx
export default async function ProductsPage() {
  const response = await fetch('http://localhost:3000/api/products');
  const { data }: { data: ProductWithVariantPreviewDto[] } = 
    await response.json();
  
  return (
    <div className="grid grid-cols-4 gap-4">
      {data.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// app/products/[id]/page.tsx
export default async function ProductPage({ params }: { params: { id: string } }) {
  const response = await fetch(
    `http://localhost:3000/api/products/${params.id}/with-variants`
  );
  const { data }: { data: ProductDetailDto } = await response.json();
  
  return <ProductDetail product={data} />;
}
```

---

## ✅ Implementation Checklist

- [x] Created `CategoryNestedDto` for embedded category info
- [x] Created `VariantPreviewDto` for lightweight variant preview
- [x] Created `ProductWithVariantPreviewDto` for homepage
- [x] Created `ProductWithCategoryDto` for product + category
- [x] Created `ProductDetailDto` for complete details
- [x] Updated `GetProductsResult` to include variants
- [x] Updated `GetProductsHandler` to return products with variants
- [x] Updated `ProductPublicController.findAll()` to use preview DTO
- [x] Updated `ProductPublicController.findOne()` to use category DTO
- [x] Updated `ProductPublicController.getProductWithVariants()` to use detail DTO
- [x] Updated `ProductController.findAll()` to handle new structure
- [x] Created `index.ts` for DTO exports
- [x] Added Swagger annotations to all DTOs
- [x] Zero compilation errors
- [x] Created comprehensive documentation

---

## 🎉 Summary

**3 New DTOs** created to support different presentation needs:
1. **ProductWithVariantPreviewDto** - Fast & lightweight for listings
2. **ProductWithCategoryDto** - Product with category info
3. **ProductDetailDto** - Complete product details

**Clean Architecture Preserved:**
- ✅ Domain layer untouched
- ✅ Application layer minimal changes
- ✅ Interface layer handles all presentation logic
- ✅ DTOs never leak into domain/application layers

**Performance Optimized:**
- ✅ Homepage loads minimal data
- ✅ Detail pages load complete data on-demand
- ✅ Proper filtering of products without variants

**Type-Safe & Documented:**
- ✅ Full Swagger annotations
- ✅ Auto-generated TypeScript types for frontend
- ✅ Comprehensive documentation

🚀 **Ready for production!**
