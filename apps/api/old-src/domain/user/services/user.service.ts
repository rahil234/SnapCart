import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UserDto } from '@/application/user/dtos/user.dto';
import { MediaService } from '@/domain/media/services/media.service';
import { UpdateUserDto } from '@/application/user/dtos/request/update-user.dto';
import { CreateUserDto } from '@/application/user/dtos/request/create-user.dto';
import { UpdateStatusUserDto } from '@/application/user/dtos/request/update-status-user.dto';
import { UserPaginatedQueryDto } from '@/application/user/dtos/request/user-paginated-query.dto';
import type { IUserRepository } from '@/infrastructure/user/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly _mediaService: MediaService,
    @Inject('UserRepository') private readonly _userRepository: IUserRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const { email, phone } = createUserDto;

    if (!email && !phone) {
      throw new Error('Either email or phone is required');
    }

    const user = await this._userRepository.create({
      email,
      phone,
    });

    return new UserDto(user);
  }

  async find(
    query: UserPaginatedQueryDto,
  ): Promise<{ total: number; data: UserDto[] }> {
    const users = await this._userRepository.find(query);
    const u = users.length ? users.map((u) => new UserDto(u)) : [];
    const total = await this._userRepository.count();

    return {
      total,
      data: u,
    };
  }

  async findById(id: string): Promise<UserDto> {
    const user = await this._userRepository.findById(id);

    if (!user) throw new UnauthorizedException('User not found');

    const tryOnImage = await this._mediaService.getUserTryOnReadUrl(id);

    return new UserDto(user, tryOnImage);
  }

  async findByEmail(email: string): Promise<UserDto | null> {
    const user = await this._userRepository.findByEmail(email);
    if (!user) return null;
    return new UserDto(user);
  }

  async findByPhone(phone: string): Promise<UserDto | null> {
    const user = await this._userRepository.findByPhone(phone);
    if (!user) return null;
    return new UserDto(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDto> {
    const doc = await this._userRepository.update(id, dto);

    if (!doc)
      throw new BadRequestException('User update failed. User not found');

    const tryOnImage = await this._mediaService.getUserTryOnReadUrl(id);

    return new UserDto(doc, tryOnImage);
  }

  async updateStatus(id: string, dto: UpdateStatusUserDto): Promise<UserDto> {
    const doc = await this._userRepository.update(id, {
      status: dto.status,
    });

    if (!doc)
      throw new BadRequestException(
        'User status update failed. User not found',
      );

    return new UserDto(doc);
  }

  async getTryOnLimit(id: string): Promise<number> {
    const user = await this._userRepository.findById(id);

    if (!user) throw new BadRequestException('User not found');

    return user.tryOnLimit;
  }

  async IncreaseTryOnLimit(id: string, count: number): Promise<boolean> {
    const user = await this._userRepository.findById(id);

    if (!user) throw new BadRequestException('User not found');

    return Boolean(
      await this._userRepository.update(user.id, {
        tryOnLimit: user.tryOnLimit + count,
      }),
    );
  }

  async consumeTryOnLimit(id: string): Promise<boolean> {
    const user = await this._userRepository.findById(id);

    if (!user) throw new BadRequestException('User not found');

    if (user.tryOnLimit < 1) return false;

    await this._userRepository.update(id, {
      tryOnLimit: user.tryOnLimit - 1,
    });

    return true;
  }
}
