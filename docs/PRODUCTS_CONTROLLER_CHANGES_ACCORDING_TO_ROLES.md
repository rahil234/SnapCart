# Product Management Architecture (Marketplace)

This document defines the **final product architecture** for a multi-vendor marketplace
with **Customers, Sellers, and Admins**.

The goals are:
- Clear separation of intent (browse vs manage vs govern)
- Minimal but explicit authorization rules
- CQRS-aligned commands and queries

---

## 1. High-Level Concepts

### Roles
- **CUSTOMER** – public user
- **SELLER** – owns products
- **ADMIN** – governs marketplace

### Core Principles
- Browsing is **visibility-based**
- Dashboards are **ownership-based**
- Admins govern **status and moderation**, not seller business logic
- Authorization is enforced via **Policy + Intent**, not field guessing

---

## 2. Route Structure (FINAL)

### 2.1 Marketplace (Public Browsing)

**Controller:** `ProductPublicController`  
**Base route:** `/products`

```http
GET    /products
GET    /products/:id
GET    /products/:id/with-variants
GET    /products/search
GET    /products/top
```

**Rules**
- Only `ACTIVE` products are visible
- Same response shape for all roles
- Role-aware filtering handled in Query layer

---

### 2.2 Seller Dashboard (Ownership-Based)

**Controller:** `SellerProductController`  
**Base route:** `/seller/products`

```http
GET    /seller/products
POST   /seller/products
PATCH  /seller/products/:id
PATCH  /seller/products/:id/activate
PATCH  /seller/products/:id/deactivate
```

**Rules**
- Seller sees **only their own products**
- All statuses visible (`DRAFT`, `INACTIVE`, `ACTIVE`, `DISCONTINUED`)
- Seller can edit **only owned products**
- Seller cannot permanently discontinue products

---

### 2.3 Admin Panel (Governance)

**Controller:** `AdminProductController`  
**Base route:** `/admin/products`

```http
GET    /admin/products
PATCH  /admin/products/:id/status
PATCH  /admin/products/:id/discontinue
```

**Rules**
- Admin sees **all products**
- Admin can only:
  - Change product status
  - Permanently discontinue products
- Admin cannot edit pricing or variants

---

## 3. Commands (Write Side)

### Seller Commands
- `CreateProductCommand`
- `UpdateProductCommand`
- `ActivateProductCommand`
- `DeactivateProductCommand`

### Admin Commands
- `UpdateProductStatusCommand`
- `DiscontinueProductCommand`

---

## 4. Queries (Read Side)

### Public Queries
- `GetProductsQuery`
- `GetProductByIdQuery`
- `GetProductWithVariantsQuery`
- `SearchProductsQuery`
- `GetTopProductsQuery`

### Seller Queries
- `GetSellerProductsQuery`

### Admin Queries
- `GetAdminProductsQuery`

---

## 5. Product Edit Intent

```ts
SELLER_UPDATE
ADMIN_STATUS_UPDATE
```

Intent is **explicit**, not inferred from fields.

---

## 6. Product Policy Rules

### Seller
- Must own the product
- Allowed intent: `SELLER_UPDATE`

### Admin
- Allowed intent: `ADMIN_STATUS_UPDATE`
- Allowed field: `status` only

Any violation must throw `ForbiddenException`.

---

## 7. Golden Rules

- `/products` = marketplace
- `/seller/*` = ownership
- `/admin/*` = governance

- Reads use visibility rules
- Writes use ownership + intent
- Admin starts restricted and expands later

---

**This document is authoritative and ready for implementation.**
