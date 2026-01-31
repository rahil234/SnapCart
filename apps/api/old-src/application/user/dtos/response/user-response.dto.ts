import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { UserDto } from '@/application/user/dtos/user.dto';
import { AddressResponseDto } from '@/application/user/dtos/response/address-response.dto';

export class UserResponseDto {
  @ApiProperty({
    example: 'uuid-v4-string',
    description: 'Unique identifier for the user',
  })
  public id: string;

  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  public name?: string;

  @ApiPropertyOptional({
    example: 'user@gmail.com',
    description: 'Email address of the user',
  })
  public email?: string;

  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'Phone number of the user',
  })
  public phone?: string;

  @ApiPropertyOptional({
    example: '1990-01-01T00:00:00.000Z',
    description: 'Date of birth of the user',
  })
  public dob?: Date;

  @ApiPropertyOptional({
    example: 'male',
    description: 'Gender of the user',
  })
  public gender?: 'male' | 'female' | 'other';

  @ApiProperty({
    type: AddressResponseDto,
    isArray: true,
    description: 'List of user addresses',
  })
  public addresses: AddressResponseDto[];

  @ApiProperty({
    example: 'active',
    description: 'Current status of the user account',
  })
  public status: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Account creation timestamp',
  })
  public joined: Date;

  static fromEntity(this: void, entity: UserDto): UserResponseDto {
    return {
      id: entity.id,
      name: entity.name || undefined,
      email: entity.email || undefined,
      phone: entity.phone || undefined,
      dob: entity.dob || undefined,
      gender: entity.gender || undefined,
      addresses: entity.addresses.map(AddressResponseDto.fromEntity),
      status: entity.status,
      joined: entity.createdAt,
    };
  }

  static fromEntities(entities: UserDto[]): UserResponseDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
