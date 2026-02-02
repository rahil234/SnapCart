# Product → Product + Variant Refactor - Complete Design Document

## Executive Summary

This document outlines the transformation from a **Product-centric** to a **Product (Identity) + ProductVariant (Sellable Unit)** architecture for a grocery e-commerce system.

**Key Principle**: 
- **Product** = Catalog Identity (not sellable)
- **ProductVariant** = Commerce Unit (sellable)

---

## 1. PRISMA SCHEMA - Final Design

### Why This Structure?

In grocery/daily-essentials commerce:
- A product like "Basmati Rice" is a catalog concept
- The sellable units are "500g", "1kg", "5kg" variants
- Each variant has independent pricing, stock, and seller
- Customers don't buy "Rice" - they buy "1kg Rice at ₹120"

### Complete Schema

```prisma
enum ProductStatus {
  active        // In catalog, can have variants
  inactive      // Hidden from catalog temporarily
  discontinued  // Permanently removed, cannot reactivate
}

enum VariantStatus {
  active        // Available for purchase
  inactive      // Temporarily unavailable
  out_of_stock  // No inventory
}

// PRODUCT: Identity & Catalog Information ONLY
model Product {
  id          String        @id @default(cuid(2))
  name        String
  description String
  categoryId  String
  status      ProductStatus @default(active)
  brand       String?
  
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  isDeleted   Boolean       @default(false)

  category Category           @relation("CategoryProducts", fields: [categoryId], references: [id])
  variants ProductVariant[]

  @@index([categoryId])
  @@index([status])
}

// PRODUCT VARIANT: The Sellable Commerce Unit
model ProductVariant {
  id              String        @id @default(cuid())
  productId       String
  
  // Identity
  sku             String        @unique
  variantName     String        // "500g", "1kg", "Red-Large"
  
  // Commerce Fields
  price           Float
  discountPercent Float?        @default(0)
  stock           Int           @default(0)
  
  // Status
  status          VariantStatus @default(active)
  isActive        Boolean       @default(true)
  isDeleted       Boolean       @default(false)
  
  // Seller (variants belong to sellers)
  sellerProfileId String?
  sellerProfile   SellerProfile? @relation(fields: [sellerProfileId], references: [id])
  
  // Metadata
  attributes      Json?         // {size: "1kg", color: "red"}
  imageUrl        String?
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  product   Product    @relation(fields: [productId], references: [id], onDelete: Cascade)
  cartItems CartItem[]

  @@index([productId])
  @@index([sellerProfileId])
  @@index([status])
  @@index([isActive])
}

// Cart references ONLY variants (not products)
model CartItem {
  id        String   @id @default(uuid())
  cartId    String
  variantId String   // Only variant, no productId
  quantity  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  cart    Cart           @relation(fields: [cartId], references: [id])
  variant ProductVariant @relation(fields: [variantId], references: [id])
  
  @@unique([cartId, variantId])
  @@index([cartId])
  @@index([variantId])
}
```

### Key Schema Decisions

1. **finalPrice NOT stored**: It's computed (`price - (price * discountPercent / 100)`)
   - **Why**: Computed values can go stale. Calculate on-the-fly for accuracy.
   
2. **SKU is unique**: Each variant needs a globally unique identifier for inventory.

3. **Cascade delete**: Deleting a Product removes all variants (identity gone = variants meaningless).

4. **No Product in CartItem**: Cart references variants directly since those are what customers buy.

5. **Seller on Variant**: Different variants of the same product can be sold by different sellers.

---

## 2. ADMIN API DESIGN (REST)

### Design Philosophy

- **PATCH over PUT**: Partial updates are safer in production
- **Separate endpoints** for Product vs Variant operations
- **Explicit intent**: Endpoint names clearly indicate what changes

### 2.1 Product APIs (Identity Management)

#### Create Product (Catalog Entry)
```
POST /api/admin/products
```

**Purpose**: Create a new product catalog entry (NOT sellable yet)

**Request Body**:
```json
{
  "name": "Basmati Rice",
  "description": "Premium long-grain basmati rice",
  "categoryId": "cat_123",
  "brand": "India Gate"
}
```

**Response**:
```json
{
  "message": "Product created successfully",
  "data": {
    "id": "prod_456",
    "name": "Basmati Rice",
    "status": "active"
  }
}
```

**Note**: After creating a product, you MUST add at least one variant to make it sellable.

---

#### Update Product Information
```
PATCH /api/admin/products/:productId
```

**Purpose**: Update product identity/catalog information

**What CAN be updated**:
- name
- description
- brand
- categoryId (with restrictions)

**Request Body** (all optional):
```json
{
  "name": "Premium Basmati Rice",
  "description": "Extra long grain premium basmati",
  "brand": "India Gate",
  "categoryId": "cat_789"
}
```

