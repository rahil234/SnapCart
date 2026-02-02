# Product-Variant Architecture - Quick Reference

## 🎯 Core Principle

**Products are NOT sellable. ProductVariants are the unit of commerce.**

---

## 📦 Data Model

```
Product (Catalog Identity)
├── id, name, description
├── categoryId, brand
├── status: active | inactive | discontinued
└── Has Many → ProductVariants

ProductVariant (Sellable Unit)
├── id, productId, sku (unique)
├── variantName (e.g., "1kg", "500ml")
├── price, discountPercent
├── stock, status
├── sellerProfileId
└── Belongs To → Product

CartItem
└── variantId (not productId)
```

---

## 🔧 API Quick Reference

### Products (Identity)
```
POST   /admin/products                  # Create catalog entry
PATCH  /admin/products/:id              # Update identity
GET    /admin/products/:id              # Get product
```

### Variants (Commerce)
```
POST   /admin/products/:pid/variants    # Add variant
PATCH  /admin/variants/:id              # Update variant
PATCH  /admin/variants/:id/stock        # Stock ops
GET    /admin/products/:pid/variants    # List variants
```

---

## 💻 Usage Examples

### 1. Create Product (Catalog Entry)
```typescript
POST /admin/products
{
  "name": "Basmati Rice",
  "description": "Premium long-grain rice",
  "categoryId": "cat_123",
  "brand": "India Gate"
}
```

**Result**: Product in catalog (NOT sellable yet)

---

### 2. Add Variants (Make it Sellable)
```typescript
POST /admin/products/prod_456/variants
{
  "sku": "BAS-1KG-001",
  "variantName": "1kg",
  "price": 120.00,
  "stock": 100,
  "discountPercent": 10,
  "sellerProfileId": "seller_789"
}
```

**Result**: Variant created (NOW customers can buy it)

---

### 3. Update Product Info
```typescript
PATCH /admin/products/prod_456
{
  "name": "Premium Basmati Rice",
  "description": "Extra long grain premium rice"
}
```

**What you CAN update**: name, description, brand, category
**What you CANNOT update**: price, stock, discount (those are on variants)

---

### 4. Update Variant Price
```typescript
PATCH /admin/variants/var_789
{
  "price": 125.00,
  "discountPercent": 15
}
```

---

### 5. Stock Management
```typescript
PATCH /admin/variants/var_789/stock
{
  "action": "add",     // or "set" or "reduce"
  "quantity": 50
}
```

**Actions**:
- `set`: stock = 50 (absolute)
- `add`: stock += 50 (restock)
- `reduce`: stock -= 50 (manual reduction)

---

## 🔒 Business Rules Cheat Sheet

### Product Rules
| Action | Allowed? | Notes |
|--------|----------|-------|
| Create without variants | ✅ | But not sellable yet |
| Change name/description | ✅ | Anytime if not deleted |
| Change category | ✅ | Only if not discontinued |
| Discontinue | ✅ | One-way operation |
| Delete | ✅ | Soft delete |

### Variant Rules
| Action | Allowed? | Notes |
|--------|----------|-------|
| Create without stock | ✅ | Status = out_of_stock |
| Change price | ✅ | Anytime |
| Change SKU | ❌ | Immutable |
| Stock to 0 | ✅ | Auto status = out_of_stock |
| Negative stock | ❌ | Validation error |

---

## 🎨 Entity Method Quick Reference

### Product Entity
```typescript
// Factory
Product.create(name, desc, categoryId, brand)

// Updates
product.updateInfo(name, desc, brand)
product.changeCategory(categoryId)  // Only if not discontinued

// Status
product.activate()
product.deactivate()
product.discontinue()  // One-way!

// Query
product.isActive()
product.isInCatalog()
```

### ProductVariant Entity
```typescript
// Factory
ProductVariant.create(productId, sku, name, price, stock, ...)

// Pricing
variant.updatePrice(newPrice)
variant.applyDiscount(percent)
variant.removeDiscount()
variant.calculateFinalPrice()  // Computed

// Stock
variant.updateStock(quantity)  // Absolute
variant.addStock(quantity)     // Restock
variant.reduceStock(quantity)  // Returns bool

// Status
variant.activate()
variant.deactivate()
variant.softDelete()

// Query
variant.isAvailableForPurchase()  // All checks
variant.canFulfillQuantity(qty)
variant.isInStock()
```

---

## 📊 Editability Matrix

