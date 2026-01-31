export interface OTPService {
  generate(): string;
  send(identifier: string, otp: string): Promise<void>;
}
