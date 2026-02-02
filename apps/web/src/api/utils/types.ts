/* eslint-disable @typescript-eslint/no-explicit-any */

export type ApiError = {
  message?: string;
  status?: number;
  [key: string]: any;
};

export type ApiResult<T, M = undefined> =
  | {
      error: null;
      data: T;
      meta?: M;
    }
  | {
      error: ApiError;
      data?: never;
      meta?: never;
    };

// Backend DTO shapes
export type MessageOnlyResponse = {
  message: string;
};

export type DataResponse<T, M = undefined> = {
  message: string;
  data: T;
  meta?: M;
};
