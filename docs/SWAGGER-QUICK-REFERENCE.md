# Swagger API Documentation - Quick Reference Guide

## Overview

This guide shows how to properly document API endpoints with Swagger in our NestJS application.

## Table of Contents

1. [Basic Setup](#basic-setup)
2. [Response Types](#response-types)
3. [Error Responses](#error-responses)
4. [Pagination](#pagination)
5. [Common Patterns](#common-patterns)

---

## Basic Setup

### Import Required Decorators

```typescript
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponseWithType } from '@/shared/decorators/api-response.decorator';
import {
  ApiCommonErrorResponses,
  ApiAuthErrorResponses,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@/shared/decorators/api-error-responses.decorator';
```

---

## Response Types

### Single Item Response

```typescript
@Get(':id')
@Public()
@ApiOperation({
  summary: 'Get item by ID',
  description: 'Retrieves detailed item information',
})
@ApiResponseWithType(
  {
    status: HttpStatus.OK,
    description: 'Item retrieved successfully',
  },
  ItemResponseDto,
)
@ApiNotFoundResponse('Item')
@ApiCommonErrorResponses()
async findOne(@Param('id') id: string): Promise<HttpResponse<ItemResponseDto>> {
  // Implementation
}
```

### Array Response

```typescript
@Get()
@Public()
@ApiOperation({
  summary: 'Get all items',
  description: 'Retrieves all items',
})
@ApiResponseWithType(
  {
    status: HttpStatus.OK,
    description: 'Items retrieved successfully',
    isArray: true,
  },
  ItemResponseDto,
)
@ApiCommonErrorResponses()
async findAll(): Promise<HttpResponse<ItemResponseDto[]>> {
  // Implementation
}
```

### Created Response

```typescript
@Post()
@Roles(Role.ADMIN)
@ApiBearerAuth()
@ApiOperation({
  summary: 'Create new item',
  description: 'Creates a new item in the system',
})
@ApiResponseWithType(
  {
    status: HttpStatus.CREATED,
    description: 'Item created successfully',
  },
  ItemResponseDto,
)
@ApiCommonErrorResponses()
@ApiAuthErrorResponses()
async create(@Body() dto: CreateItemDto): Promise<HttpResponse<ItemResponseDto>> {
  // Implementation
}
```

---

## Error Responses

### Standard Error Responses

#### Public Endpoints
```typescript
@ApiCommonErrorResponses()  // Adds 400 Bad Request & 500 Internal Server Error
```

#### Protected Endpoints
```typescript
@ApiAuthErrorResponses()    // Adds 401 Unauthorized & 403 Forbidden
@ApiCommonErrorResponses()  // Always include this
```

#### Resource Not Found
```typescript
@ApiNotFoundResponse('ResourceName')  // Adds 404 Not Found with custom message
```

#### Conflict Errors
```typescript
@ApiConflictResponse('Resource already exists')  // Adds 409 Conflict
```

### Complete Example

```typescript
@Patch(':id')
@Roles(Role.ADMIN)
@ApiBearerAuth()
@ApiOperation({
  summary: 'Update item',
  description: 'Updates an existing item',
})
@ApiResponseWithType(
  {
    status: HttpStatus.OK,
    description: 'Item updated successfully',
  },
  ItemResponseDto,
)
@ApiNotFoundResponse('Item')
@ApiAuthErrorResponses()
@ApiCommonErrorResponses()
async update(
  @Param('id') id: string,
  @Body() dto: UpdateItemDto,
): Promise<HttpResponse<ItemResponseDto>> {
  // Implementation
}
```

---

## Pagination

### Paginated List Response

```typescript
@Get()
@Public()
@ApiOperation({
  summary: 'List all items (paginated)',
  description: 'Retrieves paginated list of items with filtering',
})
@ApiResponseWithType(
  {
    status: HttpStatus.OK,
    description: 'Items retrieved successfully',
    pagination: true,    // Enable pagination schema
    isArray: true,       // Array of items
  },
  ItemResponseDto,
)
@ApiCommonErrorResponses()
async findAll(
  @Query() query: GetItemsDto,
): Promise<HttpPaginatedResponse<ItemResponseDto[]>> {
  // Implementation must return:
  // {
  //   message: 'Items retrieved successfully',
  //   data: [...items],
  //   total: 100,
  //   page: 1,
  //   limit: 10
  // }
}
```

### Query DTO for Pagination

```typescript
import { IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetItemsDto {
  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search term',
    example: 'keyword',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
```

---

## Common Patterns

### Pattern 1: Public GET Endpoint

```typescript
@Get(':id')
@Public()
@ApiOperation({ summary: 'Get item by ID' })
@ApiResponseWithType(
  { status: HttpStatus.OK, description: 'Success' },
  ItemResponseDto,
)
@ApiNotFoundResponse('Item')
@ApiCommonErrorResponses()
async findOne(@Param('id') id: string): Promise<HttpResponse<ItemResponseDto>> {
  // Implementation
}
```

### Pattern 2: Protected POST Endpoint

```typescript
@Post()
@Roles(Role.ADMIN)
@ApiBearerAuth()
@ApiOperation({ summary: 'Create item' })
@ApiResponseWithType(
  { status: HttpStatus.CREATED, description: 'Created' },
  ItemResponseDto,
)
@ApiConflictResponse('Item already exists')
@ApiAuthErrorResponses()
@ApiCommonErrorResponses()
async create(@Body() dto: CreateItemDto): Promise<HttpResponse<ItemResponseDto>> {
  // Implementation
}
```

### Pattern 3: Protected PATCH Endpoint

```typescript
@Patch(':id')
@Roles(Role.ADMIN)
@ApiBearerAuth()
@ApiOperation({ summary: 'Update item' })
@ApiResponseWithType(
  { status: HttpStatus.OK, description: 'Updated' },
  ItemResponseDto,
)
@ApiNotFoundResponse('Item')
@ApiAuthErrorResponses()
@ApiCommonErrorResponses()
async update(
  @Param('id') id: string,
  @Body() dto: UpdateItemDto,
): Promise<HttpResponse<ItemResponseDto>> {
  // Implementation
}
```

### Pattern 4: Protected DELETE Endpoint

```typescript
@Delete(':id')
@Roles(Role.ADMIN)
@ApiBearerAuth()
@ApiOperation({ summary: 'Delete item' })
@ApiResponseWithType({
  status: HttpStatus.OK,
  description: 'Deleted successfully',
})
@ApiNotFoundResponse('Item')
@ApiAuthErrorResponses()
@ApiCommonErrorResponses()
async delete(@Param('id') id: string): Promise<HttpResponse> {
  // Implementation
}
```

### Pattern 5: Paginated List

```typescript
@Get()
@Public()
@ApiOperation({ summary: 'List items' })
@ApiResponseWithType(
  {
    status: HttpStatus.OK,
    description: 'List retrieved',
    pagination: true,
    isArray: true,
  },
  ItemResponseDto,
)
@ApiCommonErrorResponses()
async findAll(
  @Query() query: GetItemsDto,
): Promise<HttpPaginatedResponse<ItemResponseDto[]>> {
  // Implementation
}
```

---

## Parameter Documentation

### Path Parameters

```typescript
@ApiParam({
  name: 'id',
  description: 'Item UUID',
  type: 'string',
  format: 'uuid',
  example: '123e4567-e89b-12d3-a456-426614174000',
})
async method(@Param('id', ParseUUIDPipe) id: string) { }
```

### Query Parameters

Query parameters are automatically documented if you use a DTO with `@ApiPropertyOptional` decorators.

---

## Response DTO Best Practices

### Basic Response DTO

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class ItemResponseDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Item name',
    example: 'Sample Item',
  })
  name: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2026-02-01T10:00:00.000Z',
  })
  createdAt: Date;

  // Factory method for domain to DTO conversion
  static fromDomain(item: Item): ItemResponseDto {
    return {
      id: item.id,
      name: item.getName(),
      createdAt: item.createdAt,
    };
  }
}
```

---

## Checklist for New Endpoints

- [ ] Add `@ApiOperation()` with summary and description
- [ ] Add `@ApiResponseWithType()` with appropriate status and DTO
- [ ] Add error decorators (`@ApiNotFoundResponse`, etc.)
- [ ] Add `@ApiCommonErrorResponses()`
- [ ] Add `@ApiAuthErrorResponses()` if protected
- [ ] Add `@ApiParam()` for path parameters with UUID format
- [ ] Use proper TypeScript return type
- [ ] Create/update response DTO if needed
- [ ] Test in Swagger UI

---

## Available Error Decorators

| Decorator | Status | Description |
|-----------|--------|-------------|
| `@ApiCommonErrorResponses()` | 400, 500 | Bad Request, Internal Server Error |
| `@ApiAuthErrorResponses()` | 401, 403 | Unauthorized, Forbidden |
| `@ApiNotFoundResponse('Resource')` | 404 | Resource not found |
| `@ApiConflictResponse('Message')` | 409 | Conflict (duplicate, etc.) |

---

## Return Types

| Scenario | Return Type |
|----------|-------------|
| Single item | `Promise<HttpResponse<ItemDto>>` |
| Array | `Promise<HttpResponse<ItemDto[]>>` |
| Paginated | `Promise<HttpPaginatedResponse<ItemDto[]>>` |
| No data | `Promise<HttpResponse>` |

---

## Tips

1. **Always use typed responses** - It helps with type safety and Swagger documentation
2. **Group related decorators** - Keep error decorators together at the bottom
3. **Be consistent** - Follow the patterns shown above
4. **Test in Swagger UI** - Verify documentation appears correctly
5. **Use factory methods** - Create `fromDomain()` or `fromEntity()` methods in DTOs

---

## Need Help?

- Check `/docs/SWAGGER-IMPLEMENTATION-COMPLETE.md` for detailed implementation notes
- Look at existing controllers for examples
- All error DTOs are in `/shared/dto/common/error-response.dto.ts`
- All error decorators are in `/shared/decorators/api-error-responses.decorator.ts`
