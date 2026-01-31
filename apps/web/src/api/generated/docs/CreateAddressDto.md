# CreateAddressDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**houseNo** | **string** | House number | [optional] [default to undefined]
**street** | **string** | Street | [optional] [default to undefined]
**city** | **string** | City | [optional] [default to undefined]
**state** | **string** | State | [optional] [default to undefined]
**country** | **string** | Country | [optional] [default to undefined]
**pincode** | **string** | Pincode | [optional] [default to undefined]
**isPrimary** | **boolean** | Is primary address | [optional] [default to false]

## Example

```typescript
import { CreateAddressDto } from './api';

const instance: CreateAddressDto = {
    houseNo,
    street,
    city,
    state,
    country,
    pincode,
    isPrimary,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
