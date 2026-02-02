# Pagination Meta Refactoring - Complete Implementation

## Overview

Successfully refactored the pagination system to use a `meta` object containing all pagination properties instead of flat top-level properties. This provides a cleaner API response structure and better organization of metadata.

## What Changed

### Before (Old Structure)
```json
{
  "message": "Products retrieved successfully",
  "data": [...],
  "page": 1,
  "limit": 10,
  "total": 100
}
```

### After (New Structure with Meta)
```json
{
  "message": "Products retrieved successfully",
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Files Updated

### 1. **Core DTO Structure**
**File:** `/apps/api/src/shared/dto/common/http-response.dto.ts`

**Changes:**
- ✅ Created `PaginationMetaDto` class implementing `PaginationMeta` interface
- ✅ Added all pagination properties: `page`, `limit`, `total`, `hasNextPage`, `hasPrevPage`
- ✅ Each property has proper Swagger documentation
- ✅ Updated `HttpPaginatedResponse` to contain `meta` object instead of flat properties
- ✅ Maintains backward compatibility with existing interface

### 2. **Swagger Decorator Enhancement**
**File:** `/apps/api/src/shared/decorators/api-response.decorator.ts`

**Changes:**
- ✅ Updated pagination schema generation to use `meta` object
- ✅ Properly documents all pagination properties in Swagger UI
- ✅ Schema now shows:
  ```
  meta: {
    page: number,
    limit: number,
    total: number,
    hasNextPage: boolean,
    hasPrevPage: boolean
  }
  ```

### 3. **Product Controller**
**File:** `/apps/api/src/modules/product/interfaces/http/controllers/product.controller.ts`

**Changes:**
- ✅ Updated `findAll()` method return statement
- ✅ Now returns pagination in `meta` object:
  ```typescript
  return {
    message: 'Products retrieved successfully',
    data: result.products.map(ProductResponseDto.fromDomain),
    meta: {
      page: result.meta.page,
      limit: result.meta.limit,
      total: result.meta.total,
      hasNextPage: result.meta.hasNextPage,
      hasPrevPage: result.meta.hasPrevPage,
    },
  };
  ```

### 4. **User Controller**
**File:** `/apps/api/src/modules/user/interfaces/http/user.controller.ts`

**Changes:**
- ✅ Updated `findAll()` method return statement
- ✅ Now returns pagination in `meta` object with all properties

## New Pagination Properties

### `hasNextPage` (boolean)
- **Purpose:** Indicates if there are more pages available after the current page
- **Example:** `true` if `page * limit < total`
- **Usage:** Helps frontend disable/enable next button

### `hasPrevPage` (boolean)
- **Purpose:** Indicates if there are previous pages available
- **Example:** `true` if `page > 1`
- **Usage:** Helps frontend disable/enable previous button

## API Response Examples

### Products List Endpoint
```http
GET /api/products?page=1&limit=10
```

**Response:**
```json
{
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Product 1",
      "description": "...",
      "...": "..."
    },
    "..."
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 157,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Users List Endpoint
```http
GET /api/users?page=2&limit=20
```

**Response:**
```json
{
  "message": "Users fetched successfully",
  "data": [
    {
      "id": "uuid...",
      "email": "user@example.com",
      "role": "customer",
      "...": "..."
    },
    "..."
  ],
  "meta": {
    "page": 2,
    "limit": 20,
    "total": 85,
    "hasNextPage": false,
    "hasPrevPage": true
  }
}
```

## Frontend Usage

### React Example
```typescript
const { data, meta } = await fetchProducts(page, limit);

return (
  <>
    {data.map(product => (
      <ProductCard key={product.id} product={product} />
    ))}
    <Pagination
      currentPage={meta.page}
      hasNext={meta.hasNextPage}
      hasPrev={meta.hasPrevPage}
      total={meta.total}
      pageSize={meta.limit}
    />
  </>
);
```

### Pagination Logic
```typescript
// Calculate total pages
const totalPages = Math.ceil(meta.total / meta.limit);

// Check if can go next
if (meta.hasNextPage) {
  goToPage(meta.page + 1);
}

// Check if can go previous
if (meta.hasPrevPage) {
  goToPage(meta.page - 1);
}

// Display info
console.log(`Page ${meta.page} of ${totalPages}`);
```

## Benefits of This Refactoring

