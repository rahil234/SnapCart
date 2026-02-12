# BannersApi

All URIs are relative to *http://localhost:4000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**bannerControllerFindAll**](#bannercontrollerfindall) | **GET** /api/banners | Get active banners|

# **bannerControllerFindAll**
> BannerControllerFindAll200Response bannerControllerFindAll()

Retrieve all active banners for display on the homepage

### Example

```typescript
import {
    BannersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BannersApi(configuration);

let activeOnly: boolean; //Filter to show only active banners (default: true for public) (optional) (default to undefined)

const { status, data } = await apiInstance.bannerControllerFindAll(
    activeOnly
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **activeOnly** | [**boolean**] | Filter to show only active banners (default: true for public) | (optional) defaults to undefined|


### Return type

**BannerControllerFindAll200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Banners retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

