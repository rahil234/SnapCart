import { v4 as uuid } from 'uuid';

export class Category {
  private constructor(
    public readonly id: string,
    private name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  // Factory method for creating new categories
  static create(name: string): Category {
    if (!name || name.trim().length === 0) {
      throw new Error('Category name cannot be empty');
    }

    return new Category(uuid(), name, new Date(), new Date());
  }

  // Factory method for reconstructing from persistence
  static from(
    id: string,
    name: string,
    createdAt: Date,
    updatedAt: Date,
  ): Category {
    return new Category(id, name, createdAt, updatedAt);
  }

  // Business methods
  updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Category name cannot be empty');
    }
    this.name = newName;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }
}
