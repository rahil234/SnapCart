export interface IHttpResponse<T = any, M = undefined> {
  message: string;
  data?: T;
  meta?: M;
}
