# PaymentApi

All URIs are relative to *http://api.dev.cloudberrytryon.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**paymentControllerVerifyPayment**](#paymentcontrollerverifypayment) | **POST** /api/payment/verify | |

# **paymentControllerVerifyPayment**
> paymentControllerVerifyPayment(body)


### Example

```typescript
import {
    PaymentApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PaymentApi(configuration);

let body: object; //

const { status, data } = await apiInstance.paymentControllerVerifyPayment(
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

