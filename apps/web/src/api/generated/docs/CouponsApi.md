# CouponsApi

All URIs are relative to *http://localhost:4000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**couponControllerGetAvailableCoupons**](#couponcontrollergetavailablecoupons) | **GET** /api/coupons/available | Get available coupons for user|
|[**couponControllerGetCouponByCode**](#couponcontrollergetcouponbycode) | **GET** /api/coupons/code/{code} | Get coupon by code|
|[**couponControllerValidateCoupon**](#couponcontrollervalidatecoupon) | **POST** /api/coupons/validate | Validate coupon for cart|

# **couponControllerGetAvailableCoupons**
> CouponControllerGetAvailableCoupons200Response couponControllerGetAvailableCoupons()

Returns all active coupons that the user can still use based on per-user usage limits

### Example

```typescript
import {
    CouponsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CouponsApi(configuration);

const { status, data } = await apiInstance.couponControllerGetAvailableCoupons();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**CouponControllerGetAvailableCoupons200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Available coupons retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **couponControllerGetCouponByCode**
> CouponControllerGetCouponByCode200Response couponControllerGetCouponByCode()

Retrieve coupon details by code

### Example

```typescript
import {
    CouponsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CouponsApi(configuration);

let code: string; //Coupon code (default to undefined)

const { status, data } = await apiInstance.couponControllerGetCouponByCode(
    code
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **code** | [**string**] | Coupon code | defaults to undefined|


### Return type

**CouponControllerGetCouponByCode200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Coupon retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Coupon not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **couponControllerValidateCoupon**
> CouponControllerValidateCoupon200Response couponControllerValidateCoupon(validateCouponDto)

Validates if a coupon can be applied to the cart with given total. Returns discount amount if valid.

### Example

```typescript
import {
    CouponsApi,
    Configuration,
    ValidateCouponDto
} from './api';

const configuration = new Configuration();
const apiInstance = new CouponsApi(configuration);

let validateCouponDto: ValidateCouponDto; //

const { status, data } = await apiInstance.couponControllerValidateCoupon(
    validateCouponDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **validateCouponDto** | **ValidateCouponDto**|  | |


### Return type

**CouponControllerValidateCoupon200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Coupon validation result |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

