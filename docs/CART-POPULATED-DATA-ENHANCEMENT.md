# Cart Module - Populated Data Enhancement

## Overview

The Cart module has been enhanced to return **fully populated cart data** including product variants and product information in the GET `/cart` endpoint.

---

## 🎯 What Changed

### Previous Behavior
```json
{
  "id": "cart_123",
  "customerId": "customer_456",
  "items": [
    {
      "id": "item_789",
      "productVariantId": "variant_abc",
      "quantity": 2
    }
  ]
}
```

### New Behavior
```json
{
  "id": "cart_123",
  "customerId": "customer_456",
  "items": [
    {
      "id": "item_789",
      "productVariantId": "variant_abc",
      "quantity": 2,
      "variant": {
        "id": "variant_abc",
        "variantName": "1kg",
        "price": 29.99,
        "discountPercent": 10,
        "finalPrice": 26.99,
        "stock": 100,
        "status": "active",
        "productId": "product_def",
        "productName": "Basmati Rice",
        "productDescription": "Premium quality basmati rice",
        "productBrand": "India Gate",
        "imageUrl": "https://example.com/image.jpg"
      },
      "subtotal": 53.98
    }
  ],
  "totalAmount": 53.98,
  "totalItems": 2,
  "uniqueItemsCount": 1,
  "isEmpty": false
}
```

---

## 📦 New Files Created

### 1. DTOs
**`cart-with-details-response.dto.ts`** - Response DTOs with populated data
- `CartWithDetailsResponseDto` - Cart with all details
- `CartItemWithDetailsResponseDto` - Cart item with variant details
- `ProductVariantDetailDto` - Complete variant and product info

### 2. Repository Interface
**`cart-read.repository.interface.ts`** - Read-side repository contract
- Follows CQRS pattern (separate read/write)
- Returns DTOs directly for optimal performance

### 3. Repository Implementation
**`prisma-cart-read.repository.ts`** - Prisma implementation
- Uses Prisma includes to fetch all related data in one query
- Calculates final prices and subtotals
- Returns properly formatted DTOs

### 4. Query & Handler
**`get-cart-with-details.query.ts`** - Query for populated cart
**`get-cart-with-details.handler.ts`** - Query handler

---

## 🏗️ Architecture Pattern Used

### CQRS Read Model

This implementation follows the **CQRS (Command Query Responsibility Segregation)** pattern with a dedicated read model:

```
Write Side (Commands):          Read Side (Queries):
- Uses domain entities          - Uses DTOs directly
- Enforces business rules       - Optimized for reading
- CartRepository                - CartReadRepository
- Returns domain objects        - Returns DTOs
```

**Benefits:**
- ✅ Optimal read performance (single query with joins)
- ✅ No N+1 query problems
- ✅ Separation of concerns
- ✅ Different models for read and write
- ✅ Easy to optimize independently

---

## 🔄 Data Flow

```
1. GET /cart request
   ↓
2. CartController.getCart()
   ↓
3. Execute GetCartWithDetailsQuery
   ↓
4. GetCartWithDetailsHandler
   ↓
5. CartReadRepository.findByCustomerIdWithDetails()
   ↓
6. Prisma query with includes:
   - Cart
   - CartItems
   - ProductVariants
   - Products
   - VariantImages
   ↓
7. Map to CartWithDetailsResponseDto
   ↓
8. Return to client
```

---

## 📊 API Response Structure

### Cart With Details Response

```typescript
{
  id: string;                    // Cart ID
  customerId: string;            // Customer ID
  items: CartItemWithDetails[];  // Populated items
  totalItems: number;            // Sum of quantities
  uniqueItemsCount: number;      // Number of unique items
  totalAmount: number;           // Sum of all subtotals
  isEmpty: boolean;              // Whether cart is empty
  createdAt: Date;
  updatedAt: Date;
}
```

### Cart Item With Details

