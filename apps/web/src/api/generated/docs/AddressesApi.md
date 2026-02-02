# AddressesApi

All URIs are relative to *http://localhost:4000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addressControllerCreate**](#addresscontrollercreate) | **POST** /api/addresses | Create address|
|[**addressControllerDelete**](#addresscontrollerdelete) | **DELETE** /api/addresses/{id} | Delete address|
|[**addressControllerUpdate**](#addresscontrollerupdate) | **PATCH** /api/addresses/{id} | Update address|

# **addressControllerCreate**
> AddressControllerCreate201Response addressControllerCreate(createAddressDto)

Creates a new address for the authenticated user

### Example

```typescript
import {
    AddressesApi,
    Configuration,
    CreateAddressDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AddressesApi(configuration);

let createAddressDto: CreateAddressDto; //

const { status, data } = await apiInstance.addressControllerCreate(
    createAddressDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createAddressDto** | **CreateAddressDto**|  | |


### Return type

**AddressControllerCreate201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Address created successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **addressControllerDelete**
> AddressControllerDelete200Response addressControllerDelete()

Deletes an existing address for the authenticated user

### Example

```typescript
import {
    AddressesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AddressesApi(configuration);

let id: string; //Address UUID (default to undefined)

const { status, data } = await apiInstance.addressControllerDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Address UUID | defaults to undefined|


### Return type

**AddressControllerDelete200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Address deleted successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Address not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **addressControllerUpdate**
> AddressControllerCreate201Response addressControllerUpdate(updateAddressDto)

Updates an existing address for the authenticated user

### Example

```typescript
import {
    AddressesApi,
    Configuration,
    UpdateAddressDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AddressesApi(configuration);

let id: string; //Address UUID (default to undefined)
let updateAddressDto: UpdateAddressDto; //

const { status, data } = await apiInstance.addressControllerUpdate(
    id,
    updateAddressDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateAddressDto** | **UpdateAddressDto**|  | |
| **id** | [**string**] | Address UUID | defaults to undefined|


### Return type

**AddressControllerCreate201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Address updated successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Address not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

