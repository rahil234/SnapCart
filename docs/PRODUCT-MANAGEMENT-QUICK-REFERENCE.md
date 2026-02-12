# Product Management Architecture - Quick Reference

## Route Overview

### 🌍 Public Routes (Marketplace)
```bash
# Browse products (only ACTIVE)
GET /products?page=1&limit=10&search=shirt&categoryId=uuid

# Get product details
GET /products/:id

# Get product with variants
GET /products/:id/with-variants
```

### 👔 Seller Routes (Dashboard)
```bash
# Get my products (all statuses)
GET /seller/products?page=1&limit=10&search=shirt&status=inactive

# Create product
POST /seller/products
{
  "name": "Product Name",
  "description": "Description",
  "categoryId": "uuid",
  "brand": "Brand Name"
}

# Update product
PATCH /seller/products/:id
{
  "name": "Updated Name",
  "description": "Updated Description"
}

# Activate product
PATCH /seller/products/:id/activate

# Deactivate product
PATCH /seller/products/:id/deactivate
```

### 🛡️ Admin Routes (Governance)
```bash
# Get all products (all statuses)
GET /admin/products?page=1&limit=10&status=discontinued

# Change product status
PATCH /admin/products/:id/status
{
  "status": "active" | "inactive" | "discontinued"
}

# Permanently discontinue
PATCH /admin/products/:id/discontinue
```

---

## Authorization Rules

### Seller Can:
- ✅ View their own products (all statuses)
- ✅ Create products
- ✅ Update their own products (name, description, brand, category)
- ✅ Activate/Deactivate their own products
- ❌ Update products they don't own
- ❌ Permanently discontinue products
- ❌ Change product status directly (must use activate/deactivate)

### Admin Can:
- ✅ View all products (all statuses, all sellers)
- ✅ Change product status (active, inactive, discontinued)
- ✅ Permanently discontinue products
- ❌ Edit product details (name, description, etc.)
- ❌ Create products (not their role)

### Public Can:
- ✅ View ACTIVE products only
- ✅ View product details
- ❌ Create or modify products

---

## Product Statuses

| Status | Description | Visible to Public | Seller Can See | Admin Can See |
|--------|-------------|-------------------|----------------|---------------|
| `active` | Live in marketplace | ✅ Yes | ✅ Yes | ✅ Yes |
| `inactive` | Temporarily hidden | ❌ No | ✅ Yes | ✅ Yes |
| `discontinued` | Permanently removed | ❌ No | ✅ Yes | ✅ Yes |

---

## Product Update Intent

Commands require explicit intent:

```typescript
enum ProductUpdateIntent {
  SELLER_UPDATE = 'SELLER_UPDATE',           // Seller updating details
  ADMIN_STATUS_UPDATE = 'ADMIN_STATUS_UPDATE' // Admin changing status
}
```

---

## Code Examples

### Creating a Product (Seller)
```typescript
const command = new CreateProductCommand(
  'Product Name',
  'Product Description',
  'category-uuid',
  'seller-profile-uuid', // Resolved from user token
  'Brand Name'           // Optional
);

const product = await commandBus.execute(command);
```

### Updating a Product (Seller)
```typescript
const command = new UpdateProductCommand(
  'product-uuid',
  ProductUpdateIntent.SELLER_UPDATE,
  'seller-profile-uuid',
  'Updated Name',        // Optional
  'Updated Description', // Optional
  'Updated Brand',       // Optional
  'new-category-uuid'    // Optional
);

await commandBus.execute(command);
```

### Changing Status (Admin)
```typescript
const command = new UpdateProductStatusCommand(
  'product-uuid',
  ProductStatus.DISCONTINUED
);

await commandBus.execute(command);
```

### Getting Seller Products
```typescript
const query = new GetSellerProductsQuery(
  'seller-profile-uuid',
  1,    // page
  10,   // limit
  '',   // search (optional)
  ''    // status filter (optional)
);

const result = await queryBus.execute(query);
// Returns: { products: Product[], meta: PaginationMeta }
```

---

## Policy Enforcement

The `ProductPolicy` enforces these rules automatically:

