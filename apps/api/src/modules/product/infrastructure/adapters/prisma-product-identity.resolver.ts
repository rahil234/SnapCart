import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/shared/prisma/prisma.service';
import { ProductIdentityResolver } from '@/modules/product/application/ports/product-identity.resolver';

@Injectable()
export class PrismaProductIdentityResolver implements ProductIdentityResolver {
  constructor(private readonly prisma: PrismaService) {}

  async resolveProductIdByVariantId(variantId: string): Promise<string> {
    const variant = await this.prisma.productVariant.findUnique({
      where: {
        id: variantId,
      },
      select: { productId: true },
    });

    if (!variant) {
      throw new NotFoundException(
        `Product not found for Variant: ${variantId}`,
      );
    }

    return variant.productId;
  }
}