**Business Rules**:
- Cannot change category if product is discontinued
- Name and description changes affect all variants
- Does NOT affect pricing/stock (those are variant concerns)

**Why PATCH not PUT**:
- Partial updates prevent accidental data loss
- Client sends only fields they want to change
- Safer for concurrent updates

---

#### Change Product Status
```
PATCH /api/admin/products/:productId/status
```

**Purpose**: Control product lifecycle

**Request Body**:
```json
{
  "status": "inactive" | "active" | "discontinued"
}
```

**Business Rules**:
- `inactive` → `active`: Allowed
- `active` → `discontinued`: Allowed (one-way operation)
- `discontinued` → anything: NOT allowed (permanent)
- Discontinuing a product deactivates all variants

---

### 2.2 Variant APIs (Commerce Management)

#### Add Variant to Product
```
POST /api/admin/products/:productId/variants
```

**Purpose**: Create a sellable unit for a product

**Request Body**:
```json
{
  "sku": "BAS-1KG-001",
  "variantName": "1kg",
  "price": 120.00,
  "stock": 100,
  "discountPercent": 10,
  "sellerProfileId": "seller_123",
  "attributes": {
    "weight": "1kg",
    "packagingType": "sealed"
  },
  "imageUrl": "https://..."
}
```

**Response**:
```json
{
  "message": "Variant created successfully",
  "data": {
    "id": "var_789",
    "sku": "BAS-1KG-001",
    "finalPrice": 108.00,
    "status": "active"
  }
}
```

**Validations**:
- SKU must be unique across all variants
- Price must be > 0
- Stock must be >= 0
- Product must exist and not be discontinued

---

#### Bulk Add Variants
```
POST /api/admin/products/:productId/variants/bulk
```

**Purpose**: Add multiple variants at once (common for grocery items)

**Request Body**:
```json
{
  "variants": [
    {
      "sku": "BAS-500G-001",
      "variantName": "500g",
      "price": 65.00,
      "stock": 200,
      "sellerProfileId": "seller_123"
    },
    {
      "sku": "BAS-1KG-001",
      "variantName": "1kg",
      "price": 120.00,
      "stock": 150,
      "sellerProfileId": "seller_123"
    },
    {
      "sku": "BAS-5KG-001",
      "variantName": "5kg",
      "price": 550.00,
      "stock": 50,
      "sellerProfileId": "seller_123"
    }
  ]
}
```

---

#### Update Variant
```
PATCH /api/admin/products/variants/:variantId
```

**Purpose**: Modify commerce attributes of a variant

**What CAN be updated**:
- price
- discountPercent
- stock
- variantName
- attributes
- imageUrl
- sellerProfileId

**What CANNOT be updated**:
- sku (immutable identifier)
- productId (variant belongs to a product permanently)

**Request Body** (all optional):
```json
{
  "price": 125.00,
  "discountPercent": 15,
  "stock": 80,
  "variantName": "1kg Premium",
  "attributes": {
    "weight": "1kg",
    "organic": true
  }
}
```

