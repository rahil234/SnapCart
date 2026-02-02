# Product & Variant API Documentation for UI Development

## Overview

This API provides complete CRUD operations for Products (catalog) and Variants (sellable units), following DDD principles and designed for optimal UI flows.

### Core Concepts

- **Product**: Catalog identity (name, description, brand, category)
- **Variant**: Sellable unit with pricing, stock, and availability
- **Rule**: Products are NOT directly purchasable. Customers buy Variants.

---

## 📦 Product Endpoints (Catalog Management)

### Base Path: `/products`

---

### 1. Create Product

**Create a new catalog entry (not sellable yet)**

```http
POST /products
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Basmati Rice",
  "description": "Premium long-grain basmati rice",
  "categoryId": "cat_123",
  "brand": "India Gate"
}
```

**Response** (201 Created):
```json
{
  "message": "Product created successfully. Add variants to make it sellable.",
  "data": {
    "id": "prod_456",
    "name": "Basmati Rice",
    "description": "Premium long-grain basmati rice",
    "categoryId": "cat_123",
    "brand": "India Gate",
    "status": "active",
    "isActive": true,
    "isInCatalog": true,
    "createdAt": "2026-02-01T10:00:00Z",
    "updatedAt": "2026-02-01T10:00:00Z"
  }
}
```

**UI Flow**:
1. User fills product form (name, description, category, brand)
2. Submit → Create product
3. Redirect to "Add Variants" page with productId
4. Show warning: "Product created but not sellable yet. Add variants."

---

### 2. List Products (with Pagination & Filters)

**Get all products with optional filtering**

```http
GET /products?page=1&limit=10&search=rice&categoryId=cat_123&status=active
```

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |
| search | string | No | Search by name or description |
| categoryId | string | No | Filter by category |
| status | enum | No | active \| inactive \| discontinued |

**Response** (200 OK):
```json
{
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": "prod_456",
      "name": "Basmati Rice",
      "description": "Premium rice",
      "brand": "India Gate",
      "categoryId": "cat_123",
      "status": "active",
      "isActive": true,
      "isInCatalog": true,
      "createdAt": "2026-02-01T10:00:00Z",
      "updatedAt": "2026-02-01T10:00:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 10
}
```

**UI Components**:
- Product listing table/grid
- Pagination controls
- Search bar
- Category filter dropdown
- Status filter (Active/Inactive/Discontinued)

---

### 3. Get Product by ID

**Get detailed product information**

```http
GET /products/{productId}
```

**Response** (200 OK):
```json
{
  "message": "Product retrieved successfully",
  "data": {
    "id": "prod_456",
    "name": "Basmati Rice",
    "description": "Premium long-grain basmati rice from Punjab",
    "brand": "India Gate",
    "categoryId": "cat_123",
    "status": "active",
    "isActive": true,
    "isInCatalog": true,
    "createdAt": "2026-02-01T10:00:00Z",
    "updatedAt": "2026-02-01T10:00:00Z"
  }
}
```

**UI Flow**:
- Product detail page
- Edit product form (pre-filled)
- Show product status badge

---

### 4. Get Product with Variants (Complete View)

**Get product + all variants (perfect for detail pages)**

```http
GET /products/{productId}/with-variants
```

