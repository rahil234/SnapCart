# Claude Agent Query – Checkout with Coupons (CQRS + Clean Architecture)

## Agent Role
You are a senior backend architect designing an e-commerce checkout system using **CQRS** and **Clean Architecture** principles.

---

## Context
I am building a marketplace backend.

Currently I want to support:
- Product-level `discountPercentage`
- Admin-created, platform-funded **coupons**
- No offers system for now
- No seller-funded discounts

The system already has:
- Cart (persistent, DB-backed)
- Products (with `basePrice` + `discountPercentage`)
- Orders
- Authentication (userId available in request context)

---

## Hard Constraints
- Cart must **NOT** store coupons
- Frontend must **NOT** calculate prices
- Coupons must be applied **ONLY during checkout**
- Cart items must be fetched by backend (not sent from frontend)
- Coupon may be shown in cart UI but stored ephemerally
- Coupon is persisted **ONLY as a snapshot on Order**
- Support checkout source: `PRODUCT | CART`
- Internally, do NOT model “Buy Now”

---

## What to Design

### 1. CQRS Structure
Design:
- Commands
- Queries
- Handlers
- DTOs

Specifically include:
- `CheckoutPreviewQuery`
- `CheckoutCommitCommand`

---

### 2. Clean Architecture Layers
For each use case, show:
- Controller / API layer
- Application layer (use cases)
- Domain layer (entities, value objects)
- Infrastructure layer (repositories)

Include a **clear file/folder structure**.

---

### 3. Pricing Rules
Apply pricing strictly in this order:
1. Base product price
2. Product `discountPercentage`
3. Coupon discount (order-level, platform-funded)

Rules:
- Coupon discount must never reduce seller payout
- Coupon must be revalidated during commit
- Coupon stacking is NOT allowed
- Only one coupon at a time

---

### 4. Checkout Preview Flow
Design:
- Input DTO
- Output DTO (price breakdown)
- Validation steps
- Where coupon validation happens
- How discount is calculated

Constraints:
- No database writes
- Idempotent
- Safe to call repeatedly

---

### 5. Checkout Commit Flow
Design:
- Revalidation logic
- Order creation
- Coupon snapshot persistence
- Cart clearing rule:
  - Clear cart ONLY after payment success
  - Only if `source = CART`

---

### 6. Domain Modeling
Define:
- `OrderPricingSnapshot`
- `CouponSnapshot`
- `CheckoutSource` enum

---

### 7. Pseudocode
Provide pseudocode for:
- `calculatePricing()`
- `applyProductDiscount()`
- `applyCouponDiscount()`

Constraints:
- No frontend logic
- Backend-only orchestration

---

### 8. Explicitly Exclude
Do NOT include:
- Offers
- Seller coupons
- Coupon stacking
- Inventory reservation
- Payment gateway implementation

---

## Output Guidelines
- Use clear headings
- Use TypeScript-like pseudocode
- Prefer correctness over brevity
- Be explicit about responsibilities
