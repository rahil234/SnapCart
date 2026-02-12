import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseCUIDPipe implements PipeTransform<string> {
  private readonly cuidRegex = /^[a-z0-9]{24,32}$/;

  transform(value: string): string {
    if (!this.cuidRegex.test(value)) {
      throw new BadRequestException('Invalid CUID format');
    }
    return value;
  }
}
