# FeedsApi

All URIs are relative to *http://localhost:4000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**feedControllerGetFeed**](#feedcontrollergetfeed) | **GET** /api/feed | Get category product feed|

# **feedControllerGetFeed**
> FeedControllerGetFeed200Response feedControllerGetFeed()

Retrieves categories with their products for feed display

### Example

```typescript
import {
    FeedsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FeedsApi(configuration);

const { status, data } = await apiInstance.feedControllerGetFeed();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**FeedControllerGetFeed200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Feed retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

