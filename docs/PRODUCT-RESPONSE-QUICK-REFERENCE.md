# Product Response DTOs - Quick Reference

## 📋 When to Use Which DTO

```typescript
// 1. HOMEPAGE/LISTINGS - Fast & Lightweight
GET /products
→ ProductWithVariantPreviewDto[]
{
  id, name, brand,
  variant: { id, name, price, finalPrice, stock, imageUrl }
}
Use: Homepage, category listings, search results

// 2. BASIC PRODUCT VIEW - With Category
GET /products/:id
→ ProductWithCategoryDto
{
  id, name, description, brand, status,
  category: { id, name, status }
}
Use: Product info card, seller product list

// 3. FULL PRODUCT DETAIL - Everything
GET /products/:id/with-variants
→ ProductDetailDto
{
  id, name, description, brand, status,
  category: { id, name, status },
  variants: [{ id, name, price, images: [...], ... }]
}
Use: Product detail page, variant selector
```

---

## 🎯 DTO Comparison Table

| DTO | Category | Variants | Images | Use Case |
|-----|----------|----------|--------|----------|
| `ProductResponseDto` | ❌ | ❌ | ❌ | Admin/basic list |
| `ProductWithVariantPreviewDto` | ❌ | ✅ First only | ✅ First only | Homepage |
| `ProductWithCategoryDto` | ✅ | ❌ | ❌ | Product + Category |
| `ProductDetailDto` | ✅ | ✅ All | ✅ All | Full detail page |

---

## 🔧 Factory Methods

### ProductWithVariantPreviewDto
```typescript
ProductWithVariantPreviewDto.fromDomain(
  product: Product,
  variant: ProductVariant
)
```

### ProductWithCategoryDto
```typescript
ProductWithCategoryDto.fromDomain(
  product: Product,
  category: Category
)
```

### ProductDetailDto
```typescript
ProductDetailDto.fromDomain(
  product: Product,
  category: Category,
  variants: ProductVariant[]
)
```

---

## 🌐 Frontend Integration

### Homepage Product Card
```typescript
import { ProductWithVariantPreviewDto } from '@/api/generated';

interface ProductCardProps {
  product: ProductWithVariantPreviewDto;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <div>
      <img src={product.variant.imageUrl} />
      <h3>{product.name}</h3>
      <p>{product.brand}</p>
      <span>${product.variant.finalPrice}</span>
      {product.variant.discountPercent > 0 && (
        <del>${product.variant.price}</del>
      )}
    </div>
  );
}
```

### Product Detail Page
```typescript
import { ProductDetailDto } from '@/api/generated';

interface ProductDetailProps {
  product: ProductDetailDto;
}

function ProductDetail({ product }: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <span>Category: {product.category.name}</span>
      
      {/* Variant Selector */}
      <div>
        {product.variants.map(variant => (
          <button key={variant.id} onClick={() => setSelectedVariant(variant)}>
            {variant.variantName} - ${variant.finalPrice}
          </button>
        ))}
      </div>
      
      {/* Image Gallery */}
      <div>
        {selectedVariant.images.map((img, i) => (
          <img key={i} src={img} />
        ))}
      </div>
    </div>
  );
}
```

---

## 🎨 API Usage Examples

### Fetch Products for Homepage
```typescript
const response = await fetch('/api/products?page=1&limit=12');
const data: HttpPaginatedResponse<ProductWithVariantPreviewDto[]> = await response.json();

// Display minimal product cards
data.data.forEach(product => {
  console.log(product.name, product.variant.imageUrl);
});
```

### Fetch Product Detail
```typescript
const response = await fetch(`/api/products/${productId}/with-variants`);
const data: HttpResponse<ProductDetailDto> = await response.json();

// Show complete product with all variants
console.log(data.data.name);
console.log(data.data.category.name);
data.data.variants.forEach(v => console.log(v.variantName, v.images));
```

---

## 📊 Performance Considerations

### Lightweight (ProductWithVariantPreviewDto)
- **Size:** ~200 bytes per product
- **Images:** 1 URL only
- **Variants:** First variant only
- **Best for:** Lists with 10-100 items

