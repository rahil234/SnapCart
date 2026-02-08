/* eslint-disable @typescript-eslint/no-explicit-any */

import { AxiosResponse } from 'axios';
import { ApiResult } from '@/api/utils/types';

type ExtractData<T> = T extends { data: infer D } ? D : void;

type ExtractMeta<T> = T extends { meta?: infer M } ? M : undefined;

export async function handleRequest<TResponse extends { message: string }>(
  request: () => Promise<AxiosResponse<TResponse>>
): Promise<ApiResult<ExtractData<TResponse>, ExtractMeta<TResponse>>> {
  try {
    const res = await request();

    if (!res.data) {
      return {
        data: undefined as ExtractData<TResponse>,
        error: null,
      };
    }

    if (typeof res.data === 'object' && 'data' in res.data) {
      return {
        data: (res.data as any).data,
        meta: (res.data as any).meta,
        error: null,
      };
    }

    // message-only success
    return {
      data: undefined as ExtractData<TResponse>, // resolves to void
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
