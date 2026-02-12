import { Command } from '@nestjs/cqrs';

export class UpdateCategoryCommand extends Command<void> {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly status?: 'active' | 'inactive',
    public readonly description?: string | null,
  ) {
    super();
  }
}
