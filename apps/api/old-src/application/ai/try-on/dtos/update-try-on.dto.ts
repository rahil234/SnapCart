import { PartialType } from '@nestjs/swagger';
import { CreateTryOnDto } from './create-try-on.dto';

export class UpdateTryOnDto extends PartialType(CreateTryOnDto) {}
