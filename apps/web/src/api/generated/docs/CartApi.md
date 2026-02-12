# CartApi

All URIs are relative to *http://localhost:4000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**cartControllerAddItem**](#cartcontrolleradditem) | **POST** /api/cart/items | Add item to cart|
|[**cartControllerApplyCoupon**](#cartcontrollerapplycoupon) | **POST** /api/cart/apply-coupon | Apply coupon to cart|
|[**cartControllerClearCart**](#cartcontrollerclearcart) | **DELETE** /api/cart/clear | Clear all items from cart|
|[**cartControllerGetCart**](#cartcontrollergetcart) | **GET** /api/cart | Get user cart with product details|
|[**cartControllerGetCartPricing**](#cartcontrollergetcartpricing) | **GET** /api/cart/pricing | Get cart pricing with offers and optional coupon|
|[**cartControllerRemoveItem**](#cartcontrollerremoveitem) | **DELETE** /api/cart/items/{itemId} | Remove item from cart|
|[**cartControllerUpdateItem**](#cartcontrollerupdateitem) | **PUT** /api/cart/items/{itemId} | Update cart item quantity|

# **cartControllerAddItem**
> CartControllerAddItem201Response cartControllerAddItem(addItemToCartDto)


### Example

```typescript
import {
    CartApi,
    Configuration,
    AddItemToCartDto
} from './api';

const configuration = new Configuration();
const apiInstance = new CartApi(configuration);

let addItemToCartDto: AddItemToCartDto; //

const { status, data } = await apiInstance.cartControllerAddItem(
    addItemToCartDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **addItemToCartDto** | **AddItemToCartDto**|  | |


### Return type

**CartControllerAddItem201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Item added to cart successfully |  -  |
|**404** | Cart not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **cartControllerApplyCoupon**
> MessageOnlyResponse cartControllerApplyCoupon(applyCouponDto)

Validate and apply a coupon code to the cart

### Example

```typescript
import {
    CartApi,
    Configuration,
    ApplyCouponDto
} from './api';

const configuration = new Configuration();
const apiInstance = new CartApi(configuration);

let applyCouponDto: ApplyCouponDto; //

const { status, data } = await apiInstance.cartControllerApplyCoupon(
    applyCouponDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **applyCouponDto** | **ApplyCouponDto**|  | |


### Return type

**MessageOnlyResponse**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Coupon applied successfully |  -  |
|**400** | Invalid coupon or cart is empty |  -  |
|**404** | Cart or coupon not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **cartControllerClearCart**
> MessageOnlyResponse cartControllerClearCart()


### Example

```typescript
import {
    CartApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CartApi(configuration);

const { status, data } = await apiInstance.cartControllerClearCart();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**MessageOnlyResponse**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Cart cleared successfully |  -  |
|**404** | Cart not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **cartControllerGetCart**
> CartControllerGetCart200Response cartControllerGetCart()


### Example

```typescript
import {
    CartApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CartApi(configuration);

const { status, data } = await apiInstance.cartControllerGetCart();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**CartControllerGetCart200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Cart retrieved successfully with full product details |  -  |
|**404** | Cart not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **cartControllerGetCartPricing**
> CartControllerGetCartPricing200Response cartControllerGetCartPricing()

Calculate cart pricing including active offers and optional coupon discount. Returns complete breakdown of all discounts.

### Example

```typescript
import {
    CartApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CartApi(configuration);

let couponCode: string; //Coupon code to apply for pricing calculation (optional) (default to undefined)

const { status, data } = await apiInstance.cartControllerGetCartPricing(
    couponCode
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **couponCode** | [**string**] | Coupon code to apply for pricing calculation | (optional) defaults to undefined|


### Return type

**CartControllerGetCartPricing200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Cart pricing calculated successfully |  -  |
|**404** | Cart not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **cartControllerRemoveItem**
> MessageOnlyResponse cartControllerRemoveItem()


### Example

```typescript
import {
    CartApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CartApi(configuration);

let itemId: string; //Cart item ID (default to undefined)

const { status, data } = await apiInstance.cartControllerRemoveItem(
    itemId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **itemId** | [**string**] | Cart item ID | defaults to undefined|


### Return type

**MessageOnlyResponse**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Item removed successfully |  -  |
|**403** | Not authorized to modify this item |  -  |
|**404** | Cart item not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **cartControllerUpdateItem**
> CartControllerAddItem201Response cartControllerUpdateItem(updateCartItemDto)


### Example

```typescript
import {
    CartApi,
    Configuration,
    UpdateCartItemDto
} from './api';

const configuration = new Configuration();
const apiInstance = new CartApi(configuration);

let itemId: string; //Cart item ID (default to undefined)
let updateCartItemDto: UpdateCartItemDto; //

const { status, data } = await apiInstance.cartControllerUpdateItem(
    itemId,
    updateCartItemDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateCartItemDto** | **UpdateCartItemDto**|  | |
| **itemId** | [**string**] | Cart item ID | defaults to undefined|


### Return type

**CartControllerAddItem201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Item quantity updated successfully |  -  |
|**403** | Not authorized to modify this item |  -  |
|**404** | Cart item not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