**Response** (200 OK):
```json
{
  "message": "Product with variants retrieved successfully",
  "data": {
    "product": {
      "id": "prod_456",
      "name": "Basmati Rice",
      "description": "Premium rice",
      "brand": "India Gate",
      "categoryId": "cat_123",
      "status": "active",
      "isActive": true,
      "isInCatalog": true,
      "createdAt": "2026-02-01T10:00:00Z",
      "updatedAt": "2026-02-01T10:00:00Z"
    },
    "variants": [
      {
        "id": "var_123",
        "productId": "prod_456",
        "sku": "BAS-500G-001",
        "variantName": "500g",
        "price": 65.00,
        "discountPercent": 10,
        "finalPrice": 58.50,
        "stock": 200,
        "status": "active",
        "isActive": true,
        "inStock": true,
        "availableForPurchase": true,
        "sellerProfileId": "seller_789",
        "imageUrl": "https://...",
        "createdAt": "2026-02-01T10:00:00Z",
        "updatedAt": "2026-02-01T10:00:00Z"
      },
      {
        "id": "var_124",
        "productId": "prod_456",
        "sku": "BAS-1KG-001",
        "variantName": "1kg",
        "price": 120.00,
        "discountPercent": 0,
        "finalPrice": 120.00,
        "stock": 100,
        "status": "active",
        "isActive": true,
        "inStock": true,
        "availableForPurchase": true,
        "sellerProfileId": "seller_789",
        "imageUrl": "https://...",
        "createdAt": "2026-02-01T10:00:00Z",
        "updatedAt": "2026-02-01T10:00:00Z"
      }
    ]
  }
}
```

**UI Components**:
- Product detail card (top section)
- Variants table/list (below product)
- Price range display: "From ₹58.50"
- Stock summary: "2 variants, 300 units total"
- Add/Edit variant buttons

---

### 5. Update Product

**Update product catalog information**

```http
PATCH /products/{productId}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body** (all fields optional):
```json
{
  "name": "Premium Basmati Rice",
  "description": "Extra long grain premium rice",
  "brand": "India Gate Premium",
  "categoryId": "cat_789",
  "status": "inactive"
}
```

**Response** (200 OK):
```json
{
  "message": "Product updated successfully"
}
```

**UI Flow**:
- Edit product form
- Show all editable fields
- Warning if changing category on discontinued product
- Success toast notification

---

### 6. Activate Product

**Make product visible in catalog**

```http
PATCH /products/{productId}/activate
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
{
  "message": "Product activated successfully"
}
```

**UI Component**:
- Toggle switch or button
- Disabled if product is discontinued

---

### 7. Deactivate Product

**Hide product from catalog (temporary)**

```http
PATCH /products/{productId}/deactivate
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
{
  "message": "Product deactivated successfully"
}
```

**UI Component**:
- Toggle switch or button
- Can be reactivated anytime

---

### 8. Discontinue Product (Permanent)

**Permanently remove from catalog (ONE-WAY OPERATION)**

```http
PATCH /products/{productId}/discontinue
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
{
  "message": "Product discontinued permanently"
}
```

**UI Flow**:
- Show confirmation dialog: "This is permanent and cannot be undone!"
- Require reason input (optional)
- Admin only
- After discontinuation, show "DISCONTINUED" badge

---

### 9. Delete Product (Soft Delete)

**Soft delete product and all variants**

```http
DELETE /products/{productId}
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
{
  "message": "Product deleted successfully"
}
```

**UI Flow**:
- Show confirmation dialog
- Can be restored by admin
- Admin only

---

## 🏷️ Variant Endpoints (Commerce Management)

### Base Path: `/products`

---

### 10. Create Variant

**Add a sellable variant to a product**

```http
POST /products/{productId}/variants
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "sku": "BAS-1KG-001",
  "variantName": "1kg",
  "price": 120.00,
  "stock": 100,
  "discountPercent": 10,
  "sellerProfileId": "seller_789",
  "imageUrl": "https://example.com/images/basmati-1kg.jpg"
}
```

**Response** (201 Created):
```json
{
  "message": "Variant created successfully",
  "data": {
    "id": "var_125",
    "productId": "prod_456",
    "sku": "BAS-1KG-001",
    "variantName": "1kg",
    "price": 120.00,
    "discountPercent": 10,
    "finalPrice": 108.00,
    "stock": 100,
    "status": "active",
    "isActive": true,
    "inStock": true,
    "availableForPurchase": true,
    "sellerProfileId": "seller_789",
    "imageUrl": "https://...",
    "createdAt": "2026-02-01T10:00:00Z",
    "updatedAt": "2026-02-01T10:00:00Z"
  }
}
```

**Validation Rules**:
- ✅ SKU must be unique across ALL variants
- ✅ Price must be > 0
- ✅ Stock must be >= 0
- ✅ Product must exist and not be discontinued

**UI Flow**:
1. "Add Variant" button on product detail page
2. Modal/form with fields: SKU, Name, Price, Stock, Discount, Image
3. SKU validation (check uniqueness)
4. Submit → Create variant
5. Refresh variants list
6. Success message: "Variant created! Product is now sellable."

---

### 11. List Variants for Product

**Get all variants (including inactive)**

```http
GET /products/{productId}/variants
```

**Response** (200 OK):
```json
{
  "message": "Variants retrieved successfully",
  "data": [
    {
      "id": "var_123",
      "sku": "BAS-500G-001",
      "variantName": "500g",
      "price": 65.00,
      "discountPercent": 10,
      "finalPrice": 58.50,
      "stock": 200,
      "status": "active",
      "isActive": true,
      "inStock": true,
      "availableForPurchase": true
    },
    {
      "id": "var_124",
      "sku": "BAS-1KG-001",
      "variantName": "1kg",
      "price": 120.00,
      "discountPercent": 0,
      "finalPrice": 120.00,
      "stock": 0,
      "status": "out_of_stock",
      "isActive": true,
      "inStock": false,
      "availableForPurchase": false
    }
  ]
}
```

**UI Components**:
- Variants table with columns: SKU, Name, Price, Discount, Final Price, Stock, Status, Actions
- Filter by status (All/Active/Inactive/Out of Stock)
- Bulk actions (activate, deactivate, update stock)
- Color coding: Green (in stock), Red (out of stock), Gray (inactive)

---

### 12. Get Variant by ID

**Get detailed variant information**

```http
GET /products/variants/{variantId}
```

**Response** (200 OK):
```json
{
  "message": "Variant retrieved successfully",
  "data": {
    "id": "var_123",
    "productId": "prod_456",
    "sku": "BAS-1KG-001",
    "variantName": "1kg",
    "price": 120.00,
    "discountPercent": 10,
    "finalPrice": 108.00,
    "stock": 100,
    "status": "active",
    "isActive": true,
    "inStock": true,
    "availableForPurchase": true,
    "sellerProfileId": "seller_789",
    "imageUrl": "https://...",
    "createdAt": "2026-02-01T10:00:00Z",
    "updatedAt": "2026-02-01T10:00:00Z"
  }
}
```

---

### 13. Update Variant

**Update variant commerce attributes**

```http
PATCH /products/variants/{variantId}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body** (all fields optional):
```json
{
  "variantName": "1kg Premium",
  "price": 125.00,
  "discountPercent": 15,
  "stock": 80,
  "status": "active",
  "isActive": true,
  "sellerProfileId": "seller_890",
  "imageUrl": "https://..."
}
```

