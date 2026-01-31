import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateCategoryCommand } from '../update-category.command';
import { CategoryRepository } from '@/modules/category/domain/repositories/category.repository';
import { Category } from '@/modules/category/domain/entities/category.entity';
import { CategoryUpdatedEvent } from '@/modules/category/domain/events';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler implements ICommandHandler<UpdateCategoryCommand> {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateCategoryCommand): Promise<Category> {
    const { id, name } = command;

    // Find existing category
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const changes: Record<string, any> = {};

    // Update category using business methods
    if (name !== undefined) {
      category.updateName(name);
      changes.name = name;
    }

    // Persist the updated category
    const updatedCategory = await this.categoryRepository.update(category);

    // Emit domain event
    if (Object.keys(changes).length > 0) {
      await this.eventBus.publish(
        new CategoryUpdatedEvent(updatedCategory.id, changes),
      );
    }

    return updatedCategory;
  }
}
