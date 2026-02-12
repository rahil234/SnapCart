export class ResetPasswordCommand {
  constructor(
    public readonly identifier: string,
    public readonly otp: string,
    public readonly newPassword: string,
  ) {}
}
