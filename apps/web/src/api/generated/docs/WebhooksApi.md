# WebhooksApi

All URIs are relative to *http://localhost:4000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**webhookControllerHandleRazorpayWebhook**](#webhookcontrollerhandlerazorpaywebhook) | **POST** /api/webhooks/razorpay | Handle Razorpay webhook|

# **webhookControllerHandleRazorpayWebhook**
> webhookControllerHandleRazorpayWebhook()

Process payment confirmation webhooks from Razorpay

### Example

```typescript
import {
    WebhooksApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WebhooksApi(configuration);

let xRazorpaySignature: string; // (default to undefined)
let xRazorpaySignature2: string; //Webhook signature for verification (default to undefined)

const { status, data } = await apiInstance.webhookControllerHandleRazorpayWebhook(
    xRazorpaySignature,
    xRazorpaySignature2
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **xRazorpaySignature** | [**string**] |  | defaults to undefined|
| **xRazorpaySignature2** | [**string**] | Webhook signature for verification | defaults to undefined|


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
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

