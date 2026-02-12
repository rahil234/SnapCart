# 🚀 Quick API Reference - New Endpoints

## Offers API

### Customer/Public

```bash
# Get all active offers
GET /offers

# Get specific offer
GET /offers/:id

# Get offers for a product (use on product page)
GET /offers/product/:productId
```

### Admin

```bash
# Create offer
POST /admin/offers
Body: {
  "name": "Summer Sale",
  "type": "Percentage",
  "discount": 25,
  "startDate": "2026-02-09T00:00:00Z",
  "endDate": "2026-03-31T23:59:59Z",
  "minPurchaseAmount": 1000,
  "maxDiscount": 500,
  "priority": 10,
  "categories": ["cat_123"],
  "products": ["prod_456"],
  "isStackable": false,
  "description": "Get 25% off summer collection"
}

# List all offers
GET /admin/offers?page=1&limit=10

# Get single offer
GET /admin/offers/:id

# Update offer
PATCH /admin/offers/:id

# Activate offer
PATCH /admin/offers/:id/activate

# Deactivate offer
PATCH /admin/offers/:id/deactivate
```

---

## Cart Pricing API

```bash
# Get cart pricing with automatic offers
GET /cart/pricing

# Get cart pricing with coupon validation
GET /cart/pricing?couponCode=SAVE20

# Response:
{
  "subtotal": 2000,
  "offerDiscount": 500,
  "couponDiscount": 100,
  "totalDiscount": 600,
  "finalTotal": 1400,
  "appliedOfferIds": ["offer_123"],
  "appliedCouponCode": "SAVE20",
  "savings": 600,
  "appliedOffers": [
    {
      "id": "offer_123",
      "name": "Summer Sale",
      "discount": 500
    }
  ]
}

# Apply coupon to cart
POST /cart/apply-coupon
Body: {
  "code": "SAVE20"
}
```

---

## Analytics API

```bash
# Get coupon performance analytics
GET /admin/coupons/analytics/performance

# With date range
GET /admin/coupons/analytics/performance?startDate=2026-02-01T00:00:00Z&endDate=2026-02-28T23:59:59Z

# Response:
{
  "summary": {
    "totalCouponsUsed": 5,
    "totalUsages": 125,
    "totalDiscountGiven": 12500,
    "averageDiscountPerCoupon": 2500,
    "topPerformingCoupon": "WELCOME20"
  },
  "coupons": [
    {
      "couponId": "clx123",
      "couponCode": "WELCOME20",
      "couponType": "Percentage",
      "couponDiscount": 20,
      "status": "active",
      "totalUsages": 50,
      "totalDiscountApplied": 5000,
      "averageDiscountPerUse": 100,
      "utilizationRate": "50.00"
    }
  ]
}
```

---

## Frontend Integration Examples

### Display Offers on Product Page

```typescript
const ProductPage = ({ productId }) => {
  const [offers, setOffers] = useState([]);
  
  useEffect(() => {
    fetch(`/api/offers/product/${productId}`)
      .then(res => res.json())
      .then(data => setOffers(data.data));
  }, [productId]);
  
  return (
    <div>
      {offers.length > 0 && (
        <div className="offer-badge">
          <span>{offers[0].discount}% OFF</span>
          <p>{offers[0].description}</p>
        </div>
      )}
    </div>
  );
};
```

### Show Cart Pricing Breakdown

```typescript
const CheckoutSummary = ({ couponCode }) => {
  const [pricing, setPricing] = useState(null);
  
  useEffect(() => {
    const url = couponCode 
      ? `/api/cart/pricing?couponCode=${couponCode}`
      : '/api/cart/pricing';
      
    fetch(url)
      .then(res => res.json())
      .then(data => setPricing(data.data));
  }, [couponCode]);
  
  if (!pricing) return <Spinner />;
  
  return (
    <div className="pricing-summary">
      <div>Subtotal: ₹{pricing.subtotal}</div>
      
      {pricing.offerDiscount > 0 && (
        <div className="discount">
          Offer Discount: -₹{pricing.offerDiscount}
        </div>
      )}
      
      {pricing.couponDiscount > 0 && (
        <div className="discount">
          Coupon ({pricing.appliedCouponCode}): -₹{pricing.couponDiscount}
        </div>
      )}
      
      <div className="savings">
        You Save: ₹{pricing.savings}
      </div>
      
      <div className="total">
        Final Total: ₹{pricing.finalTotal}
      </div>
    </div>
  );
};
```

### Apply Coupon

```typescript
const applyCoupon = async (code: string) => {
  try {
    const response = await fetch('/api/cart/apply-coupon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      toast.success('Coupon applied!');
      // Refresh pricing
      refreshPricing();
    } else {
      toast.error(result.message);
    }
  } catch (error) {
    toast.error('Failed to apply coupon');
  }
};
```

---

## Scheduled Tasks

All cron jobs run automatically:

1. **Expire Coupons** - Daily at 00:00 (midnight)
2. **Expire Offers** - Daily at 00:00 (midnight)
3. **Usage Report** - Daily at 01:00
4. **Expiring Alerts** - Daily at 08:00

**Check logs**: Look for `[SchedulerService]` in console output

---

## Testing Checklist

- [ ] Create an offer via admin endpoint
- [ ] Verify offer appears in `GET /offers`
- [ ] Create a coupon via admin endpoint
- [ ] Add items to cart
- [ ] Check pricing without coupon
- [ ] Check pricing with coupon code
- [ ] Apply coupon to cart
- [ ] View analytics for date range
- [ ] Wait for cron job and check logs
- [ ] Test offer on product page
- [ ] Test stacking rules (non-stackable)
- [ ] Test priority selection (multiple offers)

---

## Common Use Cases

### 1. Flash Sale
```bash
POST /admin/offers
{
  "name": "24h Flash Sale",
  "type": "Percentage",
  "discount": 30,
  "startDate": "2026-02-09T00:00:00Z",
  "endDate": "2026-02-10T23:59:59Z",
  "minPurchaseAmount": 500,
  "priority": 100,
  "isStackable": false
}
```

### 2. Category-Specific Offer
```bash
POST /admin/offers
{
  "name": "Electronics Sale",
  "type": "Percentage",
  "discount": 15,
  "categories": ["electronics", "gadgets"],
  "priority": 50
}
```

### 3. First-Time User Coupon
```bash
POST /admin/coupons
{
  "code": "FIRST10",
  "type": "Percentage",
  "discount": 10,
  "minAmount": 0,
  "maxUsagePerUser": 1,
  "description": "First order discount"
}
```

### 4. High-Value Order Coupon
```bash
POST /admin/coupons
{
  "code": "PREMIUM100",
  "type": "Flat",
  "discount": 100,
  "minAmount": 2000,
  "maxUsagePerUser": 3
}
```

---

## Swagger UI

Access complete API documentation:
```
http://localhost:3000/api/docs
```

All new endpoints are fully documented with:
- Request/response examples
- Validation rules
- Authentication requirements
- Error responses

---

**Ready to use! 🚀**
