import {
  ApiExtraModels,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { applyDecorators, HttpStatus, Type } from '@nestjs/common';

import {
  HttpPaginatedResponse,
  HttpResponse,
} from '@/shared/dto/common/http-response.dto';
import { MessageOnlyResponse } from '@/shared/dto/common/message-only-response.dto';

export const ApiResponseWithType = <TModel extends Type>(
  options: Omit<ApiResponseOptions, 'type'> & {
    isArray?: boolean;
    pagination?: boolean;
  } = {},
  model?: TModel,
) => {
  const { isArray = false, pagination = false, status, ...rest } = options;

  const ResponseDecorator =
    status === HttpStatus.CREATED ? ApiCreatedResponse : ApiOkResponse;

  const decorators: Array<
    ClassDecorator | MethodDecorator | PropertyDecorator
  > = [
    model
      ? ApiExtraModels(pagination ? HttpPaginatedResponse : HttpResponse, model)
      : ApiExtraModels(MessageOnlyResponse),
  ];

  // ===============================
  // ✅ PAGINATED RESPONSE (requires model)
  // ===============================
  if (pagination && model) {
    decorators.push(
      ResponseDecorator({
        ...rest,
        schema: {
          allOf: [
            { $ref: getSchemaPath(HttpPaginatedResponse) },
            {
              properties: {
                data: isArray
                  ? {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  }
                  : { $ref: getSchemaPath(model) },
              },
              required: ['data'],
            },
          ],
        },
      }),
    );

    return applyDecorators(...decorators);
  }

  // ===============================
  // ✅ STANDARD RESPONSE
  // ===============================
  decorators.push(
    ResponseDecorator({
      ...rest,
      schema: {
        allOf: [
          {
            $ref: model
              ? getSchemaPath(HttpResponse)
              : getSchemaPath(MessageOnlyResponse),
          },
          model
            ? {
              properties: {
                data: isArray
                  ? {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  }
                  : { $ref: getSchemaPath(model) },
              },
              required: ['data'],
            }
            : {},
        ],
      },
    }),
  );

  return applyDecorators(...decorators);
};