| Field | On Product | On Variant | Immutable |
|-------|------------|------------|-----------|
| name | ✅ | ❌ | |
| description | ✅ | ❌ | |
| brand | ✅ | ❌ | |
| category | ✅* | ❌ | |
| price | ❌ | ✅ | |
| discount | ❌ | ✅ | |
| stock | ❌ | ✅ | |
| seller | ❌ | ✅ | |
| SKU | ❌ | ❌ | ✅ |
| productId | | ❌ | ✅ |

`*` Cannot change if discontinued

---

## 🧠 Mental Model

### Grocery Store Analogy

**Product = Shelf Tag**
- "Basmati Rice"
- Category: Grains
- Description: "Premium rice"

**Variant = Price Tag**
- "500g @ ₹65"
- "1kg @ ₹120"
- "5kg @ ₹550"

**Customer Action**
- Browses: Product (catalog)
- Adds to cart: Variant (specific size/price)
- Purchases: Variant

---

## 🔄 Status Transitions

### Product Status
```
Created → ACTIVE (in catalog)
    ↓
ACTIVE ↔ INACTIVE (toggle)
    ↓
DISCONTINUED (permanent)
```

### Variant Status
```
Created → ACTIVE (if stock > 0)
    ↓
ACTIVE ↔ INACTIVE (admin control)
    ↓
ACTIVE ↔ OUT_OF_STOCK (auto: stock = 0)
    ↓
DELETED (soft delete)
```

---

## 🚫 Common Mistakes to Avoid

### ❌ DON'T
```typescript
// DON'T put price on Product
product.price = 120  // ❌

// DON'T reference Product in cart
cartItem.productId  // ❌

// DON'T update SKU
variant.sku = "new-sku"  // ❌
```

### ✅ DO
```typescript
// DO put price on Variant
variant.price = 120  // ✅

// DO reference Variant in cart
cartItem.variantId  // ✅

// DO create new variant if SKU needs change
ProductVariant.create(..., newSku, ...)  // ✅
```

---

## 💾 Database Quick Check

### Check Products without Variants
```sql
SELECT p.id, p.name
FROM "Product" p
LEFT JOIN "ProductVariant" v ON v."productId" = p.id
WHERE v.id IS NULL;
```

### Check Duplicate SKUs
```sql
SELECT sku, COUNT(*)
FROM "ProductVariant"
GROUP BY sku
HAVING COUNT(*) > 1;
```

### Check Cart Items with Invalid Variants
```sql
SELECT c.id
FROM "CartItem" c
LEFT JOIN "ProductVariant" v ON v.id = c."variantId"
WHERE v.id IS NULL;
```

---

## 🎯 When to Use What

| Goal | Entity | Method/Field |
|------|--------|--------------|
| Add new item to store | Product | `Product.create()` |
| Make item purchasable | Variant | `ProductVariant.create()` |
| Change description | Product | `product.updateInfo()` |
| Change price | Variant | `variant.updatePrice()` |
| Apply discount | Variant | `variant.applyDiscount()` |
| Manage inventory | Variant | `variant.updateStock()` |
| Hide from catalog | Product | `product.deactivate()` |
| Make unavailable | Variant | `variant.deactivate()` |
| Check availability | Variant | `variant.isAvailableForPurchase()` |

---

## 📝 Migration Checklist

- [ ] Backup production database
- [ ] Run Prisma migration
- [ ] Execute data migration script
- [ ] Verify all products have variants
- [ ] Verify cart items reference valid variants
- [ ] Check for duplicate SKUs
- [ ] Test product creation
- [ ] Test variant creation
- [ ] Test cart functionality
- [ ] Test checkout flow
- [ ] Deploy backend
- [ ] Monitor errors
- [ ] Update frontend

---

## 🔗 Related Documents

- `PRODUCT-VARIANT-REFACTOR-COMPLETE.md` - Full design (20+ pages)
- `MIGRATION-GUIDE-PRODUCT-VARIANT.md` - Step-by-step migration
- `PRODUCT-VARIANT-IMPLEMENTATION-SUMMARY.md` - What was delivered

---

## 🆘 Quick Troubleshooting

### Problem: "Product has no variants"
**Solution**: Create at least one variant for the product

### Problem: "SKU already exists"
**Solution**: Use unique SKU for each variant

### Problem: "Cart item variant not found"
**Solution**: Migrate cart items to reference valid variants

### Problem: "Cannot change category"
**Solution**: Check if product is discontinued

### Problem: "Stock became negative"
**Solution**: Use `canFulfillQuantity()` before reducing stock

---

**Remember**: Products are catalog entries. Variants are what you sell. 🎯
