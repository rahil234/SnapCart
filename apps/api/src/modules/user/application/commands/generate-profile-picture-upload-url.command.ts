export class GenerateProfilePictureUploadUrlCommand {
  constructor(
    public readonly userId: string,
    public readonly fileName: string,
  ) {}
}
