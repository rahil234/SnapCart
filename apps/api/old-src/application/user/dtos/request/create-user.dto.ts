export class CreateUserDto {
  public email?: string;
  public phone?: string;
  public password: string;

  constructor() {
    this.email = undefined;
    this.phone = undefined;
  }
}
