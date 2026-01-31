import { User } from '@/domain/user/entities/user.entity';
import { Address } from '@/domain/user/entities/address.entity';
import { ReadUrlResponse } from '@/common/storage/storage.interface';
import { AccountStatus } from '@/domain/auth/types';

export class UserDto {
  public id: string;
  public name?: string;
  public email?: string;
  public phone?: string;
  public password: string;
  public dob?: Date;
  public gender?: 'male' | 'female' | 'other';
  public addresses: Address[];
  public status: AccountStatus;
  public createdAt: Date;
  public updatedAt: Date;
  public tryOnImage: string | null;
  public tryOnLimit: number;

  constructor(entity: User, tryOnImage?: ReadUrlResponse | null) {
    this.id = entity.id;
    this.name = entity.name || undefined;
    this.email = entity.email || undefined;
    this.phone = entity.phone || undefined;
    //TODO change this later to typesafe
    this.password = entity.password!;
    this.dob = entity.dob || undefined;
    this.tryOnImage = tryOnImage?.readUrl || null;
    this.gender = entity.gender || undefined;
    this.tryOnLimit = entity.tryOnLimit;
    this.addresses = entity.address;
    this.status = entity.status as AccountStatus;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
