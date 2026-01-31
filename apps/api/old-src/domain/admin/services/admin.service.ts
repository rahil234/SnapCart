import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { Admin } from '@/domain/admin/entities/admin.entity';
import type { IAdminRepository } from '@/infrastructure/admin/repositories/interfaces/admin.repository';

@Injectable()
export class AdminService {
  constructor(
    @Inject('AdminRepository')
    private readonly _adminRepository: IAdminRepository,
  ) {}

  async findById(id: string): Promise<Admin> {
    const admin = await this._adminRepository.findById(id);

    if (!admin) throw new NotFoundException('Admin not found');

    return admin;
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await this._adminRepository.findByEmail(email);

    if (!admin) throw new NotFoundException('Admin not found');

    return admin;
  }

  findAll(): Promise<Admin[]> {
    return this._adminRepository.findAll();
  }

  update(id: string, updateData: Partial<Admin>): Promise<Admin> {
    return this._adminRepository.update(id, updateData);
  }
}
