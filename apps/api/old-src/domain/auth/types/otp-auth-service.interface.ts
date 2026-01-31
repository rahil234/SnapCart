export interface OtpAuthService<TAccount> {
  findByEmail?(email: string): Promise<TAccount | null>;
  findByPhone?(phone: string): Promise<TAccount | null>;
}
