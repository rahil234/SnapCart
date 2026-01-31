import { IsOptional, IsString } from 'class-validator';

export class UpdateStatusUserDto {
  @IsOptional()
  @IsString()
  public status: 'active' | 'suspended';
}
