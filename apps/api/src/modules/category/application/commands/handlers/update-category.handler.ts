import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { UpdateCategoryCommand } from '../update-category.command';
import { CategoryUpdatedEvent } from '@/modules/category/domain/events';
import { CategoryRepository } from '@/modules/category/domain/repositories/category.repository';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler implements ICommandHandler<UpdateCategoryCommand> {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateCategoryCommand) {
    const { id, name, status } = command;

    // Find an existing category
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (name !== undefined) {
      category.name = name;
    }

    if (status !== undefined) {
      category.status = status;
    }

    // Persist the updated category
    const updatedCategory = await this.categoryRepository.save(category);

    await this.eventBus.publish(
      new CategoryUpdatedEvent(updatedCategory.id, category),
    );
  }
}
