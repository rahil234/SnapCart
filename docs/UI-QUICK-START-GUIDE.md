# Quick Start Guide for UI Development

## 🚀 Start Here

This guide helps you quickly integrate the Product & Variant APIs into your UI.

---

## 📍 Base URL

```
Development: http://localhost:3000
Production: https://api.snapcart.com
```

---

## 🔐 Authentication

Most endpoints require authentication. Include the Bearer token:

```javascript
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

**Public endpoints** (no auth needed):
- `GET /products` - List products
- `GET /products/:id` - Product details
- `GET /products/:id/with-variants` - Product with variants
- `GET /products/:productId/variants` - List variants
- `GET /products/variants/:id` - Variant details

---

## 📦 Common Patterns

### 1. Product List Page

```javascript
// Fetch products with pagination
const fetchProducts = async (page = 1, limit = 10, search = '') => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  });

  const response = await fetch(`/products?${params}`);
  const data = await response.json();
  
  return {
    products: data.data,
    total: data.total,
    page: data.page,
    limit: data.limit
  };
};
```

**UI Components**:
```jsx
<ProductTable 
  products={products}
  onEdit={productId => navigate(`/products/${productId}/edit`)}
  onViewVariants={productId => navigate(`/products/${productId}/variants`)}
/>
<Pagination 
  page={page}
  total={total}
  limit={limit}
  onChange={setPage}
/>
```

---

### 2. Product Detail Page (with Variants)

```javascript
// Single request for complete view
const fetchProductWithVariants = async (productId) => {
  const response = await fetch(`/products/${productId}/with-variants`);
  const data = await response.json();
  
  return {
    product: data.data.product,
    variants: data.data.variants
  };
};
```

**UI Layout**:
```jsx
<ProductDetailCard product={product} />
<VariantsTable 
  variants={variants}
  onEditVariant={handleEdit}
  onUpdateStock={handleStock}
  onToggleActive={handleToggle}
/>
```

---

### 3. Create Product Flow

```javascript
// Step 1: Create Product
const createProduct = async (productData) => {
  const response = await fetch('/products', {
    method: 'POST',
    headers: { ...authHeaders },
    body: JSON.stringify({
      name: productData.name,
      description: productData.description,
      categoryId: productData.categoryId,
      brand: productData.brand
    })
  });
  
  const result = await response.json();
  return result.data.id; // Product ID
};

// Step 2: Add Variants
const addVariant = async (productId, variantData) => {
  await fetch(`/products/${productId}/variants`, {
    method: 'POST',
    headers: { ...authHeaders },
    body: JSON.stringify({
      sku: variantData.sku,
      variantName: variantData.variantName,
      price: variantData.price,
      stock: variantData.stock,
      discountPercent: variantData.discountPercent || 0
    })
  });
};

// Complete Flow
const createProductWithVariants = async (productData, variants) => {
  // Step 1: Create product
  const productId = await createProduct(productData);
  
  // Step 2: Add all variants
  await Promise.all(
    variants.map(variant => addVariant(productId, variant))
  );
  
  return productId;
};
```

**UI Wizard**:
```jsx
<Wizard>
  <Step1 title="Product Information">
    <ProductForm onNext={handleProductSubmit} />
  </Step1>
  
  <Step2 title="Add Variants">
    <VariantForm 
      multiple={true}
      onNext={handleVariantsSubmit}
    />
  </Step2>
  
  <Step3 title="Review & Publish">
    <ReviewPage 
      product={product}
      variants={variants}
      onPublish={handlePublish}
    />
  </Step3>
</Wizard>
```

---

### 4. Stock Management

```javascript
// Quick stock update
const updateStock = async (variantId, action, quantity) => {
  await fetch(`/products/variants/${variantId}/stock`, {
    method: 'PATCH',
    headers: { ...authHeaders },
    body: JSON.stringify({
      action, // 'set', 'add', or 'reduce'
      quantity
    })
  });
};

// Examples
await updateStock(variantId, 'add', 50);     // Restock: +50
await updateStock(variantId, 'set', 100);    // Set to: 100
await updateStock(variantId, 'reduce', 10);  // Reduce: -10
```

**UI Component**:
```jsx
<StockUpdateModal
  variant={variant}
  onUpdate={(action, quantity) => {
    updateStock(variant.id, action, quantity)
      .then(() => toast.success('Stock updated'))
      .catch(err => toast.error(err.message))
  }}
/>
```

---

### 5. Status Toggles

```javascript
// Toggle product active/inactive
const toggleProductStatus = async (productId, isActive) => {
  const endpoint = isActive ? 'activate' : 'deactivate';
  await fetch(`/products/${productId}/${endpoint}`, {
    method: 'PATCH',
    headers: { ...authHeaders }
  });
};

// Toggle variant active/inactive
const toggleVariantStatus = async (variantId, isActive) => {
  const endpoint = isActive ? 'activate' : 'deactivate';
  await fetch(`/products/variants/${variantId}/${endpoint}`, {
    method: 'PATCH',
    headers: { ...authHeaders }
  });
};
```

**UI Component**:
```jsx
<Switch
  checked={product.isActive}
  onChange={(checked) => {
    toggleProductStatus(product.id, checked)
      .then(() => setProduct({ ...product, isActive: checked }))
  }}