**Response** (200 OK):
```json
{
  "message": "Variant updated successfully"
}
```

**UI Flow**:
- Edit variant modal/form
- Real-time final price calculation
- Submit → Update variant
- Refresh variant in list

---

### 14. Update Variant Stock (Dedicated Endpoint)

**Manage inventory with specific operations**

```http
PATCH /products/variants/{variantId}/stock
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "action": "add",
  "quantity": 50
}
```

**Actions**:
- `set`: Set absolute stock level → `stock = quantity`
- `add`: Add to stock (restock) → `stock += quantity`
- `reduce`: Reduce stock → `stock -= quantity`

**Response** (200 OK):
```json
{
  "message": "Stock add operation completed successfully"
}
```

**Auto-Behavior**:
- ✅ Stock becomes 0 → status changes to "out_of_stock"
- ✅ Stock > 0 (from 0) → status changes to "active"

**UI Components**:
- Quick stock update modal
- Dropdown: Set / Add / Reduce
- Number input for quantity
- Current stock display
- Predicted stock display (before submit)

---

### 15. Activate Variant

**Make variant available for purchase**

```http
PATCH /products/variants/{variantId}/activate
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
{
  "message": "Variant activated successfully"
}
```

**UI Component**:
- Toggle switch (active/inactive)
- Disabled if stock = 0

---

### 16. Deactivate Variant

