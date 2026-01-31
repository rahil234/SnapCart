# AdminApi

All URIs are relative to *http://api.dev.cloudberrytryon.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**adminControllerGetMe**](#admincontrollergetme) | **GET** /api/admin/me | |

# **adminControllerGetMe**
> AdminControllerGetMe200Response adminControllerGetMe()


### Example

```typescript
import {
    AdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

const { status, data } = await apiInstance.adminControllerGetMe();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**AdminControllerGetMe200Response**

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

