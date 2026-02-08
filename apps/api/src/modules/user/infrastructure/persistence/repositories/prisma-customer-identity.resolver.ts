import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/shared/prisma/prisma.service';
import { CustomerIdentityResolver } from '@/modules/user/application/ports/customer-identity.resolver';

@Injectable()
export class PrismaCustomerIdentityResolver implements CustomerIdentityResolver {
  constructor(private readonly prisma: PrismaService) {}

  async resolveCustomerIdByUserId(userId: string): Promise<string> {
    const profile = await this.prisma.customerProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException(
        `Customer profile not found for user ${userId}`,
      );
    }

    return profile.id;
  }
}
