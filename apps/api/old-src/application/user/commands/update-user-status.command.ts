export class UpdateUserStatusCommand {
  constructor(
    public readonly userId: string,
    public readonly status: 'active' | 'suspended',
  ) {}
}