**Make variant unavailable (temporary)**

```http
PATCH /products/variants/{variantId}/deactivate
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
{
  "message": "Variant deactivated successfully"
}
```

**UI Component**:
- Toggle switch
- Can be reactivated anytime

---

### 17. Delete Variant (Soft Delete)

**Remove variant from sale**

```http
DELETE /products/variants/{variantId}
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
{
  "message": "Variant deleted successfully"
}
```

**UI Flow**:
- Confirmation dialog
- Warning if it's the last variant
- Admin only

---

## 🎨 UI Flow Examples

### Complete Product Creation Flow

```
1. Admin Dashboard
   ↓
2. Click "Add Product"
   ↓
3. Fill Product Form
   - Name: "Basmati Rice"
   - Description: "Premium rice"
   - Category: Select from dropdown
   - Brand: "India Gate"
   ↓
4. Submit → POST /products
   ↓
5. Success → Redirect to "Add Variants" page
   ↓
6. Add First Variant
   - SKU: "BAS-500G-001"
   - Name: "500g"
   - Price: 65
   - Stock: 200
   ↓
7. Submit → POST /products/{id}/variants
   ↓
8. Success → Show "Add More Variants?" dialog
   ↓
9. Add More Variants (1kg, 5kg, etc.)
   ↓
10. Done → Redirect to Product List
```

### Customer Browse & Purchase Flow

```
1. Customer sees product list
   ↓ GET /products
2. Click product → Product detail page
   ↓ GET /products/{id}/with-variants
3. See product info + all variants
   - 500g @ ₹58.50 (10% off)
   - 1kg @ ₹120
   - 5kg @ ₹550
   ↓
4. Select variant (e.g., "1kg")
   ↓
5. Click "Add to Cart"
   ↓ Check: variant.availableForPurchase === true
6. Add variant to cart (variantId, not productId)
   ↓
7. Proceed to checkout
```

### Inventory Management Flow

```
1. Seller Dashboard → Products
   ↓ GET /products?sellerProfileId={id}
2. Click product → Variants tab
   ↓ GET /products/{id}/variants
3. See all variants with stock levels
   ↓
4. Click "Restock" on low-stock variant
   ↓
5. Quick restock modal
   - Action: Add
   - Quantity: 50
   ↓ PATCH /products/variants/{id}/stock
6. Success → Stock updated
   ↓
7. Status auto-changes if needed
```

---

## 📊 Response Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful GET/PATCH/DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input, SKU exists, etc. |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Product/Variant doesn't exist |
| 500 | Server Error | Something went wrong |

---

## 🔐 Authentication

All endpoints except GET (list/detail) require Bearer token:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Roles**:
- **ADMIN**: Full access to all operations
- **SELLER**: Can manage own products/variants
- **CUSTOMER**: Read-only access (public endpoints)

---

## 🎯 Quick Reference

### Product Lifecycle
```
Created → Active (in catalog)
   ↕
Inactive (hidden, can reactivate)
   ↓
Discontinued (permanent, no going back)
```

### Variant Lifecycle
```
Created → Active (available)
   ↕
Inactive (admin toggle)
   ↕
Out of Stock (auto when stock = 0)
```

### Key Validations
- ✅ Product must have at least 1 variant to be sellable
- ✅ SKU must be globally unique
- ✅ Cannot change category if product is discontinued
- ✅ Cannot activate variant if stock = 0
- ✅ Stock operations auto-update status

---

## 💡 Best Practices for UI

1. **Always show final price** (after discount) prominently
2. **Real-time stock indicators**: Color-coded badges
3. **Confirm destructive actions**: Discontinue, Delete
4. **Show variant count** on product cards
5. **Filter by availability** in customer views
6. **Quick actions** in admin tables (stock update, toggle active)
7. **Breadcrumbs**: Product → Variants for navigation
8. **Loading states** for all API calls
9. **Error messages** from API responses
10. **Optimistic updates** for toggle switches

---

**API Version**: 1.0
**Last Updated**: February 1, 2026
**Support**: Check Swagger docs at `/api/docs`
