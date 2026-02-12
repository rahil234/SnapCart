# UploadVariantImageResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**provider** | **string** | Image storage provider | [default to undefined]
**uploadUrl** | **string** | URL of the storage bucket to upload the image to | [default to undefined]
**method** | **string** | HTTP method to use for upload | [default to undefined]
**readUrl** | **string** | URL to read/access the uploaded image | [optional] [default to undefined]
**fields** | **object** | Additional fields required for the upload | [optional] [default to undefined]

## Example

```typescript
import { UploadVariantImageResponseDto } from './api';

const instance: UploadVariantImageResponseDto = {
    provider,
    uploadUrl,
    method,
    readUrl,
    fields,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
