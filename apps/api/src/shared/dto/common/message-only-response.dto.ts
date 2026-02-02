import { OmitType } from '@nestjs/swagger';
import { HttpResponse } from '@/shared/dto/common/http-response.dto';

export class MessageOnlyResponse extends OmitType(HttpResponse, [
  'data',
] as const) {}
