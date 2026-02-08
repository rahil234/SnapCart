import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { OfferRepository } from '@/modules/offer/domain/repositories/offer.repository';
import { Offer } from '@/modules/offer/domain/entities';
import { OfferType, OfferStatus } from '@/modules/offer/domain/enums';

@Injectable()
export class PrismaOfferRepository implements OfferRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(offer: Offer): Promise<Offer> {
    const created = await this.prisma.offer.create({
      data: {
        id: offer.getId(),
        name: offer.getName(),
        type: offer.getType(),
        discount: offer.getDiscount(),
        minPurchaseAmount: offer.getMinPurchaseAmount(),
        maxDiscount: offer.getMaxDiscount() ?? null,
        priority: offer.getPriority(),
        startDate: offer.getStartDate(),
        endDate: offer.getEndDate(),
        status: offer.getStatus(),
        isStackable: offer.getIsStackable(),
        categories: offer.getCategories(),
        products: offer.getProducts(),
        description: offer.getDescription() ?? null,
        createdAt: offer.getCreatedAt(),
        updatedAt: offer.getUpdatedAt(),
      },
    });

    return this.toDomain(created);
  }

  async update(offer: Offer): Promise<Offer> {
    const updated = await this.prisma.offer.update({
      where: { id: offer.getId() },
      data: {
        name: offer.getName(),
        type: offer.getType(),
        discount: offer.getDiscount(),
        minPurchaseAmount: offer.getMinPurchaseAmount(),
        maxDiscount: offer.getMaxDiscount() ?? null,
        priority: offer.getPriority(),
        startDate: offer.getStartDate(),
        endDate: offer.getEndDate(),
        status: offer.getStatus(),
        isStackable: offer.getIsStackable(),
        categories: offer.getCategories(),
        products: offer.getProducts(),
        description: offer.getDescription() ?? null,
        updatedAt: new Date(),
      },
    });

    return this.toDomain(updated);
  }

  async findById(id: string): Promise<Offer | null> {
    const offer = await this.prisma.offer.findUnique({
      where: { id },
    });

    return offer ? this.toDomain(offer) : null;
  }

  async findAll(
    skip: number = 0,
    take: number = 10,
  ): Promise<{ offers: Offer[]; total: number }> {
    const [offers, total] = await Promise.all([
      this.prisma.offer.findMany({
        skip,
        take,
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.offer.count(),
    ]);

    return {
      offers: offers.map((o) => this.toDomain(o)),
      total,
    };
  }

  async findActiveOffers(): Promise<Offer[]> {
    const now = new Date();
    const offers = await this.prisma.offer.findMany({
      where: {
        status: OfferStatus.ACTIVE,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });

    return offers.map((o) => this.toDomain(o));
  }

  async findByProductId(productId: string): Promise<Offer[]> {
    const now = new Date();
    const offers = await this.prisma.offer.findMany({
      where: {
        status: OfferStatus.ACTIVE,
        startDate: { lte: now },
        endDate: { gte: now },
        products: {
          has: productId,
        },
      },
      orderBy: [{ priority: 'desc' }],
    });

    return offers.map((o) => this.toDomain(o));
  }

  async findByCategoryId(categoryId: string): Promise<Offer[]> {
    const now = new Date();
    const offers = await this.prisma.offer.findMany({
      where: {
        status: OfferStatus.ACTIVE,
        startDate: { lte: now },
        endDate: { gte: now },
        categories: {
          has: categoryId,
        },
      },
      orderBy: [{ priority: 'desc' }],
    });

    return offers.map((o) => this.toDomain(o));
  }

  async findApplicableOffers(
    productIds: string[],
    categoryIds: string[],
    sortByPriority: boolean = true,
  ): Promise<Offer[]> {
    const now = new Date();

    const offers = await this.prisma.offer.findMany({
      where: {
        status: OfferStatus.ACTIVE,
        startDate: { lte: now },
        endDate: { gte: now },
        OR: [
          {
            products: {
              hasSome: productIds,
            },
          },
          {
            categories: {
              hasSome: categoryIds,
            },
          },
        ],
      },
      orderBy: sortByPriority
        ? [{ priority: 'desc' }, { discount: 'desc' }]
        : [{ createdAt: 'desc' }],
    });

    return offers.map((o) => this.toDomain(o));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.offer.delete({
      where: { id },
    });
  }

  private toDomain(prisma: any): Offer {
    return Offer.from(
      prisma.id,
      prisma.name,
      prisma.type as OfferType,
      prisma.discount,
      prisma.minPurchaseAmount,
      prisma.maxDiscount ?? undefined,
      prisma.priority,
      prisma.startDate,
      prisma.endDate,
      prisma.status as OfferStatus,
      prisma.isStackable,
      prisma.categories,
      prisma.products,
      prisma.description ?? undefined,
      prisma.createdAt,
      prisma.updatedAt,
    );
  }
}
