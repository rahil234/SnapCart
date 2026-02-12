export class SaveProfilePictureCommand {
  constructor(
    public readonly userId: string,
    public readonly url: string,
  ) {}
}
