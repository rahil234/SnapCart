import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/shared/prisma/prisma.service';
import { UserRole } from '@/modules/user/domain/enums/user-role.enum';
import { AccountStatus } from '@/modules/user/domain/enums/account-status.enum';
import { GetMeResult } from '@/modules/user/application/queries/get-me/get-me.result';
import { MeReadRepository } from '@/modules/user/application/repositories/me-read.repository';

@Injectable()
export class PrismaMeReadRepository implements MeReadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getMeByUserId(userId: string): Promise<GetMeResult> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,

        customerProfile: {
          select: {
            id: true,
            name: true,
            addresses: {
              select: {
                id: true,
                street: true,
                city: true,
                state: true,
                pincode: true,
                country: true,
              },
            },
          },
        },

        sellerProfile: {
          select: {
            id: true,
            storeName: true,
            isVerified: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    return {
      id: user.id,
      email: user.email ?? undefined,
      role: user.role as UserRole,
      status: user.status as AccountStatus,
      customerProfile: user.customerProfile
        ? {
            id: user.customerProfile.id,
            name: user.customerProfile.name ?? undefined,
          }
        : undefined,
      sellerProfile: user.sellerProfile ?? undefined,
    };
  }
}
