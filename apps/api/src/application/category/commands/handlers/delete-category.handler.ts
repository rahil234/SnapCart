import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { DeleteCategoryCommand } from '../delete-category.command';
import { CategoryRepository } from '@/domain/category/repositories/category.repository';
import { CategoryDeletedEvent } from '@/domain/category/events';

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryHandler implements ICommandHandler<DeleteCategoryCommand> {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteCategoryCommand): Promise<void> {
    const { id } = command;

    // Find existing category
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Delete the category
    await this.categoryRepository.delete(id);

    // Emit domain event
    await this.eventBus.publish(
      new CategoryDeletedEvent(
        category.id,
        category.getName(),
      ),
    );
  }
}
