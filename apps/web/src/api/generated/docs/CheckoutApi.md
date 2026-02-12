# CheckoutApi

All URIs are relative to *http://localhost:4000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**checkoutControllerCommitCheckout**](#checkoutcontrollercommitcheckout) | **POST** /api/checkout/commit | Commit checkout and create order|
|[**checkoutControllerPreviewCheckout**](#checkoutcontrollerpreviewcheckout) | **POST** /api/checkout/preview | Preview checkout pricing|

# **checkoutControllerCommitCheckout**
> CheckoutControllerCommitCheckout201Response checkoutControllerCommitCheckout(checkoutCommitDto)

Creates an order with pricing snapshot. Revalidates coupon, records usage, and clears cart if source is CART.

### Example

```typescript
import {
    CheckoutApi,
    Configuration,
    CheckoutCommitDto
} from './api';

const configuration = new Configuration();
const apiInstance = new CheckoutApi(configuration);

let checkoutCommitDto: CheckoutCommitDto; //

const { status, data } = await apiInstance.checkoutControllerCommitCheckout(
    checkoutCommitDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **checkoutCommitDto** | **CheckoutCommitDto**|  | |


### Return type

**CheckoutControllerCommitCheckout201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Order created successfully |  -  |
|**400** | Cart is empty or invalid request |  -  |
|**404** | Coupon or shipping address not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **checkoutControllerPreviewCheckout**
> CheckoutControllerPreviewCheckout200Response checkoutControllerPreviewCheckout(checkoutPreviewDto)

Get pricing breakdown for checkout without committing. Validates coupon if provided. Safe to call multiple times.

### Example

```typescript
import {
    CheckoutApi,
    Configuration,
    CheckoutPreviewDto
} from './api';

const configuration = new Configuration();
const apiInstance = new CheckoutApi(configuration);

let checkoutPreviewDto: CheckoutPreviewDto; //

const { status, data } = await apiInstance.checkoutControllerPreviewCheckout(
    checkoutPreviewDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **checkoutPreviewDto** | **CheckoutPreviewDto**|  | |


### Return type

**CheckoutControllerPreviewCheckout200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Checkout preview retrieved successfully |  -  |
|**400** | Cart is empty or invalid request |  -  |
|**404** | Coupon not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

