# AdminOffersApi

All URIs are relative to *http://localhost:4000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**adminOfferControllerActivate**](#adminoffercontrolleractivate) | **PATCH** /api/admin/offers/{id}/activate | Activate offer|
|[**adminOfferControllerCreate**](#adminoffercontrollercreate) | **POST** /api/admin/offers | Create new offer|
|[**adminOfferControllerDeactivate**](#adminoffercontrollerdeactivate) | **PATCH** /api/admin/offers/{id}/deactivate | Deactivate offer|
|[**adminOfferControllerFindAll**](#adminoffercontrollerfindall) | **GET** /api/admin/offers | Get all offers|
|[**adminOfferControllerFindOne**](#adminoffercontrollerfindone) | **GET** /api/admin/offers/{id} | Get offer by ID|
|[**adminOfferControllerUpdate**](#adminoffercontrollerupdate) | **PATCH** /api/admin/offers/{id} | Update offer|

# **adminOfferControllerActivate**
> MessageOnlyResponse adminOfferControllerActivate()

Activate an offer to make it available

### Example

```typescript
import {
    AdminOffersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminOffersApi(configuration);

let id: string; //Offer ID (default to undefined)

const { status, data } = await apiInstance.adminOfferControllerActivate(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Offer ID | defaults to undefined|


### Return type

**MessageOnlyResponse**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Offer activated successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Offer not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminOfferControllerCreate**
> OfferControllerGetOffer200Response adminOfferControllerCreate(createOfferDto)

Create a new promotional offer with priority and applicability rules

### Example

```typescript
import {
    AdminOffersApi,
    Configuration,
    CreateOfferDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminOffersApi(configuration);

let createOfferDto: CreateOfferDto; //

const { status, data } = await apiInstance.adminOfferControllerCreate(
    createOfferDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createOfferDto** | **CreateOfferDto**|  | |


### Return type

**OfferControllerGetOffer200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Offer created successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminOfferControllerDeactivate**
> MessageOnlyResponse adminOfferControllerDeactivate()

Deactivate an offer to prevent it from being applied

### Example

```typescript
import {
    AdminOffersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminOffersApi(configuration);

let id: string; //Offer ID (default to undefined)

const { status, data } = await apiInstance.adminOfferControllerDeactivate(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Offer ID | defaults to undefined|


### Return type

**MessageOnlyResponse**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Offer deactivated successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Offer not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminOfferControllerFindAll**
> OfferControllerGetActiveOffers200Response adminOfferControllerFindAll()

Retrieve all offers with pagination

### Example

```typescript
import {
    AdminOffersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminOffersApi(configuration);

let page: number; //Page number (optional) (default to undefined)
let limit: number; //Items per page (optional) (default to undefined)

const { status, data } = await apiInstance.adminOfferControllerFindAll(
    page,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Page number | (optional) defaults to undefined|
| **limit** | [**number**] | Items per page | (optional) defaults to undefined|


### Return type

**OfferControllerGetActiveOffers200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Offers retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminOfferControllerFindOne**
> OfferControllerGetOffer200Response adminOfferControllerFindOne()

Retrieve detailed information about a specific offer

### Example

```typescript
import {
    AdminOffersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminOffersApi(configuration);

let id: string; //Offer ID (default to undefined)

const { status, data } = await apiInstance.adminOfferControllerFindOne(
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

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Offer retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Offer not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminOfferControllerUpdate**
> OfferControllerGetOffer200Response adminOfferControllerUpdate(updateOfferDto)

Update offer details and configuration

### Example

```typescript
import {
    AdminOffersApi,
    Configuration,
    UpdateOfferDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminOffersApi(configuration);

let id: string; //Offer ID (default to undefined)
let updateOfferDto: UpdateOfferDto; //

const { status, data } = await apiInstance.adminOfferControllerUpdate(
    id,
    updateOfferDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateOfferDto** | **UpdateOfferDto**|  | |
| **id** | [**string**] | Offer ID | defaults to undefined|


### Return type

**OfferControllerGetOffer200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Offer updated successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Offer not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

