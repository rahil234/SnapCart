# Cart Module - Quick Reference

## 🚀 Quick Start

### API Endpoints

```typescript
GET    /cart                    // Get user cart
POST   /cart/items              // Add item to cart
PUT    /cart/items/:itemId      // Update item quantity
DELETE /cart/items/:itemId      // Remove item
DELETE /cart/clear              // Clear cart
```

### Request Examples

**Add Item:**
```json
POST /cart/items
{
  "productVariantId": "variant_123",
  "quantity": 2
}
```

**Update Quantity:**
```json
PUT /cart/items/item_456
{
  "quantity": 5
}
```

---

## 📂 Module Structure

```
cart/
├── domain/           # Business logic (NO dependencies)
│   ├── entities/     # Cart (aggregate), CartItem
│   ├── repositories/ # Interfaces only
│   └── events/       # Domain events
├── application/      # Use cases (CQRS)
│   ├── commands/     # Write operations
│   ├── queries/      # Read operations
│   └── dtos/         # Data transfer objects
├── infrastructure/   # Technical implementation
│   ├── persistence/  # Prisma repositories
│   └── events/       # Event handlers
└── interfaces/       # External interfaces
    └── http/         # REST controller
```

---

## 🎯 Key Classes

### Domain Entities

```typescript
// Cart (Aggregate Root)
class Cart {
  addItem(productVariantId, quantity): CartItem
  removeItem(itemId): void
  updateItemQuantity(itemId, quantity): void
  clear(): void
  getTotalItems(): number
  getUniqueItemsCount(): number
  isEmpty(): boolean
}

// CartItem
class CartItem {
  updateQuantity(quantity): void
  incrementQuantity(amount): void
  decrementQuantity(amount): void
}
```

### Commands (Write)

```typescript
CreateCartCommand(userId)
AddItemToCartCommand(userId, productVariantId, quantity)
UpdateCartItemCommand(userId, itemId, quantity)
RemoveItemFromCartCommand(userId, itemId)
ClearCartCommand(userId)
```

### Queries (Read)

```typescript
GetCartQuery(userId)
```

---

## 🔄 Event Flow

### User Registration → Cart Creation

```
1. User registers
2. UserRegisteredEvent emitted
3. OnUserRegisteredHandler listens
4. CreateCartCommand executed
5. Cart created for user
```

---

## 🗄️ Database Schema

```sql
Cart:
  - id (PK)
  - userId (FK → User, UNIQUE)
  - createdAt
  - updatedAt

CartItem:
  - id (PK)
  - cartId (FK → Cart)
  - productVariantId (FK → ProductVariant)
  - quantity
  - createdAt
  - updatedAt
  - UNIQUE(cartId, productVariantId)
```

---

## 🛠️ Usage in Code

### Adding Item to Cart

```typescript
// In any service/handler
await commandBus.execute(
  new AddItemToCartCommand(userId, productVariantId, quantity)
);
```

### Getting User Cart

```typescript
const cart = await queryBus.execute(new GetCartQuery(userId));
```

### Domain Logic Example

```typescript
const cart = Cart.create(userId);
cart.addItem('variant_123', 2);      // Add 2 items
cart.addItem('variant_123', 3);      // Add 3 more → total 5
cart.updateItemQuantity(itemId, 10); // Set to 10
cart.removeItem(itemId);             // Remove
cart.clear();                        // Clear all
```

---

## ✅ Validation Rules

### CartItem
- ✅ Quantity must be positive integer
- ✅ Cannot have quantity < 1
- ✅ No duplicate products (enforced by unique constraint)

### Cart
- ✅ One cart per user
- ✅ Cart items must reference existing product variants
- ✅ User can only access their own cart

---

## 🔐 Security

- ✅ All endpoints require JWT authentication
- ✅ User ID extracted from JWT token via `@UserId()` decorator
- ✅ Users can only access/modify their own cart
- ✅ Ownership verified before updates/deletes

---

## 📊 Response Format

```json
{
  "id": "cart_abc123",
  "userId": "user_xyz789",
  "items": [
    {
      "id": "item_def456",
      "cartId": "cart_abc123",
      "productVariantId": "variant_ghi789",
      "quantity": 2,
      "createdAt": "2026-02-05T10:00:00Z",
      "updatedAt": "2026-02-05T10:00:00Z"
    }
  ],
  "totalItems": 2,
  "uniqueItemsCount": 1,
  "isEmpty": false,
  "createdAt": "2026-02-05T09:00:00Z",
  "updatedAt": "2026-02-05T10:00:00Z"
}
```

---

## 🔗 Integration Points

### With User Module
- Listens to `UserRegisteredEvent`
- Auto-creates cart on user registration

### With Product Module
- CartItem references `ProductVariant` (the sellable unit)
- Respects product-variant architecture

### With Auth Module
- Uses JWT authentication
- Extracts user ID from token

---

## 🧪 Testing Checklist

- [ ] Cart auto-created on user registration
- [ ] User can add item to cart
- [ ] Duplicate product variants update quantity
- [ ] User can update item quantity
- [ ] User can remove item
- [ ] User can clear cart
- [ ] User cannot access other user's cart
- [ ] Invalid quantities rejected
- [ ] Non-existent items return 404

---

## 📝 Notes

- Cart is linked to User, not CustomerProfile
- CartItem uses ProductVariant ID (not Product ID)
- Quantity must be positive integer
- Unique constraint prevents duplicate variants
- Cascade delete: User deleted → Cart deleted → Items deleted

---

## 🎓 DDD Concepts Applied

1. **Aggregate**: Cart is aggregate root, CartItem is entity within
2. **Factory Method**: `Cart.create()`, `CartItem.create()`
3. **Repository Pattern**: Interface in domain, implementation in infrastructure
4. **Domain Events**: Cart lifecycle events
5. **CQRS**: Separate commands (write) and queries (read)
6. **Clean Architecture**: Proper layer separation
7. **Bounded Context**: Cart is separate module with clear boundaries

---

**For full documentation, see:** `CART-MODULE-IMPLEMENTATION-COMPLETE.md`
