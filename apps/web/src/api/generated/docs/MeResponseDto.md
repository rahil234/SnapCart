# MeResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**userId** | **string** |  | [default to undefined]
**email** | **string** |  | [optional] [default to undefined]
**role** | **string** |  | [default to undefined]
**status** | **string** |  | [default to undefined]
**customerProfile** | [**CustomerProfileDto**](CustomerProfileDto.md) |  | [optional] [default to undefined]
**sellerProfile** | [**SellerProfileDto**](SellerProfileDto.md) |  | [optional] [default to undefined]

## Example

```typescript
import { MeResponseDto } from './api';

const instance: MeResponseDto = {
    userId,
    email,
    role,
    status,
    customerProfile,
    sellerProfile,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
