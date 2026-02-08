# Coupons & Offers API - Quick Start Guide

## 🚀 Testing the Implementation

### Prerequisites
- API server running on port 3000 (or configured port)
- Authenticated as Admin to create coupons
- Authenticated as Customer to use coupons

### Access Swagger UI
```
http://localhost:3000/api/docs
```

---

## 📋 Step-by-Step Testing

### 1. Create a Coupon (Admin)

**Endpoint**: `POST /admin/coupons`

**Request Body**:
```json
{
  "code": "WELCOME20",
  "type": "Percentage",
  "discount": 20,
  "minAmount": 500,
  "startDate": "2026-02-08T00:00:00Z",
  "endDate": "2026-12-31T23:59:59Z",
  "maxDiscount": 200,
  "usageLimit": 1000,
  "maxUsagePerUser": 1,
  "applicableTo": "all",
  "isStackable": false,
  "description": "Get 20% off on your first order above ₹500 (max ₹200)"
}
```

**Expected Response**:
```json
{
  "message": "Coupon created successfully",
  "data": {
    "id": "clx...",
    "code": "WELCOME20",
    "type": "Percentage",
    "discount": 20,
    "minAmount": 500,
    "maxDiscount": 200,
    "status": "active",
    "isActive": true,
    "isLimitReached": false,
    ...
  }
}
```

### 2. Get Available Coupons (Customer)

**Endpoint**: `GET /coupons/available`

**Expected Response**:
```json
{
  "message": "Available coupons retrieved successfully",
  "data": [
    {
      "id": "clx...",
      "code": "WELCOME20",
      "type": "Percentage",
      "discount": 20,
      "minAmount": 500,
      "maxDiscount": 200,
      "description": "Get 20% off on your first order above ₹500 (max ₹200)",
      "isActive": true,
      "isLimitReached": false,
      ...
    }
  ]
}
```

### 3. Validate Coupon (Customer)

**Endpoint**: `POST /coupons/validate`

**Test Case 1: Valid (Meets Minimum)**
```json
{
  "code": "WELCOME20",
  "cartTotal": 1000
}
```

**Expected Response**:
```json
{
  "message": "Coupon is valid",
  "data": {
    "valid": true,
    "discount": 200,
    "code": "WELCOME20"
  }
}
```

**Test Case 2: Invalid (Below Minimum)**
```json
{
  "code": "WELCOME20",
  "cartTotal": 300
}
```

**Expected Response**:
```json
{
  "message": "Minimum cart value of ₹500 required",
  "data": {
    "valid": false,
    "reason": "Minimum cart value of ₹500 required",
    "code": "WELCOME20"
  }
}
```

**Test Case 3: Max Discount Cap**
```json
{
  "code": "WELCOME20",
  "cartTotal": 2000
}
```

**Expected Response** (20% of 2000 = 400, but capped at 200):
```json
{
  "message": "Coupon is valid",
  "data": {
    "valid": true,
    "discount": 200,
    "code": "WELCOME20"
  }
}
```

### 4. Get Coupon by Code (Customer)

**Endpoint**: `GET /coupons/code/WELCOME20`

**Expected Response**: Full coupon details

### 5. View All Coupons (Admin)

**Endpoint**: `GET /admin/coupons?page=1&limit=10`

**Expected Response**: Paginated list with metadata

### 6. Update Coupon (Admin)

**Endpoint**: `PATCH /admin/coupons/{id}`

```json
{
  "discount": 25,
  "description": "Updated: Get 25% off!"
}
```

### 7. Activate/Deactivate (Admin)

**Activate**: `PATCH /admin/coupons/{id}/activate`
**Deactivate**: `PATCH /admin/coupons/{id}/deactivate`

### 8. View Usage History (Admin)

**Endpoint**: `GET /admin/coupons/{id}/usage`

Shows all usage records with userId, orderId, discount applied, and timestamp.

---

## 🧪 Advanced Test Scenarios

### Scenario 1: Usage Limits

1. Create coupon with `maxUsagePerUser: 1`
2. Customer uses coupon once (would happen during order placement)
3. Try to validate same coupon again
4. Should return: "You have already used this coupon 1 time(s)"

### Scenario 2: Global Usage Limit

1. Create coupon with `usageLimit: 100`
2. After 100 uses (tracked in `usedCount`)
3. Next validation should return: "Coupon usage limit reached"

### Scenario 3: Expiry

1. Create coupon with `endDate` in the past
2. Try to validate
3. Should return: "Coupon has expired"

### Scenario 4: Percentage vs Flat

**Percentage Coupon**:
- Code: "SAVE20"
- Type: "Percentage"
- Discount: 20
- Cart: 1000
- Result: 200 discount (20% of 1000)

**Flat Coupon**:
- Code: "FLAT100"
- Type: "Flat"
- Discount: 100
- Cart: 1000
- Result: 100 discount (fixed amount)

---

## 🔍 Database Inspection

### View Coupons
```sql
SELECT * FROM "Coupon" ORDER BY "createdAt" DESC;
```

### View Coupon Usage
```sql
SELECT 
  cu.*,
  c.code as coupon_code
FROM "CouponUsage" cu
JOIN "Coupon" c ON cu."couponId" = c.id
ORDER BY cu."usedAt" DESC;
```

