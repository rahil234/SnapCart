# UpdateAddressDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**houseNo** | **string** | House number (set to null to clear) | [optional] [default to undefined]
**street** | **string** | Street (set to null to clear) | [optional] [default to undefined]
**city** | **string** | City (set to null to clear) | [optional] [default to undefined]
**state** | **string** | State (set to null to clear) | [optional] [default to undefined]
**country** | **string** | Country (set to null to clear) | [optional] [default to undefined]
**pincode** | **string** | Pincode (set to null to clear) | [optional] [default to undefined]
**isPrimary** | **boolean** | Is primary address | [optional] [default to undefined]

## Example

```typescript
import { UpdateAddressDto } from './api';

const instance: UpdateAddressDto = {
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
