# OffersApi

All URIs are relative to *http://localhost:4000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**offerControllerGetActiveOffers**](#offercontrollergetactiveoffers) | **GET** /api/offers | Get all active offers|
|[**offerControllerGetOffer**](#offercontrollergetoffer) | **GET** /api/offers/{id} | Get offer by ID|
|[**offerControllerGetProductOffers**](#offercontrollergetproductoffers) | **GET** /api/offers/product/{productId} | Get offers for product|

# **offerControllerGetActiveOffers**
> OfferControllerGetActiveOffers200Response offerControllerGetActiveOffers()

Returns all currently active offers sorted by priority

### Example

```typescript
import {
    OffersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OffersApi(configuration);

const { status, data } = await apiInstance.offerControllerGetActiveOffers();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**OfferControllerGetActiveOffers200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Active offers retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **offerControllerGetOffer**
> OfferControllerGetOffer200Response offerControllerGetOffer()

Retrieve detailed information about a specific offer

### Example

```typescript
import {
    OffersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OffersApi(configuration);

let id: string; //Offer ID (default to undefined)

const { status, data } = await apiInstance.offerControllerGetOffer(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Offer ID | defaults to undefined|


### Return type

**OfferControllerGetOffer200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Offer retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**404** | Offer not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **offerControllerGetProductOffers**
> OfferControllerGetActiveOffers200Response offerControllerGetProductOffers()

Returns all active offers applicable to a specific product, sorted by priority

### Example

```typescript
import {
    OffersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OffersApi(configuration);

let productId: string; //Product ID (default to undefined)

const { status, data } = await apiInstance.offerControllerGetProductOffers(
    productId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **productId** | [**string**] | Product ID | defaults to undefined|


### Return type

**OfferControllerGetActiveOffers200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Product offers retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