### Check Usage Counts
```sql
SELECT 
  c.code,
  c."usageLimit",
  c."usedCount",
  c."maxUsagePerUser",
  COUNT(cu.id) as actual_usage_count
FROM "Coupon" c
LEFT JOIN "CouponUsage" cu ON c.id = cu."couponId"
GROUP BY c.id, c.code
ORDER BY c."createdAt" DESC;
```

---

## 📊 Sample Test Data

### Budget-Friendly Coupon
```json
{
  "code": "SAVE50",
  "type": "Flat",
  "discount": 50,
  "minAmount": 200,
  "startDate": "2026-02-08T00:00:00Z",
  "endDate": "2026-03-08T23:59:59Z",
  "maxUsagePerUser": 3,
  "applicableTo": "all",
  "isStackable": false,
  "description": "Flat ₹50 off on orders above ₹200"
}
```

### Premium Coupon
```json
{
  "code": "PREMIUM100",
  "type": "Percentage",
  "discount": 15,
  "minAmount": 2000,
  "startDate": "2026-02-08T00:00:00Z",
  "endDate": "2026-12-31T23:59:59Z",
  "maxDiscount": 500,
  "usageLimit": 500,
  "maxUsagePerUser": 1,
  "applicableTo": "all",
  "isStackable": false,
  "description": "Get 15% off on premium purchases above ₹2000"
}
```

### Flash Sale Coupon
```json
{
  "code": "FLASH24",
  "type": "Percentage",
  "discount": 30,
  "minAmount": 1000,
  "startDate": "2026-02-08T00:00:00Z",
  "endDate": "2026-02-09T23:59:59Z",
  "maxDiscount": 300,
  "usageLimit": 100,
  "maxUsagePerUser": 1,
  "applicableTo": "all",
  "isStackable": false,
  "description": "24-hour flash sale! 30% off on orders above ₹1000"
}
```

---

## ⚠️ Common Errors & Solutions

### Error: "Coupon with code 'XXX' already exists"
**Solution**: Use a unique code or update existing coupon

### Error: "Percentage discount cannot exceed 100%"
**Solution**: Set discount <= 100 for percentage coupons

### Error: "End date must be after start date"
**Solution**: Ensure `endDate` > `startDate`

### Error: "Minimum cart value of ₹X required"
**Solution**: This is expected - cart total is below `minAmount`

### Error: "You have already used this coupon X time(s)"
**Solution**: This is expected - user has reached `maxUsagePerUser` limit

---

## 🎯 Integration with Frontend

### Display Available Coupons in Checkout
```typescript
// Fetch available coupons
const response = await fetch('/coupons/available', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const { data: coupons } = await response.json();

// Display as cards or list
coupons.forEach(coupon => {
  renderCouponCard({
    code: coupon.code,
    description: coupon.description,
    discount: `${coupon.discount}${coupon.type === 'Percentage' ? '%' : '₹'}`,
    minAmount: coupon.minAmount,
    isActive: coupon.isActive
  });
});
```

### Validate Before Applying
```typescript
const validateCoupon = async (code: string, cartTotal: number) => {
  const response = await fetch('/coupons/validate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ code, cartTotal })
  });
  
  const { data } = await response.json();
  
  if (data.valid) {
    showSuccess(`Coupon applied! You saved ₹${data.discount}`);
    updateCartTotal(cartTotal - data.discount);
  } else {
    showError(data.reason);
  }
};
```

### Show Coupon Input in Cart
```jsx
<div className="coupon-section">
  <input 
    type="text" 
    placeholder="Enter coupon code"
    value={couponCode}
    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
  />
  <button onClick={() => validateCoupon(couponCode, cartTotal)}>
    Apply
  </button>
</div>

<div className="available-coupons">
  <h3>Available Coupons</h3>
  {coupons.map(coupon => (
    <div key={coupon.id} className="coupon-card">
      <strong>{coupon.code}</strong>
      <p>{coupon.description}</p>
      <button onClick={() => {
        setCouponCode(coupon.code);
        validateCoupon(coupon.code, cartTotal);
      }}>
        Apply
      </button>
    </div>
  ))}
</div>
```

---

## 📈 Next Steps

1. **Integrate with Order Module**
   - Record coupon usage when order is placed
   - Create CouponUsage record with orderId
   - Increment coupon usedCount

2. **Add Discount Calculator Service**
   - Combine offers + coupons
   - Handle stacking rules
   - Calculate final pricing

3. **Implement Offer Endpoints**
   - Similar structure to coupons
   - Priority-based selection
   - Category/product filtering

4. **Add Analytics**
   - Coupon performance metrics
   - Most used coupons
   - Revenue impact
   - User segments

5. **Scheduled Tasks**
   - Auto-expire old coupons
   - Send expiry notifications
   - Generate usage reports

---

## ✅ Success Criteria

- [x] Can create coupons with all constraints
- [x] Can validate coupons in real-time
- [x] Usage limits enforced (global and per-user)
- [x] Min/max discount constraints work
- [x] Admin can manage all coupons
- [x] Customer can view available coupons
- [x] Swagger documentation complete
- [x] No TypeScript errors
- [x] Database migration applied
- [x] Clean Architecture maintained
- [x] CQRS pattern followed

---

**Ready for Production Testing!** 🎉
