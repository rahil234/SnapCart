# Pagination Meta - Quick Reference Guide

## Response Structure

All paginated API responses now follow this structure:

```typescript
{
  message: string;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
```

## Example Response

### Request
```bash
GET /api/products?page=1&limit=10
```

### Response
```json
{
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Basmati Rice",
      "description": "Premium rice",
      "price": 299
    },
    "... 9 more items ..."
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

## Meta Properties Explained

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `page` | number | Current page number (1-indexed) | `1` |
| `limit` | number | Items per page | `10` |
| `total` | number | Total items in collection | `157` |
| `hasNextPage` | boolean | More pages available after current | `true` |
| `hasPrevPage` | boolean | Pages available before current | `false` |

## Frontend Implementation

### TypeScript Type Definition

```typescript
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface PaginatedResponse<T> {
  message: string;
  data: T[];
  meta: PaginationMeta;
}
```

### React Hook for Pagination

```typescript
const usePagination = (initialPage = 1, pageSize = 10) => {
  const [page, setPage] = useState(initialPage);
  const [items, setItems] = useState<Item[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPage = async (pageNum: number) => {
    setLoading(true);
    try {
      const response = await api.get('/items', {
        page: pageNum,
        limit: pageSize,
      });
      setItems(response.data);
      setMeta(response.meta);
      setPage(pageNum);
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    meta,
    loading,
    page,
    canNext: meta?.hasNextPage ?? false,
    canPrev: meta?.hasPrevPage ?? false,
    goNext: () => fetchPage(page + 1),
    goPrev: () => fetchPage(page - 1),
    goPage: (pageNum: number) => fetchPage(pageNum),
  };
};
```

### Vue 3 Composable

```typescript
import { ref, computed } from 'vue';

export const usePagination = (pageSize = 10) => {
  const items = ref<Item[]>([]);
  const page = ref(1);
  const meta = ref<PaginationMeta | null>(null);
  const loading = ref(false);

  const totalPages = computed(() =>
    meta.value ? Math.ceil(meta.value.total / meta.value.limit) : 0
  );

  const fetchPage = async (pageNum: number) => {
    loading.value = true;
    try {
      const response = await api.get('/items', {
        page: pageNum,
        limit: pageSize,
      });
      items.value = response.data;
      meta.value = response.meta;
      page.value = pageNum;
    } finally {
      loading.value = false;
    }
  };

  return {
    items,
    page,
    meta,
    loading,
    totalPages,
    canNext: computed(() => meta.value?.hasNextPage ?? false),
    canPrev: computed(() => meta.value?.hasPrevPage ?? false),
    fetchPage,
  };
};
```

### Angular Service

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaginationService {
  constructor(private http: HttpClient) {}

  getPage<T>(
    endpoint: string,
    page: number,
    limit: number
  ): Observable<PaginatedResponse<T>> {
    return this.http.get<PaginatedResponse<T>>(endpoint, {
      params: { page: page.toString(), limit: limit.toString() },
    });
  }
}
```

## Handling Pagination in UI

### Pagination Component

```typescript
interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  meta,
  onPageChange,
  loading,
}) => {
  const totalPages = Math.ceil(meta.total / meta.limit);

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(meta.page - 1)}
        disabled={!meta.hasPrevPage || loading}
      >
        Previous
      </button>

      <span>
        Page {meta.page} of {totalPages}
        ({meta.total} total items)
      </span>

      <button
        onClick={() => onPageChange(meta.page + 1)}
        disabled={!meta.hasNextPage || loading}
      >
        Next
      </button>
    </div>
  );
};
```

### Jump to Page Component

```typescript
const JumpToPage: React.FC<{
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}> = ({ meta, onPageChange }) => {
  const [inputPage, setInputPage] = useState(meta.page);
  const totalPages = Math.ceil(meta.total / meta.limit);

  const handleJump = () => {
    if (inputPage >= 1 && inputPage <= totalPages) {
      onPageChange(inputPage);
    }
  };

  return (
    <div>
      <input
        type="number"
        min="1"
        max={totalPages}
        value={inputPage}
        onChange={(e) => setInputPage(Number(e.target.value))}
      />
      <button onClick={handleJump}>Go to page</button>
    </div>
  );
};
```

## API Query Parameters

All paginated endpoints accept:

| Parameter | Type | Default | Example |
|-----------|------|---------|---------|
| `page` | number | 1 | `?page=2` |
| `limit` | number | 10 | `?limit=20` |

### Examples

```bash
# First page with default limit
GET /api/products

# Second page with 20 items per page
GET /api/products?page=2&limit=20

# Custom page and limit
GET /api/users?page=3&limit=50
```

## Common Pagination Logic

### Calculate Total Pages
```typescript
const totalPages = Math.ceil(meta.total / meta.limit);
```

### Calculate Starting Item Number
```typescript
const startItem = (meta.page - 1) * meta.limit + 1;
```

### Calculate Ending Item Number
```typescript
const endItem = Math.min(meta.page * meta.limit, meta.total);
```

### Generate Page Numbers Array
```typescript
const getPageNumbers = (meta: PaginationMeta, maxVisible = 5) => {
  const totalPages = Math.ceil(meta.total / meta.limit);
  const pages: number[] = [];
  const start = Math.max(1, meta.page - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
};
```

## Error Handling

```typescript
try {
  const response = await fetchProducts(page, limit);
  setItems(response.data);
  setMeta(response.meta);
} catch (error) {
  console.error('Failed to fetch products:', error);
  // Handle error appropriately
}
```

## Migration Checklist

- [ ] Update all API response handlers
- [ ] Refactor pagination components
- [ ] Update TypeScript interfaces
- [ ] Test pagination logic
- [ ] Update unit tests
- [ ] Update integration tests
- [ ] Update E2E tests
- [ ] Update documentation
- [ ] Communicate breaking change to team

## Backward Compatibility Note

⚠️ This is a **breaking change**. Ensure all frontend clients are updated before deploying.

Old structure no longer available:
```typescript
// ❌ Old (will fail)
const { page, limit, total } = response;

// ✅ New (correct)
const { page, limit, total } = response.meta;
```
