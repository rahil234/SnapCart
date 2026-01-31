# LandingPageApi

All URIs are relative to *http://api.dev.cloudberrytryon.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**landingPageControllerGet**](#landingpagecontrollerget) | **GET** /api/landing-page | |
|[**landingPageControllerUpdate**](#landingpagecontrollerupdate) | **PATCH** /api/landing-page | |

# **landingPageControllerGet**
> LandingPageControllerGet200Response landingPageControllerGet()


### Example

```typescript
import {
    LandingPageApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LandingPageApi(configuration);

const { status, data } = await apiInstance.landingPageControllerGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**LandingPageControllerGet200Response**

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

# **landingPageControllerUpdate**
> HttpResponseWithoutData landingPageControllerUpdate(updateLandingPageDto)


### Example

```typescript
import {
    LandingPageApi,
    Configuration,
    UpdateLandingPageDto
} from './api';

const configuration = new Configuration();
const apiInstance = new LandingPageApi(configuration);

let updateLandingPageDto: UpdateLandingPageDto; //

const { status, data } = await apiInstance.landingPageControllerUpdate(
    updateLandingPageDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateLandingPageDto** | **UpdateLandingPageDto**|  | |


### Return type

**HttpResponseWithoutData**

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

