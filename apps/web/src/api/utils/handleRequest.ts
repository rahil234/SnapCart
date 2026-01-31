/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';

export type ApiError = {
  message?: string;
  status?: number;
  [key: string]: any;
};

export type ApiResult<T, M = undefined> =
  | {
      data?: T;
      meta?: M;
      error: null;
    }
  | {
      error: ApiError;
      data?: never;
      meta?: never;
    };

interface SwaggerEnvelope<T, M = undefined> {
  data?: T;
  meta?: M;
}

export async function handleRequest<T, M = undefined>(
  request: () => Promise<AxiosResponse<SwaggerEnvelope<T, M>>>
): Promise<ApiResult<T, M>> {
  try {
    const res = await request();

    return {
      data: res.data.data,
      meta: res.data.meta,
      error: null,
    };
  } catch (err: any) {
    return {
      error: {
        message: err?.response?.data?.message ?? err.message,
        status: err?.response?.status,
        ...err?.response?.data,
      },
    };
  }
}
