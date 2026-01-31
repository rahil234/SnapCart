export class CreateUserDto {
  public email?: string;
  public phone?: string;

  constructor() {
    this.email = undefined;
    this.phone = undefined;
  }
}