```typescript
{
  id: string;                    // Item ID
  cartId: string;                // Cart ID
  productVariantId: string;      // Variant ID
  quantity: number;              // Quantity
  variant: ProductVariantDetail; // POPULATED variant & product
  subtotal: number;              // quantity × finalPrice
  createdAt: Date;
  updatedAt: Date;
}
```

### Product Variant Detail

```typescript
{
  id: string;                    // Variant ID
  variantName: string;           // "500g", "1kg", etc.
  price: number;                 // Original price
  discountPercent: number;       // Discount %
  finalPrice: number;            // Price after discount
  stock: number;                 // Available stock
  status: string;                // "active", "inactive", etc.
  productId: string;             // Product ID
  productName: string;           // Product name
  productDescription: string;    // Product description
  productBrand?: string;         // Brand (optional)
  imageUrl?: string;             // Main image URL (optional)
}
```

---

## 🚀 Usage Examples

### Get Cart with Details

```bash
GET /cart
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Cart retrieved successfully",
  "data": {
    "id": "clxy1234567890",
    "customerId": "clxy0987654321",
    "items": [
      {
        "id": "clxy1111111111",
        "cartId": "clxy1234567890",
        "productVariantId": "clxy2222222222",
        "quantity": 2,
        "variant": {
          "id": "clxy2222222222",
          "variantName": "1kg",
          "price": 149.99,
          "discountPercent": 15,
          "finalPrice": 127.49,
          "stock": 50,
          "status": "active",
          "productId": "clxy3333333333",
          "productName": "Premium Basmati Rice",
          "productDescription": "Aged premium basmati rice",
          "productBrand": "India Gate",
          "imageUrl": "https://cdn.example.com/rice-1kg.jpg"
        },
        "subtotal": 254.98,
        "createdAt": "2026-02-06T10:00:00Z",
        "updatedAt": "2026-02-06T10:00:00Z"
      },
      {
        "id": "clxy4444444444",
        "cartId": "clxy1234567890",
        "productVariantId": "clxy5555555555",
        "quantity": 3,
        "variant": {
          "id": "clxy5555555555",
          "variantName": "500ml",
          "price": 89.99,
          "discountPercent": 0,
          "finalPrice": 89.99,
          "stock": 100,
          "status": "active",
          "productId": "clxy6666666666",
          "productName": "Extra Virgin Olive Oil",
          "productDescription": "Cold pressed olive oil",
          "productBrand": "Figaro",
          "imageUrl": "https://cdn.example.com/olive-oil.jpg"
        },
        "subtotal": 269.97,
        "createdAt": "2026-02-06T11:00:00Z",
        "updatedAt": "2026-02-06T11:00:00Z"
      }
    ],
    "totalItems": 5,
    "uniqueItemsCount": 2,
    "totalAmount": 524.95,
    "isEmpty": false,
    "createdAt": "2026-02-05T09:00:00Z",
    "updatedAt": "2026-02-06T11:00:00Z"
  }
}
```

---

## 🎨 Frontend Integration

### Display Cart Items

```typescript
// Fetch cart
const response = await CartService.getCart();
const cart = response.data;

// Display items
cart.items.forEach(item => {
  console.log(`${item.variant.productName} - ${item.variant.variantName}`);
  console.log(`Price: $${item.variant.price}`);
  console.log(`Discount: ${item.variant.discountPercent}%`);
  console.log(`Final Price: $${item.variant.finalPrice}`);
  console.log(`Quantity: ${item.quantity}`);
  console.log(`Subtotal: $${item.subtotal}`);
  console.log(`Image: ${item.variant.imageUrl}`);
  console.log('---');
});

console.log(`Total Amount: $${cart.totalAmount}`);
console.log(`Total Items: ${cart.totalItems}`);
```

### React Component Example

