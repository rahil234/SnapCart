export class UpgradeToSellerCommand {
  constructor(
    public readonly userId: string,
    public readonly storeName: string,
    public readonly gstNumber?: string | null,
  ) {}
}
