# Before & After Comparison - Pagination Meta Refactoring

## API Response Structure

### BEFORE (Old Flat Structure)
```json
{
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Product 1",
      "description": "...",
      "price": 299
    },
    {
      "id": "223e5678-f90c-23e4-b567-537725285111",
      "name": "Product 2",
      "description": "...",
      "price": 399
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 157
}
```

### AFTER (New Meta Object Structure)
```json
{
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Product 1",
      "description": "...",
      "price": 299
    },
    {
      "id": "223e5678-f90c-23e4-b567-537725285111",
      "name": "Product 2",
      "description": "...",
      "price": 399
    }
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

---

## TypeScript Types

### BEFORE
```typescript
export class HttpPaginatedResponse<T = any>
  extends HttpResponse<T>
  implements HTTP_PAGINATED_RESPONSE
{
  @ApiProperty({
    example: 10,
  })
  total: number;

  @ApiProperty({
    example: 10,
  })
  limit: number;

  @ApiProperty({
    example: 1,
  })
  page: number;
}
```

### AFTER
```typescript
export class PaginationMetaDto implements PaginationMeta {
  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Whether there is a next page',
    example: true,
  })
  hasNextPage: boolean;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false,
  })
  hasPrevPage: boolean;
}

export class HttpPaginatedResponse<T = any> extends HttpResponse<T> {
  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}
```

---

## Controller Return Statements

### BEFORE (Product Controller)
```typescript
@Get()
@Public()
@ApiOperation({
  summary: 'List all products (with pagination)',
  description: 'Retrieves paginated list of products with optional filtering.',
})
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'limit', required: false, example: 10 })
@ApiQuery({ name: 'search', required: false })
@ApiQuery({ name: 'categoryId', required: false })
@ApiQuery({ name: 'status', required: false })
@ApiResponse({
  status: HttpStatus.OK,
  description: 'Products retrieved successfully',
})
async findAll(
  @Query() query: GetProductsDto,
): Promise<HttpPaginatedResponse<ProductResponseDto[]>> {
  const getProductsQuery = new GetProductsQuery(
    query.page,
    query.limit,
    query.search,
    query.status,
    query.categoryId,
  );

  const result = await this.queryBus.execute(getProductsQuery);

  return {
    message: 'Products retrieved successfully',
    data: result.products.map(ProductResponseDto.fromDomain),
    total: result.meta.total,
    page: result.meta.page,
    limit: result.meta.limit,
  };
}
```

### AFTER (Product Controller)
```typescript
@Get()
@Public()
@ApiOperation({
  summary: 'List all products (with pagination)',
  description: 'Retrieves paginated list of products with optional filtering.',
})
@ApiResponseWithType(
  {
    status: HttpStatus.OK,
    description: 'Products retrieved successfully',
    pagination: true,
    isArray: true,
  },
  ProductResponseDto,
)
@ApiCommonErrorResponses()
async findAll(
  @Query() query: GetProductsDto,
): Promise<HttpPaginatedResponse<ProductResponseDto[]>> {
  const getProductsQuery = new GetProductsQuery(
    query.page,
    query.limit,
    query.search,
    query.status,
    query.categoryId,
  );

  const result = await this.queryBus.execute(getProductsQuery);

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
}
```

---

## Frontend Code

### BEFORE (React)
```typescript
// Destructuring from response
const response = await api.get('/products', { page: 1, limit: 10 });
const { data, page, limit, total } = response;

// Need to manually calculate
const totalPages = Math.ceil(total / limit);
const canGoNext = page * limit < total;
const canGoPrev = page > 1;

// Rendering
<Pagination
  currentPage={page}
  totalPages={totalPages}
  canNext={canGoNext}
  canPrev={canGoPrev}
  onPageChange={(newPage) => fetchPage(newPage)}
/>
```

### AFTER (React)
```typescript
// Destructuring from meta object
const response = await api.get('/products', { page: 1, limit: 10 });
const { data, meta } = response;

// All needed values already in meta
const totalPages = Math.ceil(meta.total / meta.limit);

// Rendering (simpler - already have the helpers)
<Pagination
  currentPage={meta.page}
  totalPages={totalPages}
  canNext={meta.hasNextPage}      // ← Helper provided
  canPrev={meta.hasPrevPage}      // ← Helper provided
  onPageChange={(newPage) => fetchPage(newPage)}
