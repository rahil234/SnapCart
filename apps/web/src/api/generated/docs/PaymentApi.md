# PaymentApi

All URIs are relative to *http://localhost:4000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**paymentControllerCreatePayment**](#paymentcontrollercreatepayment) | **POST** /api/payment/create | Create Razorpay payment order|
|[**paymentControllerVerifyPayment**](#paymentcontrollerverifypayment) | **POST** /api/payment/verify | Verify Razorpay payment|

# **paymentControllerCreatePayment**
> PaymentControllerCreatePayment200Response paymentControllerCreatePayment(createPaymentDto)

Creates a Razorpay order for the given order ID

### Example

```typescript
import {
    PaymentApi,
    Configuration,
    CreatePaymentDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PaymentApi(configuration);

let createPaymentDto: CreatePaymentDto; //

const { status, data } = await apiInstance.paymentControllerCreatePayment(
    createPaymentDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPaymentDto** | **CreatePaymentDto**|  | |


### Return type

**PaymentControllerCreatePayment200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Razorpay order created successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Order not found not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **paymentControllerVerifyPayment**
> PaymentControllerVerifyPayment200Response paymentControllerVerifyPayment(verifyPaymentDto)

Verifies the Razorpay payment and updates order status

### Example

```typescript
import {
    PaymentApi,
    Configuration,
    VerifyPaymentDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PaymentApi(configuration);

let verifyPaymentDto: VerifyPaymentDto; //

const { status, data } = await apiInstance.paymentControllerVerifyPayment(
    verifyPaymentDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **verifyPaymentDto** | **VerifyPaymentDto**|  | |


### Return type

**PaymentControllerVerifyPayment200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Payment verified successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Order not found not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

