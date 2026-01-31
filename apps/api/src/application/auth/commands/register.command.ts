export class RegisterCommand {
  constructor(
    public readonly email: string | null,
    public readonly phone: string | null,
    public readonly password: string,
  ) {}
}