/>
```

---

## Swagger Schema

### BEFORE
```yaml
components:
  schemas:
    HttpPaginatedResponse:
      type: object
      properties:
        message:
          type: string
        data:
          type: array
          items:
            $ref: '#/components/schemas/ProductResponseDto'
        page:
          type: number
          example: 1
        limit:
          type: number
          example: 10
        total:
          type: number
          example: 157
```

### AFTER
```yaml
components:
  schemas:
    PaginationMetaDto:
      type: object
      properties:
        page:
          type: number
          description: Current page number
          example: 1
        limit:
          type: number
          description: Number of items per page
          example: 10
        total:
          type: number
          description: Total number of items
          example: 157
        hasNextPage:
          type: boolean
          description: Whether there is a next page
          example: true
        hasPrevPage:
          type: boolean
          description: Whether there is a previous page
          example: false

    HttpPaginatedResponse:
      type: object
      properties:
        message:
          type: string
        data:
          type: array
          items:
            $ref: '#/components/schemas/ProductResponseDto'
        meta:
          $ref: '#/components/schemas/PaginationMetaDto'
```

---

## Query Parameters

### BEFORE
```typescript
// Same query params
GET /api/products?page=1&limit=10
GET /api/users?page=2&limit=20
```

### AFTER
```typescript
// Query params unchanged
GET /api/products?page=1&limit=10
GET /api/users?page=2&limit=20
```

✅ **Query parameters remain the same - no breaking changes on request side**

---

## Error Handling

### BEFORE
```typescript
try {
  const response = await fetchProducts(page, limit);
  setData(response.data);
  setPage(response.page);
  setTotal(response.total);
} catch (error) {
  handleError(error);
}
```

### AFTER
```typescript
try {
  const response = await fetchProducts(page, limit);
  setData(response.data);
  setMeta(response.meta);  // ← Single assignment
} catch (error) {
  handleError(error);
}
```

---

## Pagination Logic

### BEFORE
```typescript
// Need to calculate pagination properties
const page = response.page;
const limit = response.limit;
const total = response.total;
const totalPages = Math.ceil(total / limit);
const hasNextPage = page * limit < total;
const hasPrevPage = page > 1;

// Use in template
<Button disabled={!hasNextPage} onClick={goNext}>Next</Button>
<Button disabled={!hasPrevPage} onClick={goPrev}>Previous</Button>
```

### AFTER
```typescript
// All pagination properties provided
const { page, limit, total, hasNextPage, hasPrevPage } = response.meta;
const totalPages = Math.ceil(total / limit);

// Use in template (simpler)
<Button disabled={!hasNextPage} onClick={goNext}>Next</Button>
<Button disabled={!hasPrevPage} onClick={goPrev}>Previous</Button>
```

---

## Benefits Summary

| Aspect | Before | After |
|--------|--------|-------|
| **Structure** | Flat, mixed with data | Organized in meta object |
| **Clarity** | Unclear separation | Clear data vs metadata |
| **Helper Props** | Need to calculate | Provided (hasNextPage, hasPrevPage) |
| **Extensibility** | Harder to add props | Easy to extend meta |
| **Swagger Docs** | Less organized | Clear grouped properties |
| **Frontend Code** | More calculations | Less logic needed |
| **Type Safety** | Mixed in response | Separate DTO type |
| **Maintainability** | Scattered logic | Centralized pagination |

---

## Migration Path

### Step 1: Update Type Definitions
```typescript
// Old
interface ApiResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

// New
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ApiResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
```

### Step 2: Update API Calls
```typescript
// Old
const { data, page, total } = response;

// New
const { data, meta } = response;
const { page, total } = meta;
```

### Step 3: Update Components
```typescript
// Old
<Pagination page={data.page} total={data.total} limit={data.limit} />

// New
<Pagination {...data.meta} />
```

### Step 4: Update State Management
```typescript
// Old
const [page, setPage] = useState(1);
const [limit, setLimit] = useState(10);
const [total, setTotal] = useState(0);

// New
const [meta, setMeta] = useState<PaginationMeta>({
  page: 1,
  limit: 10,
  total: 0,
  hasNextPage: false,
  hasPrevPage: false,
});
```

---

## Conclusion

The refactoring provides a **cleaner, more organized API** with:
- ✅ Better separation of concerns (data vs metadata)
- ✅ Reduced frontend calculations
- ✅ Improved Swagger documentation
- ✅ More extensible structure
- ✅ Better type safety