1. **Cleaner Structure** - All pagination data grouped together
2. **Better Organization** - Clear separation of data from metadata
3. **Frontend Friendly** - Easy to destructure and use in UI
4. **Extensible** - Easy to add more pagination properties
5. **Type Safe** - All properties properly typed
6. **Swagger Documentation** - Clear schema in API docs
7. **Helper Properties** - `hasNextPage` and `hasPrevPage` reduce frontend calculations
8. **Consistency** - Same structure across all paginated endpoints

## Breaking Changes

⚠️ **This is a breaking change for API consumers**

Clients using the old flat structure need to update:

**Old Code:**
```typescript
const { data, page, limit, total } = response;
```

**New Code:**
```typescript
const { data, meta } = response;
const { page, limit, total, hasNextPage, hasPrevPage } = meta;
```

## Swagger UI Display

The Swagger documentation now properly displays:

```yaml
HttpPaginatedResponse:
  type: object
  properties:
    message:
      type: string
    data:
      type: array
      items:
        $ref: '#/components/schemas/ItemDto'
    meta:
      type: object
      properties:
        page:
          type: number
          example: 1
        limit:
          type: number
          example: 10
        total:
          type: number
          example: 100
        hasNextPage:
          type: boolean
          example: true
        hasPrevPage:
          type: boolean
          example: false
```

## Affected Endpoints

### Paginated Endpoints (Updated)
- ✅ `GET /api/products` - Product list with pagination
- ✅ `GET /api/users` - Users list with pagination

### Non-Paginated Endpoints (Unchanged)
- All single resource endpoints (`GET /api/products/:id`)
- All creation endpoints (`POST /api/products`)
- All update endpoints (`PATCH /api/products/:id`)
- All delete endpoints (`DELETE /api/products/:id`)

## Testing Checklist

- [x] All controllers compile without errors
- [x] DTO structure properly implements interface
- [x] Swagger decorator generates correct schema
- [x] All pagination properties included in response
- [x] hasNextPage calculation correct
- [x] hasPrevPage calculation correct
- [x] Type safety maintained

## Migration Guide for Backend Developers

### Adding Pagination to New Endpoints

1. **Import the DTO:**
```typescript
import { HttpPaginatedResponse } from '@/shared/dto/common/http-response.dto';
```

2. **Set return type:**
```typescript
async findAll(@Query() query: GetItemsDto): Promise<HttpPaginatedResponse<ItemResponseDto[]>> {
```

3. **Return with meta object:**
```typescript
return {
  message: 'Items retrieved successfully',
  data: result.items,
  meta: {
    page: result.page,
    limit: result.limit,
    total: result.total,
    hasNextPage: result.page * result.limit < result.total,
    hasPrevPage: result.page > 1,
  },
};
```

4. **Add Swagger decorator:**
```typescript
@ApiResponseWithType(
  {
    status: HttpStatus.OK,
    description: 'Items retrieved successfully',
    pagination: true,
    isArray: true,
  },
  ItemResponseDto,
)
```

## Migration Guide for Frontend Developers

### Update API Response Handling

**Before:**
```typescript
const response = await api.get('/products', { page: 1, limit: 10 });
const { data, page, limit, total } = response;
```

**After:**
```typescript
const response = await api.get('/products', { page: 1, limit: 10 });
const { data, meta } = response;
const { page, limit, total, hasNextPage, hasPrevPage } = meta;
```

### Update Pagination Components

**Before:**
```typescript
<Pagination
  page={apiResponse.page}
  limit={apiResponse.limit}
  total={apiResponse.total}
/>
```

**After:**
```typescript
<Pagination
  page={apiResponse.meta.page}
  limit={apiResponse.meta.limit}
  total={apiResponse.meta.total}
  hasNextPage={apiResponse.meta.hasNextPage}
  hasPrevPage={apiResponse.meta.hasPrevPage}
/>
```

## Compilation Status

✅ **All files compile successfully with no errors**

## Next Steps

1. **Update Frontend** - Refactor all API response handlers to use new `meta` structure
2. **Update Clients** - Notify all API consumers of breaking change
3. **Update Documentation** - Update API documentation on public docs site
4. **Monitor Usage** - Watch for any client errors during rollout
5. **Consider Other Endpoints** - Apply same pattern to any other paginated endpoints

## Summary

The pagination refactoring is complete and production-ready. All controllers return pagination data in a clean `meta` object containing:
- `page` - Current page number
- `limit` - Items per page
- `total` - Total items in collection
- `hasNextPage` - Boolean indicating next page existence
- `hasPrevPage` - Boolean indicating previous page existence

This provides a cleaner, more organized API response structure that's easier for frontend developers to work with.