**Why PATCH**:
- Admin might only want to update stock (don't need to send price, discount, etc.)
- Reduces risk of overwriting unintended fields
- Better for mobile/slow networks (smaller payload)

---

#### Update Variant Stock
```
PATCH /api/admin/products/variants/:variantId/stock
```

**Purpose**: Dedicated endpoint for stock updates (most frequent operation)

**Request Body**:
```json
{
  "action": "set" | "add" | "reduce",
  "quantity": 50
}
```

**Examples**:
- `set`: Set stock to absolute value → `stock = 50`
- `add`: Restock → `stock += 50`
- `reduce`: Manual reduction → `stock -= 50`

**Auto-status management**:
- If stock becomes 0 → status = "out_of_stock"
- If stock > 0 and was out_of_stock → status = "active"

---

#### Update Variant Pricing
```
PATCH /api/admin/products/variants/:variantId/pricing
```

**Purpose**: Modify pricing strategy

**Request Body**:
```json
{
  "price": 130.00,
  "discountPercent": 20
}
```

**Business Logic**:
- Both fields optional
- `discountPercent: 0` removes discount
- Cannot set negative prices
- finalPrice is auto-calculated: `price * (1 - discountPercent/100)`

---

#### Change Variant Status
```
PATCH /api/admin/products/variants/:variantId/status
```

**Purpose**: Control variant availability

**Request Body**:
```json
{
  "action": "activate" | "deactivate" | "delete"
}
```

**Actions**:
- `activate`: Make available for purchase (if stock > 0)
- `deactivate`: Temporarily unavailable (status = inactive)
- `delete`: Soft delete (isDeleted = true)

---

#### List Variants for a Product
```
GET /api/admin/products/:productId/variants
```

**Purpose**: See all variants (active + inactive)

**Query Parameters**:
```
?status=active|inactive|out_of_stock
&sellerProfileId=seller_123
```

**Response**:
```json
{
  "data": [
    {
      "id": "var_1",
      "sku": "BAS-500G-001",
      "variantName": "500g",
      "price": 65.00,
      "discountPercent": 10,
      "finalPrice": 58.50,
      "stock": 200,
      "status": "active",
      "sellerProfileId": "seller_123"
    },
    {
      "id": "var_2",
      "sku": "BAS-1KG-001",
      "variantName": "1kg",
      "price": 120.00,
      "discountPercent": 0,
      "finalPrice": 120.00,
      "stock": 0,
      "status": "out_of_stock",
      "sellerProfileId": "seller_123"
    }
  ]
}
```

---

## 3. EDITABILITY RULES

### Product (Identity) - What CAN Be Edited

✅ **Always Editable** (if not deleted):
- `name`
- `description`
- `brand`

✅ **Conditionally Editable**:
- `categoryId`: Only if status != discontinued
- `status`: Can move to discontinued (one-way)

❌ **Never Editable**:
- `id`: Immutable identifier
- `createdAt`: Timestamp
- Directly editing price/discount (those are variant concerns)

### ProductVariant (Commerce) - What CAN Be Edited

✅ **Always Editable** (if not deleted):
- `price`
- `discountPercent`
- `stock`
- `variantName`
- `attributes`
- `imageUrl`
- `status` (active ↔ inactive, or delete)
- `sellerProfileId`

❌ **Never Editable**:
- `id`: Immutable identifier
- `sku`: Inventory tracking identifier (must be unique)
- `productId`: Variant belongs to one product permanently
- `createdAt`: Timestamp

### Safe Rules & Constraints

| Operation | Rule | Reason |
|-----------|------|--------|
| Change Product Category | Only if not discontinued | Discontinued products shouldn't be recategorized |
| Delete Product | Cascade deletes variants | Product identity gone = variants meaningless |
| Change Variant SKU | NOT allowed | SKU used in inventory, orders, integrations |
| Seller Change on Variant | Allowed | Different sellers can take over inventory |
| Price Change | Always allowed | Dynamic pricing is core to e-commerce |
| Stock to 0 | Auto-sets status to out_of_stock | Prevents overselling |

---

## 4. MIGRATION STRATEGY

### Current State
```sql
Product table:
- Has price, discount, seller directly
- CartItem references Product
```

### Target State
```sql
Product table:
- No price, discount, seller
- Only identity fields

ProductVariant table:
- Has price, discount, stock, seller
- CartItem references ProductVariant
```

### Migration Steps

#### Step 1: Add ProductVariant Table (Already Done)
```bash
npx prisma migrate dev --name add_product_variant_refactor
```

#### Step 2: Data Migration Script
```typescript
// prisma/migrations/migrate-products-to-variants.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateProductsToVariants() {
  // Get all existing products
  const products = await prisma.product.findMany({
    include: { sellerProfile: true }
  });

  for (const product of products) {
    // Create a default variant for each existing product
    const sku = `DEFAULT-${product.id}`;
    
    await prisma.productVariant.create({
      data: {
        productId: product.id,
        sku: sku,
        variantName: 'Default',
        price: product.price,
        discountPercent: product.discountPercent || 0,
        stock: 100, // Default stock
        status: product.status === 'out_of_stock' ? 'out_of_stock' : 'active',
        isActive: product.status === 'active',
        sellerProfileId: product.sellerProfileId,
      },
    });

    console.log(`Migrated product ${product.id} → variant ${sku}`);
  }

  console.log('Migration complete!');
}

migrateProductsToVariants()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

#### Step 3: Migrate CartItems
```typescript
async function migrateCartItems() {
  const cartItems = await prisma.cartItem.findMany();

  for (const item of cartItems) {
    // Find the default variant for this product
    const variant = await prisma.productVariant.findFirst({
      where: {
        productId: item.productId,
        sku: { startsWith: 'DEFAULT-' },
      },
    });

    if (variant) {
      await prisma.cartItem.update({
        where: { id: item.id },
        data: { variantId: variant.id },
      });
    }
  }
}
```

#### Step 4: Remove Old Columns (Breaking Change)
```prisma
// After migration is verified
model Product {
  // REMOVE these fields:
  // price           Float ❌
  // discountPercent Float? ❌
  // sellerProfileId String? ❌
}
```

#### Step 5: Deploy Strategy (Zero-Downtime)

**Week 1**: Deploy new code with dual support
- Old API still works
- New API available
- Both Product and Variant fields exist

**Week 2**: Migrate data
- Run migration scripts
- Test thoroughly

**Week 3**: Deprecate old APIs
- Add deprecation warnings
- Update documentation

**Week 4**: Remove old fields
- Drop columns from Product table
- Remove old API endpoints

---

## 5. MENTAL MODEL SUMMARY

### Core Concept: Product is NOT Sellable

Think of it like Amazon:

| Concept | Example | What It Is |
|---------|---------|------------|
| **Product** | "Basmati Rice" | Catalog entry, search result, category page |
| **Variant** | "1kg - ₹120" | Shopping cart item, purchase button, inventory unit |

### Why This Matters for Grocery E-Commerce

1. **Flexible Packaging**
   - One product: "Milk"
   - Many variants: "500ml", "1L", "2L"
   - Each has different price, stock, supplier

2. **Multi-Seller Support**
   - Product "Apple" is generic
   - Variant "1kg Kashmir Apples" by Seller A
   - Variant "1kg Shimla Apples" by Seller B
   - Different prices, quality, stock

3. **Dynamic Pricing**
   - Product info stable (brand, description)
   - Variant pricing changes frequently
   - Discount on "1kg" doesn't affect "500g"

4. **Inventory Management**
   - Stock is variant-specific
   - "1kg" out of stock ≠ "500g" unavailable
   - Replenish variants independently

5. **Cart & Orders**
   - Customer adds "1kg Rice" not "Rice"
   - Cart contains variants (SKU-based)
   - Order line items are variants with locked prices

### Product vs Variant Lifecycle

```
Product Lifecycle:
├─ Created → Active (in catalog)
├─ Active → Inactive (hidden, can reactivate)
└─ Active → Discontinued (permanent, no going back)

Variant Lifecycle:
├─ Created → Active (available to buy)
├─ Active → Out of Stock (auto-managed by stock level)
├─ Active → Inactive (admin temporarily disables)
└─ Any → Deleted (soft delete)
```

### When to Use Product vs Variant

| You Want To... | Use | Example |
|----------------|-----|---------|
| Add new item to catalog | Product | "Organic Quinoa" |
| Make it sellable | Variant | "500g - ₹180" |
| Change description | Product | "Premium organic quinoa..." |
| Change price | Variant | ₹180 → ₹160 |
| Apply discount | Variant | 10% off on "1kg" only |
| Manage stock | Variant | 50 units of "1kg" |
| List in category | Product | Show in "Grains" category |
| Add to cart | Variant | Add "1kg - ₹160" |

---

## 6. SCALABILITY & BEST PRACTICES

### Why Variant-First Scales Better

1. **Database Queries**
   - Catalog browsing: Query Products (lighter)
   - Purchase flow: Query Variants (necessary data)
   - No JOIN hell for every operation

2. **Caching Strategy**
   - Cache product catalog separately (changes rarely)
   - Cache variant availability (changes often)
   - Granular cache invalidation

3. **Search & Filtering**
   - Search products by name/description
   - Filter variants by price range, availability
   - Faster queries with proper indexes

4. **Microservices Ready**
   - Product Service: Catalog management
   - Variant Service: Inventory & pricing
   - Clear bounded contexts

---

## 7. API SUMMARY TABLE

| Endpoint | Method | Purpose | Edits What |
|----------|--------|---------|-----------|
| `/admin/products` | POST | Create catalog entry | - |
| `/admin/products/:id` | PATCH | Update identity info | name, description, brand |
| `/admin/products/:id/status` | PATCH | Change lifecycle | status |
| `/admin/products/:id/variants` | POST | Add sellable unit | - |
| `/admin/products/variants/:id` | PATCH | Update commerce attrs | price, stock, discount |
| `/admin/products/variants/:id/stock` | PATCH | Manage inventory | stock |
| `/admin/products/variants/:id/pricing` | PATCH | Update pricing | price, discount |
| `/admin/products/variants/:id/status` | PATCH | Control availability | status |
| `/admin/products/:id/variants` | GET | List all variants | - |

---

## 8. VALIDATION RULES

### Product Creation
```typescript
{
  name: string (required, 1-200 chars)
  description: string (required, 1-2000 chars)
  categoryId: string (required, valid category)
  brand: string (optional, 1-100 chars)
}
```

### Variant Creation
```typescript
{
  sku: string (required, unique, 1-50 chars)
  variantName: string (required, 1-100 chars)
  price: number (required, > 0)
  stock: number (required, >= 0)
  discountPercent: number (optional, 0-100)
  sellerProfileId: string (optional, valid seller)
  attributes: object (optional)
  imageUrl: string (optional, valid URL)
}
```

---

## CONCLUSION

This architecture provides:

✅ **Clear Separation**: Product (what it is) vs Variant (how to buy it)
✅ **Flexibility**: Multiple sizes, prices, sellers per product
✅ **Scalability**: Optimized queries for catalog vs commerce
✅ **Maintainability**: Clean domain boundaries
✅ **Extensibility**: Easy to add nutrition, reviews at product level

The key insight: **Don't sell products. Sell variants.**
