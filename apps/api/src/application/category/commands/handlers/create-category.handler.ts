import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateCategoryCommand } from '../create-category.command';
import { CategoryRepository } from '@/domain/category/repositories/category.repository';
import { Category } from '@/domain/category/entities/category.entity';
import { CategoryCreatedEvent } from '@/domain/category/events';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler implements ICommandHandler<CreateCategoryCommand> {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateCategoryCommand): Promise<Category> {
    const { name, description, imageUrl, parentId } = command;

    // Create domain entity using factory method (with business validation)
    const category = Category.create(name);

    // Persist the category
    const createdCategory = await this.categoryRepository.save(category);

    // Emit domain event
    await this.eventBus.publish(
      new CategoryCreatedEvent(createdCategory.id, createdCategory.getName()),
    );

    return createdCategory;
  }
}
