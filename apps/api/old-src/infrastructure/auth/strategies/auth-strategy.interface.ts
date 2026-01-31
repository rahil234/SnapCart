export interface AuthStrategy<S, R> {
  validate(accountService: S, identifier: string, secret: string): Promise<R>;
}