### Medium (ProductWithCategoryDto)
- **Size:** ~300 bytes per product
- **Images:** None
- **Variants:** None
- **Best for:** Product info without variants

### Heavy (ProductDetailDto)
- **Size:** ~1-5 KB per product
- **Images:** All images (up to 6 per variant)
- **Variants:** All variants
- **Best for:** Single product detail page

---

## 🔍 Filtering Products with Variants

```typescript
// Public controller automatically filters products with no variants
const data = products
  .filter((p) => p.variants.length > 0)  // Only products with variants
  .map((p) => ProductWithVariantPreviewDto.fromDomain(p.product, p.variants[0]));
```

**Why?** Products without variants can't be purchased, so we exclude them from public listings.

---

## 🧩 Extending DTOs

### Add a new field to ProductWithVariantPreviewDto

1. **Add to DTO:**
```typescript
@ApiPropertyOptional({
  description: 'Average rating',
  example: 4.5,
})
rating?: number;
```

2. **Update factory method:**
```typescript
static fromDomain(product: Product, variant: ProductVariant): ProductWithVariantPreviewDto {
  return {
    // ...existing fields
    rating: product.getRating?.() || undefined,
  };
}
```

3. **Add domain method if needed:**
```typescript
// In Product entity
getRating(): number | null {
  return this.rating;
}
```

---

## ✅ Checklist for New Response DTOs

- [ ] Add Swagger annotations (`@ApiProperty`, `@ApiPropertyOptional`)
- [ ] Add example values in annotations
- [ ] Create static `fromDomain()` factory method
- [ ] Handle nullable fields properly
- [ ] Export from `index.ts`
- [ ] Update controller to use new DTO
- [ ] Document in this guide
- [ ] Test with Swagger UI

---

## 🛠️ Common Issues & Solutions

### Issue: "Category is null"
```typescript
// ❌ Wrong
category: category  // Might be null

// ✅ Correct
category: CategoryNestedDto.fromDomain(category)  // Will throw if null, which is what we want
```

### Issue: "No variants available"
```typescript
// ❌ Wrong
.map((p) => ProductWithVariantPreviewDto.fromDomain(p.product, p.variants[0]))  // Crashes if no variants

// ✅ Correct
.filter((p) => p.variants.length > 0)  // Filter first
.map((p) => ProductWithVariantPreviewDto.fromDomain(p.product, p.variants[0]))
```

### Issue: "Images array is empty"
```typescript
// VariantPreviewDto handles this:
imageUrl: images.length > 0 ? images[0] : null  // Returns null if no images
```

---

## 📚 Related Documentation

- [PRODUCT-RESPONSE-REFACTORING-COMPLETE.md](./PRODUCT-RESPONSE-REFACTORING-COMPLETE.md) - Full implementation details
- [PRODUCT-VARIANT-API-UI-GUIDE.md](./PRODUCT-VARIANT-API-UI-GUIDE.md) - API usage guide
- [DDD-ARCHITECTURE-DIAGRAMS.md](./DDD-ARCHITECTURE-DIAGRAMS.md) - Architecture overview

---

## 🎓 Key Takeaways

1. **Use the right DTO for the right use case**
   - Don't fetch all data if you only need a preview
   - Don't repeat queries - fetch what you need once

2. **DTOs are presentation layer only**
   - Never use DTOs in domain or application layers
   - Always map from domain entities to DTOs in controllers

3. **Factory methods keep mapping clean**
   - `fromDomain()` static methods centralize mapping logic
   - Easy to test and maintain

4. **Swagger annotations are mandatory**
   - Frontend needs accurate types
   - API documentation is auto-generated

5. **Filter before mapping**
   - Remove invalid products before creating DTOs
   - Prevents null reference errors

---

## 🚀 Quick Start Workflow

1. **Identify use case:** Homepage? Detail page? Admin?
2. **Choose DTO:** Use table above
3. **Fetch data:** Call appropriate endpoint
4. **Map to DTO:** Use factory method
5. **Return response:** With proper message and structure

**That's it!** 🎉