```tsx
function CartView() {
  const { data: cart } = useQuery('cart', CartService.getCart);

  return (
    <div>
      <h2>Shopping Cart ({cart.totalItems} items)</h2>
      
      {cart.items.map(item => (
        <CartItemCard key={item.id}>
          <img src={item.variant.imageUrl} alt={item.variant.productName} />
          <div>
            <h3>{item.variant.productName}</h3>
            <p>{item.variant.variantName}</p>
            <p>{item.variant.productBrand}</p>
            
            {item.variant.discountPercent > 0 ? (
              <>
                <span className="original-price">${item.variant.price}</span>
                <span className="discount">{item.variant.discountPercent}% OFF</span>
                <span className="final-price">${item.variant.finalPrice}</span>
              </>
            ) : (
              <span className="price">${item.variant.price}</span>
            )}
            
            <div>
              Quantity: {item.quantity}
              Stock: {item.variant.stock} available
            </div>
            
            <div className="subtotal">
              Subtotal: ${item.subtotal.toFixed(2)}
            </div>
          </div>
        </CartItemCard>
      ))}
      
      <div className="cart-total">
        <h3>Total: ${cart.totalAmount.toFixed(2)}</h3>
      </div>
    </div>
  );
}
```

---

## 🔍 Database Query

The implementation uses a **single optimized Prisma query**:

```typescript
const cart = await this.prisma.cart.findUnique({
  where: { customerId },
  include: {
    items: {
      include: {
        productVariant: {
          include: {
            product: true,
            images: {
              where: { position: 1 },
              take: 1,
            },
          },
        },
      },
    },
  },
});
```

**Benefits:**
- ✅ Single database roundtrip
- ✅ No N+1 query problem
- ✅ Efficient data fetching
- ✅ Includes only main image (position 1)

---

## ⚡ Performance

### Query Performance
- **Single Query**: All data fetched in one database call
- **Indexed Fields**: Queries use indexed foreign keys
- **Selective Loading**: Only fetches main image (not all images)

### Calculations
- Final price calculated in application layer
- Subtotals computed during mapping
- Total amount summed from subtotals

---

## 🧪 Testing

### Test GET /cart Endpoint

```bash
# Get cart with populated data
curl -X GET http://localhost:3000/cart \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Expected Response Fields

Verify the response includes:
- ✅ `cart.id`
- ✅ `cart.customerId`
- ✅ `cart.items[]`
- ✅ `cart.items[].variant.productName`
- ✅ `cart.items[].variant.variantName`
- ✅ `cart.items[].variant.finalPrice`
- ✅ `cart.items[].variant.imageUrl`
- ✅ `cart.items[].subtotal`
- ✅ `cart.totalAmount`

---

## 📝 Implementation Notes

### 1. CQRS Pattern
- Separate read and write repositories
- Read model optimized for queries
- Write model enforces business rules

### 2. DTO Mapping
- Prisma entities → DTOs in repository layer
- No domain entities involved in read operations
- Clean separation of concerns

### 3. Price Calculation
- Discount applied: `finalPrice = price - (price × discountPercent / 100)`
- Subtotal: `quantity × finalPrice`
- Total amount: Sum of all subtotals

### 4. Image Handling
- Fetches only main image (position = 1)
- Reduces data transfer
- Can be extended to fetch all images if needed

---

## 🔄 Migration from Old Endpoint

If you need to keep the old endpoint without populated data:

```typescript
// Old endpoint (still available)
@Get('simple')
async getCartSimple(@UserId() userId: string) {
  const cart = await this.queryBus.execute(new GetCartQuery(userId));
  return CartResponseDto.fromDomain(cart);
}

// New endpoint (with details) - default
@Get()
async getCart(@UserId() userId: string) {
  const cart = await this.queryBus.execute(
    new GetCartWithDetailsQuery(userId)
  );
  return cart;
}
```

---

## ✨ Summary

The cart module now returns **fully populated data** including:
- ✅ Product names
- ✅ Product descriptions
- ✅ Product brands
- ✅ Variant names (sizes/types)
- ✅ Prices (original, discount, final)
- ✅ Stock information
- ✅ Product images (main image)
- ✅ Calculated subtotals
- ✅ Total cart amount

**Performance:** Single database query with efficient joins
**Architecture:** CQRS pattern with dedicated read model
**Frontend-Ready:** All data needed to display cart items

🎉 **Implementation Complete!**
