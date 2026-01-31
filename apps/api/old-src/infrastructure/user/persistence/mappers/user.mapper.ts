import { User as PrismaUser } from '@prisma/client';
import { User as UserEntity } from '@/domain/user/entities/user.entity';
import { AddressMapper } from './address.mapper';

export const UserMapper = {
  toDomain(prismaUser: PrismaUser & { addresses?: any[] }): UserEntity {
    return new UserEntity(
      prismaUser.id,
      prismaUser.name,
      prismaUser.email,
      prismaUser.phone,
      prismaUser.dob,
      prismaUser.gender as 'male' | 'female' | 'other' | null,
      prismaUser.password,
      prismaUser.tryOnLimit,
      prismaUser.addresses?.map(addr => AddressMapper.toDomain(addr)) || [],
      prismaUser.status === 'blocked' || prismaUser.status === 'deleted' ? 'suspended' : prismaUser.status as 'active' | 'suspended',
      prismaUser.createdAt,
      prismaUser.updatedAt,
    );
  },

  toEntity(prismaUser: PrismaUser & { addresses?: any[] }): UserEntity {
    return this.toDomain(prismaUser);
  },

  toPrisma(user: Partial<UserEntity>): any {
    return {
      name: user.name,
      email: user.email,
      phone: user.phone,
      dob: user.dob,
      gender: user.gender,
      password: user.password,
      tryOnLimit: user.tryOnLimit,
      status: user.status,
    };
  },
};
