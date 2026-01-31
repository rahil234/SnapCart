import { ApiProperty } from '@nestjs/swagger';

import { Seller } from '@/domain/seller/entities/seller.entity';
import { AccountStatus } from '@/domain/auth/types';

export class SellerResponseDto {
  @ApiProperty({
    example: '1234567890abcdef',
    description: 'Unique identifier for the seller',
  })
  id: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the seller',
  })
  name: string;

  @ApiProperty({
    example: 'seller@gmail.com',
    description: 'Email address of the seller',
  })
  email: string;

  @ApiProperty({
    example: 'active',
    enum: ['active', 'blocked'],
    description: 'Status of the seller account',
  })
  status: AccountStatusType;

  static fromEntity(entity: Seller): SellerResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      status: entity.status,
    };
  }

  static fromEntities(entities: Seller[]): SellerResponseDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
