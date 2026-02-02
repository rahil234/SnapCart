import { ApiProperty } from '@nestjs/swagger';

import { IHttpResponse, PaginationMeta } from '@/shared/types';

export class HttpResponse<T = undefined> implements IHttpResponse {
  @ApiProperty({ example: 'Response sent successfully' })
  message: string;

  @ApiProperty({ required: false })
  data?: T;
}

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
