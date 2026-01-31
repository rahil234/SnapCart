# AnalyticsApi

All URIs are relative to *http://api.dev.cloudberrytryon.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**analyticsControllerGet**](#analyticscontrollerget) | **GET** /api/analytics | |

# **analyticsControllerGet**
> AnalyticsControllerGet200Response analyticsControllerGet()


### Example

```typescript
import {
    AnalyticsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AnalyticsApi(configuration);

const { status, data } = await apiInstance.analyticsControllerGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**AnalyticsControllerGet200Response**

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

