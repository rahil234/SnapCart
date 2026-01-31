import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { Address } from '@/domain/user/entities/address.entity';
import { AddressRepository } from '@/domain/user/repositories/address.repository';
import { PrismaAddressMapper } from '@/infrastructure/user/persistence/mappers/prisma-address.mapper';

@Injectable()
export class PrismaAddressRepository implements AddressRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(address: Address): Promise<Address> {
    const data = PrismaAddressMapper.toPersistence(address);
    const doc = await this.prisma.address.create({ data });
    return PrismaAddressMapper.toDomain(doc);
  }

  async update(address: Address): Promise<Address> {
    const data = PrismaAddressMapper.toPersistence(address);
    const doc = await this.prisma.address.update({
      where: { id: address.id },
      data,
    });
    return PrismaAddressMapper.toDomain(doc);
  }

  async findById(id: string): Promise<Address | null> {
    const record = await this.prisma.address.findUnique({
      where: { id },
    });
    if (!record) return null;
    return PrismaAddressMapper.toDomain(record);
  }

  async findByUserId(userId: string): Promise<Address[]> {
    const records = await this.prisma.address.findMany({
      where: { userId },
      orderBy: { isPrimary: 'desc' },
    });
    return records.map(PrismaAddressMapper.toDomain);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.address.delete({
      where: { id },
    });
  }
}
