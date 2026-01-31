# CartApi

All URIs are relative to *http://api.dev.cloudberrytryon.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**cartControllerAddToCart**](#cartcontrolleraddtocart) | **POST** /api/cart/add | |
|[**cartControllerCheckout**](#cartcontrollercheckout) | **POST** /api/cart/checkout | |
|[**cartControllerCheckoutLink**](#cartcontrollercheckoutlink) | **POST** /api/cart/checkout/link | |
|[**cartControllerGetUserCart**](#cartcontrollergetusercart) | **GET** /api/cart | |
|[**cartControllerRemoveItem**](#cartcontrollerremoveitem) | **DELETE** /api/cart/{itemId} | |
|[**cartControllerUpdateQuantity**](#cartcontrollerupdatequantity) | **PATCH** /api/cart/{itemId} | |

# **cartControllerAddToCart**
> CartControllerAddToCart200Response cartControllerAddToCart(createCartDto)


### Example

```typescript
import {
    CartApi,
    Configuration,
    CreateCartDto
} from './api';

const configuration = new Configuration();
const apiInstance = new CartApi(configuration);

let createCartDto: CreateCartDto; //

const { status, data } = await apiInstance.cartControllerAddToCart(
    createCartDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createCartDto** | **CreateCartDto**|  | |


### Return type

**CartControllerAddToCart200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **cartControllerCheckout**
> CartControllerCheckout200Response cartControllerCheckout()


### Example

```typescript
import {
    CartApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CartApi(configuration);

const { status, data } = await apiInstance.cartControllerCheckout();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**CartControllerCheckout200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **cartControllerCheckoutLink**
> CartControllerCheckoutLink200Response cartControllerCheckoutLink()


### Example

```typescript
import {
    CartApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CartApi(configuration);

const { status, data } = await apiInstance.cartControllerCheckoutLink();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**CartControllerCheckoutLink200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **cartControllerGetUserCart**
> CartControllerGetUserCart200Response cartControllerGetUserCart()


### Example

```typescript
import {
    CartApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CartApi(configuration);

const { status, data } = await apiInstance.cartControllerGetUserCart();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**CartControllerGetUserCart200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **cartControllerRemoveItem**
> cartControllerRemoveItem()


### Example

```typescript
import {
    CartApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CartApi(configuration);

let itemId: string; // (default to undefined)

const { status, data } = await apiInstance.cartControllerRemoveItem(
    itemId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **itemId** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Item removed from cart successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **cartControllerUpdateQuantity**
> CartControllerAddToCart200Response cartControllerUpdateQuantity(updateCartDto)


### Example

```typescript
import {
    CartApi,
    Configuration,
    UpdateCartDto
} from './api';

const configuration = new Configuration();
const apiInstance = new CartApi(configuration);

let itemId: string; // (default to undefined)
let updateCartDto: UpdateCartDto; //

const { status, data } = await apiInstance.cartControllerUpdateQuantity(
    itemId,
    updateCartDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateCartDto** | **UpdateCartDto**|  | |
| **itemId** | [**string**] |  | defaults to undefined|


### Return type

**CartControllerAddToCart200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