```typescript
// Seller update check
canSellerUpdate(sellerProfileId, variants): boolean {
  // Checks if seller owns at least one variant
}

// Admin update check
canAdminPerformIntent(intent): boolean {
  // Only allows ADMIN_STATUS_UPDATE intent
}

// Product modification check
canModifyProduct(product): boolean {
  // Prevents modifying discontinued/deleted products
}
```

---

## Common Errors

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "You do not own any variants of this product"
}
```
**Cause**: Seller trying to update product they don't own

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Sellers cannot directly change product status. Use activate/deactivate endpoints."
}
```
**Cause**: Seller trying to change status field directly

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Product with ID {id} not found"
}
```
**Cause**: Product doesn't exist or is deleted

---

## Migration Notes

### Deprecated Endpoints

| Old Endpoint | New Endpoint | Reason |
|--------------|--------------|--------|
| `POST /products` | `POST /seller/products` | Explicit seller context |
| `PATCH /products/:id` | `PATCH /seller/products/:id` | Ownership validation |
| `PATCH /products/:id/activate` | `PATCH /seller/products/:id/activate` | Explicit seller action |
| `PATCH /products/:id/deactivate` | `PATCH /seller/products/:id/deactivate` | Explicit seller action |
| `PATCH /products/:id/discontinue` | `PATCH /admin/products/:id/discontinue` | Admin-only governance |
| `DELETE /products/:id` | `PATCH /admin/products/:id/status` | Use status change instead |

### Backwards Compatibility

Old endpoints still work but return deprecation warnings in API documentation.

**Timeline**:
- Phase 1 (Current): Both old and new endpoints work
- Phase 2 (Next 3 months): Migrate clients to new endpoints
- Phase 3 (Future): Remove old endpoints

---

## Testing Scenarios

### ✅ Test: Seller sees only their products
```bash
# Seller A creates product
POST /seller/products (as Seller A)

# Seller B queries their products
GET /seller/products (as Seller B)
# Should NOT see Seller A's product
```

### ✅ Test: Seller cannot update other seller's product
```bash
# Seller A creates product
POST /seller/products (as Seller A)
# Returns product with ID

# Seller B tries to update
PATCH /seller/products/:id (as Seller B)
# Should return 403 Forbidden
```

### ✅ Test: Public sees only ACTIVE products
```bash
# Create inactive product
POST /seller/products (status: inactive)

# Public query
GET /products
# Should NOT see inactive product

# Activate product
PATCH /seller/products/:id/activate

# Public query again
GET /products
# Should now see product
```

### ✅ Test: Admin can change any product status
```bash
# Create product as Seller A
POST /seller/products (as Seller A)

# Admin changes status
PATCH /admin/products/:id/status (as Admin)
{ "status": "discontinued" }
# Should succeed
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────┐
│           INTERFACE LAYER                    │
├─────────────────────────────────────────────┤
│  ProductPublicController  (/products)        │
│  SellerProductController  (/seller/products) │
│  AdminProductController   (/admin/products)  │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│        APPLICATION LAYER (CQRS)              │
├─────────────────────────────────────────────┤
│  Commands:                                   │
│    - CreateProductCommand                    │
│    - UpdateProductCommand (with intent)      │
│    - ActivateProductCommand                  │
│    - DeactivateProductCommand                │
│    - DiscontinueProductCommand               │
│    - UpdateProductStatusCommand              │
│                                              │
│  Queries:                                    │
│    - GetProductsQuery                        │
│    - GetSellerProductsQuery                  │
│    - GetAdminProductsQuery                   │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│           DOMAIN LAYER                       │
├─────────────────────────────────────────────┤
│  Product Entity                              │
│  ProductVariant Entity                       │
│  ProductPolicy ← Authorization Rules         │
│  ProductRepository Interface                 │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│      INFRASTRUCTURE LAYER                    │
├─────────────────────────────────────────────┤
│  PrismaProductRepository                     │
│    - findProductsBySellerProfileId()         │
│    - findAllProductsForAdmin()               │
└─────────────────────────────────────────────┘
```

---

**Last Updated**: February 4, 2026  
**Status**: ✅ Implementation Complete  
**Version**: 1.0.0
