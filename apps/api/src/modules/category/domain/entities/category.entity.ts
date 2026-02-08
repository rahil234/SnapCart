import { v4 as uuid } from 'uuid';

export class Category {
  private constructor(
    public readonly _id: string,
    private _name: string,
    private _status: 'active' | 'inactive',
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  // Factory method for creating new categories
  static create(name: string): Category {
    if (!name || name.trim().length === 0) {
      throw new Error('Category name cannot be empty');
    }

    return new Category(uuid(), name, 'active', new Date(), new Date());
  }

  static from(
    id: string,
    name: string,
    status: 'active' | 'inactive',
    createdAt: Date,
    updatedAt: Date,
  ): Category {
    return new Category(id, name, status, createdAt, updatedAt);
  }

  set name(newName: string) {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Category name cannot be empty');
    }
    this._name = newName;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get status(): 'active' | 'inactive' {
    return this._status;
  }

  set status(newStatus: 'active' | 'inactive') {
    this._status = newStatus;
  }
}
