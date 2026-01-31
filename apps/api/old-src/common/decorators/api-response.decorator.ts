import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';

import {
  HttpPaginatedResponse,
  HttpResponse,
} from '@/common/dto/http-response.dto';

export const ApiResponseWithType = <TModel extends Type>(
  options: ApiResponseOptions & {
    isArray?: boolean;
    pagination?: boolean;
  } = {},
  model?: TModel,
) => {
  const { isArray = false, pagination = false, ...rest } = options;

  const decorators: Array<
    ClassDecorator | MethodDecorator | PropertyDecorator
  > = [
    model
      ? ApiExtraModels(pagination ? HttpPaginatedResponse : HttpResponse, model)
      : ApiExtraModels(pagination ? HttpPaginatedResponse : HttpResponse),
    ApiOkResponse({
      ...rest,
      schema: {
        allOf: [
          { $ref: getSchemaPath(HttpResponse) },
          {
            properties: {
              data: model
                ? isArray
                  ? { type: 'array', items: { $ref: getSchemaPath(model) } }
                  : { $ref: getSchemaPath(model) }
                : { type: undefined },
            },
          },
        ],
      },
    }),
  ];

  return applyDecorators(...decorators);
};
