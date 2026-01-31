# OfferApi

All URIs are relative to *http://api.dev.cloudberrytryon.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**offerControllerCreate**](#offercontrollercreate) | **POST** /api/offers | |
|[**offerControllerFindAll**](#offercontrollerfindall) | **GET** /api/offers | |
|[**offerControllerFindProductApplicableOffers**](#offercontrollerfindproductapplicableoffers) | **GET** /api/offers/product/{productId} | |
|[**offerControllerUpdate**](#offercontrollerupdate) | **PUT** /api/offers/{id} | |

# **offerControllerCreate**
> OfferControllerCreate200Response offerControllerCreate(body)


### Example

```typescript
import {
    OfferApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OfferApi(configuration);

let body: object; //

const { status, data } = await apiInstance.offerControllerCreate(
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**|  | |


### Return type

**OfferControllerCreate200Response**

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

# **offerControllerFindAll**
> OfferControllerFindAll200Response offerControllerFindAll()


### Example

```typescript
import {
    OfferApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OfferApi(configuration);

const { status, data } = await apiInstance.offerControllerFindAll();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**OfferControllerFindAll200Response**

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

# **offerControllerFindProductApplicableOffers**
> OfferControllerFindAll200Response offerControllerFindProductApplicableOffers()


### Example

```typescript
import {
    OfferApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OfferApi(configuration);

let productId: string; // (default to undefined)

const { status, data } = await apiInstance.offerControllerFindProductApplicableOffers(
    productId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **productId** | [**string**] |  | defaults to undefined|


### Return type

**OfferControllerFindAll200Response**

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

# **offerControllerUpdate**
> OfferControllerCreate200Response offerControllerUpdate(body)


### Example

```typescript
import {
    OfferApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OfferApi(configuration);

let id: string; // (default to undefined)
let body: object; //

const { status, data } = await apiInstance.offerControllerUpdate(
    id,
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**OfferControllerCreate200Response**

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

