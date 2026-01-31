import { ApiProperty } from '@nestjs/swagger';

import { Role } from '@/common/enums/role.enum';
import { Admin } from '@/domain/admin/entities/admin.entity';

export class AdminResponseDto {
  @ApiProperty({ example: '1', description: 'Unique identifier for the admin' })
  id: string;

  @ApiProperty({
    example: 'admin@gmail.com',
    description: 'Email address of the admin',
  })
  email: string;

  @ApiProperty({ example: 'Admin Name', description: 'Name of the admin' })
  name: string;

  @ApiProperty({
    example: Role.ADMIN,
    enum: Role,
    description: 'Role of the admin',
  })
  role: Role;

  static fromEntity(entity: Admin): AdminResponseDto {
    const dto = new AdminResponseDto();
    dto.id = entity.id;
    dto.email = entity.email;
    dto.name = entity.name;
    dto.role = Role.ADMIN;
    return dto;
  }
}
