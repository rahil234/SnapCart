import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ISellerRepository } from '@/infrastructure/seller/repositories/seller.repository';
import { IAccountService } from '@/domain/auth/services/account-service.interface';
import { Seller } from '../entities/seller.entity';
import { BcryptService } from '@/common/services/bcrypt.service';
import { AccountStatus } from '@/domain/auth/types';

@Injectable()
export class SellerService implements IAccountService {
  constructor(
    @Inject('SellerRepository')
    private readonly _sellerRepository: ISellerRepository,
    private readonly _bcryptService: BcryptService,
  ) {}

  async create(data: {
    email?: string;
    name?: string;
    password?: string;
  }): Promise<Seller> {
    const { email, name, password } = data;

    if (!email || !password || !name) {
      throw new Error('Email, name, and password are required');
    }

    const hashedPassword = await this._bcryptService.hash(password);

    return this._sellerRepository.create({
      email,
      name,
      password: hashedPassword,
      status: 'active',
    });
  }

  async findById(id: string): Promise<Seller> {
    const seller = await this._sellerRepository.findById(id);

    if (!seller) throw new NotFoundException('Seller not found');

    return seller;
  }

  async findByEmail(email: string): Promise<Seller | null> {
    const seller = await this._sellerRepository.findByEmail(email);

    if (!seller) {
      return null;
    }

    return seller;
  }

  async findAll(): Promise<Seller[]> {
    return this._sellerRepository.findAll();
  }

  async updateStatus(
    sellerId: string,
    status: 'active' | 'blocked',
  ): Promise<Seller> {
    return this._sellerRepository.update(sellerId, {
      status:
        status === 'active' ? AccountStatus.ACTIVE : AccountStatus.BLOCKED,
    });
  }
}
