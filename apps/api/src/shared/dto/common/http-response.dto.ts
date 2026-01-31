import { ApiProperty } from '@nestjs/swagger';

import { HTTP_PAGINATED_RESPONSE, IHttpResponse } from '@/shared/types';

export class HttpResponse<T = undefined> implements IHttpResponse {
  @ApiProperty({ example: 'Response sent successfully' })
  message: string;

  @ApiProperty({ required: false })
  data?: T;
}

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
