export class VerifyOTPCommand {
  constructor(
    public readonly identifier: string,
    public readonly otp: string,
  ) {}
}
