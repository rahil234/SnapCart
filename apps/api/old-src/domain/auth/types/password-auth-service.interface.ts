export interface PasswordAuthService<TAccount> {
  findByEmail?(email: string): Promise<TAccount | null>;
  findByPhone?(phone: string): Promise<TAccount | null>;
  findByUsername?(username: string): Promise<TAccount | null>;
}