/>
```

---

### 6. Customer Product Selection

```javascript
// For product detail page
const ProductDetail = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    fetch(`/products/${productId}/with-variants`)
      .then(res => res.json())
      .then(data => {
        setProduct(data.data.product);
        setVariants(data.data.variants);
        // Auto-select first available variant
        const firstAvailable = data.data.variants.find(
          v => v.availableForPurchase
        );
        setSelectedVariant(firstAvailable);
      });
  }, [productId]);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error('Please select a variant');
      return;
    }
    
    if (!selectedVariant.availableForPurchase) {
      toast.error('This variant is not available');
      return;
    }

    // Add to cart with variantId (NOT productId)
    addToCart({
      variantId: selectedVariant.id,
      quantity: 1
    });
  };

  return (
    <div>
      <ProductInfo product={product} />
      
      <VariantSelector
        variants={variants}
        selected={selectedVariant}
        onChange={setSelectedVariant}
      />
      
      <PriceDisplay
        price={selectedVariant?.finalPrice}
        discount={selectedVariant?.discountPercent}
      />
      
      <StockBadge inStock={selectedVariant?.inStock} />
      
      <AddToCartButton
        onClick={handleAddToCart}
        disabled={!selectedVariant?.availableForPurchase}
      />
    </div>
  );
};
```

---

## 🎨 Component Examples

### Product Card

```jsx
const ProductCard = ({ product }) => (
  <Card>
    <CardHeader>
      <h3>{product.name}</h3>
      <StatusBadge status={product.status} />
    </CardHeader>
    
    <CardBody>
      <p>{product.description}</p>
      <p className="text-sm text-gray-500">{product.brand}</p>
    </CardBody>
    
    <CardFooter>
      <Button onClick={() => navigate(`/products/${product.id}`)}>
        View Details
      </Button>
      <Button onClick={() => navigate(`/products/${product.id}/edit`)}>
        Edit
      </Button>
    </CardFooter>
  </Card>
);
```

### Variant Table

```jsx
const VariantTable = ({ variants, onUpdate }) => (
  <Table>
    <thead>
      <tr>
        <th>SKU</th>
        <th>Name</th>
        <th>Price</th>
        <th>Discount</th>
        <th>Final Price</th>
        <th>Stock</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {variants.map(variant => (
        <tr key={variant.id}>
          <td>{variant.sku}</td>
          <td>{variant.variantName}</td>
          <td>₹{variant.price}</td>
          <td>{variant.discountPercent}%</td>
          <td className="font-bold">₹{variant.finalPrice}</td>
          <td>
            <StockBadge 
              stock={variant.stock}
              status={variant.status}
            />
          </td>
          <td>
            <Switch
              checked={variant.isActive}
              onChange={(checked) => 
                onUpdate(variant.id, { isActive: checked })
              }
            />
          </td>
          <td>
            <ButtonGroup>
              <IconButton 
                icon="edit" 
                onClick={() => openEditModal(variant)}
              />
              <IconButton 
                icon="stock" 
                onClick={() => openStockModal(variant)}
              />
            </ButtonGroup>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);
```

---

## ⚠️ Common Mistakes to Avoid

### ❌ DON'T: Add productId to cart
```javascript
// WRONG
addToCart({
  productId: product.id,  // ❌ Products are not purchasable
  quantity: 1
});
```

### ✅ DO: Add variantId to cart
```javascript
// CORRECT
addToCart({
  variantId: selectedVariant.id,  // ✅ Variants are purchasable
  quantity: 1
});
```

---

### ❌ DON'T: Try to get price from product
```javascript
// WRONG
<div>Price: ₹{product.price}</div>  // ❌ Products don't have price
```

### ✅ DO: Get price from variant
```javascript
// CORRECT
<div>Price: ₹{variant.finalPrice}</div>  // ✅ Variants have price
```

---

### ❌ DON'T: Check stock on product
```javascript
// WRONG
if (product.inStock) { ... }  // ❌ Products don't have stock
```

### ✅ DO: Check stock on variant
```javascript
// CORRECT
if (variant.availableForPurchase) { ... }  // ✅ Variants have availability
```

---

## 🔍 Error Handling

```javascript
const apiCall = async (url, options) => {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const error = await response.json();
      
      switch (response.status) {
        case 400:
          toast.error(error.message || 'Invalid input');
          break;
        case 401:
          toast.error('Please login again');
          navigate('/login');
          break;
        case 403:
          toast.error('You do not have permission');
          break;
        case 404:
          toast.error('Not found');
          break;
        case 500:
          toast.error('Server error. Please try again.');
          break;
        default:
          toast.error('Something went wrong');
      }
      
      throw new Error(error.message);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

---

## 📝 Type Definitions (TypeScript)

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  brand: string | null;
  categoryId: string;
  status: 'active' | 'inactive' | 'discontinued';
  isActive: boolean;
  isInCatalog: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Variant {
  id: string;
  productId: string;
  sku: string;
  variantName: string;
  price: number;
  discountPercent: number;
  finalPrice: number;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  isActive: boolean;
  inStock: boolean;
  availableForPurchase: boolean;
  sellerProfileId: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ProductWithVariants {
  product: Product;
  variants: Variant[];
}
```

---

## 🎯 Quick Checklist

### Before Launching
- [ ] Product list page working
- [ ] Product detail page showing variants
- [ ] Create product flow complete
- [ ] Variant management functional
- [ ] Stock updates working
- [ ] Status toggles working
- [ ] Customer can select variants
- [ ] Cart uses variantId (not productId)
- [ ] Price displays from variants
- [ ] Stock checks on variants
- [ ] Error handling in place
- [ ] Loading states implemented

---

## 📚 Full Documentation

For complete details, see:
- `PRODUCT-VARIANT-API-UI-GUIDE.md` - Complete API reference
- Swagger docs at `/api/docs`

---

## 🆘 Need Help?

Check these first:
1. Swagger docs: `http://localhost:3000/api/docs`
2. API Guide: Full documentation with examples
3. Common Mistakes section above
4. Error handling patterns

---

**Happy coding! 🚀**
