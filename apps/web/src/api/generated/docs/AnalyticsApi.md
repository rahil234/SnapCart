# AnalyticsApi

All URIs are relative to *http://localhost:4000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**analyticsControllerGetAdminDashboard**](#analyticscontrollergetadmindashboard) | **GET** /api/analytics/admin-dashboard | Get admin dashboard analytics|
|[**analyticsControllerGetSalesReport**](#analyticscontrollergetsalesreport) | **GET** /api/analytics/sales-report | Get sales report with date filtering|
|[**analyticsControllerGetSellerDashboard**](#analyticscontrollergetsellerdashboard) | **GET** /api/analytics/seller-dashboard | Get seller dashboard analytics|

# **analyticsControllerGetAdminDashboard**
> AnalyticsControllerGetAdminDashboard200Response analyticsControllerGetAdminDashboard()


### Example

```typescript
import {
    AnalyticsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AnalyticsApi(configuration);

const { status, data } = await apiInstance.analyticsControllerGetAdminDashboard();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**AnalyticsControllerGetAdminDashboard200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Admin dashboard data |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **analyticsControllerGetSalesReport**
> AnalyticsControllerGetSalesReport200Response analyticsControllerGetSalesReport()


### Example

```typescript
import {
    AnalyticsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AnalyticsApi(configuration);

let timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly'; //Timeframe for grouping sales data (default to undefined)
let startDate: string; //Start date in YYYY-MM-DD format (default to undefined)
let endDate: string; //End date in YYYY-MM-DD format (default to undefined)

const { status, data } = await apiInstance.analyticsControllerGetSalesReport(
    timeframe,
    startDate,
    endDate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **timeframe** | [**&#39;daily&#39; | &#39;weekly&#39; | &#39;monthly&#39; | &#39;yearly&#39;**]**Array<&#39;daily&#39; &#124; &#39;weekly&#39; &#124; &#39;monthly&#39; &#124; &#39;yearly&#39;>** | Timeframe for grouping sales data | defaults to undefined|
| **startDate** | [**string**] | Start date in YYYY-MM-DD format | defaults to undefined|
| **endDate** | [**string**] | End date in YYYY-MM-DD format | defaults to undefined|


### Return type

**AnalyticsControllerGetSalesReport200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Sales report data |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **analyticsControllerGetSellerDashboard**
> AnalyticsControllerGetSellerDashboard200Response analyticsControllerGetSellerDashboard()


### Example

```typescript
import {
    AnalyticsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AnalyticsApi(configuration);

const { status, data } = await apiInstance.analyticsControllerGetSellerDashboard();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**AnalyticsControllerGetSellerDashboard200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Seller dashboard data |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

