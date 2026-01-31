import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class OrderNumberService {
  constructor(
    @Inject('PrismaService') private readonly prisma: PrismaService,
  ) {}

  private readonly MAX_RETRIES = 3;

  /**
   * Generate a sequential, unique, numeric order number padded to 6 digits.
   * Example: ORD000001, ORD000002, ...
   */
  public async generate(): Promise<string> {
    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const result = await this.prisma.$queryRaw<
          { nextval: bigint }[]
        >`SELECT nextval('order_number_seq') as nextval`;

        const seq = Number(result[0].nextval);
        const padded = seq.toString().padStart(6, '0');

        return `ORD${padded}`;
      } catch (error) {
        console.error(
          `Attempt ${attempt} to generate order number failed:`,
          error,
        );
        if (attempt === this.MAX_RETRIES) {
          throw new InternalServerErrorException(
            'Failed to generate order number after multiple attempts',
          );
        }

        // small delay before retrying
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }

    throw new InternalServerErrorException(
      'Unexpected failure generating order number',
    );
  }
}
