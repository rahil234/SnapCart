# ProfilePictureUploadResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**provider** | **string** | Storage provider (cloudinary or azure) | [default to undefined]
**uploadUrl** | **string** | Upload URL | [default to undefined]
**method** | **string** | HTTP method to use for upload | [default to undefined]
**fields** | **object** | Additional fields required for upload (for Cloudinary) | [optional] [default to undefined]
**readUrl** | **string** | Read URL for the uploaded file (for Azure) | [optional] [default to undefined]

## Example

```typescript
import { ProfilePictureUploadResponseDto } from './api';

const instance: ProfilePictureUploadResponseDto = {
    provider,
    uploadUrl,
    method,
    fields,
    readUrl,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
