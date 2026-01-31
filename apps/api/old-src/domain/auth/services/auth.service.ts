import bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';

import { Role } from '@/common/enums/role.enum';
import { JwtService } from '@/common/jwt/jwt.service';
import { UserService } from '@/domain/user/services/user.service';
import { AuthMethod } from '@/domain/auth/enums';
import { AdminService } from '@/domain/admin/services/admin.service';
import { GoogleService } from '@/domain/auth/services/google.service';
import { LoginDto } from '@/application/auth/dtos/request/login.request.dto';
import { AuthAccount } from '@/domain/auth/types';
import { AccountResolver } from '@/infrastructure/auth/resolvers';
import { RegisterDto } from '@/application/auth/dtos/request/register.request.dto';
import { AuthStrategyFactory } from '@/domain/auth/factories';
import { GoogleLoginDto } from '@/application/auth/dtos/request/google-login.request.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _userService: UserService,
    private readonly _adminService: AdminService,
    private readonly _accountResolver: AccountResolver,
    private readonly _strategyFactory: AuthStrategyFactory,
    private readonly _googleService: GoogleService,
  ) {}

  async login(dto: LoginDto) {
    const { identifier, password, otp, method, actor } = dto;

    const accountService = this._accountResolver.resolve(actor);

    let account: AuthAccount;

    if (method === AuthMethod.PASSWORD) {
      if (!password) {
        throw new BadRequestException('Password is required');
      }

      const strategy = this._strategyFactory.password();

      account = await strategy.validate(accountService, identifier, password);
    } else if (method === AuthMethod.OTP) {
      if (!otp) {
        throw new BadRequestException('OTP is required');
      }

      const strategy = this._strategyFactory.otp();

      account = await strategy.validate(accountService, identifier, otp);
    } else {
      throw new BadRequestException('Invalid auth method');
    }

    const accessToken = this._jwtService.generateAccessToken({
      sub: account.id,
      role: actor,
    });

    const refreshToken = this._jwtService.generateRefreshToken({
      sub: account.id,
      role: actor,
    });

    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDto) {
    const { email, phone, password } = dto;

    const exists =
      (email && (await this._userService.findByEmail(email))) ||
      (phone && (await this._userService.findByPhone(phone)));

    if (exists) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this._userService.create({
      email,
      phone,
      password: hashedPassword,
    });
  }

  async googleLogin(dto: GoogleLoginDto) {
    const { idToken, actor } = dto;

    const googleUser = await this._googleService.verifyIdToken(idToken);

    const accountService = this._accountResolver.resolve(actor);

    const email = googleUser.email;

    if (!email) {
      throw new BadRequestException('Google account does not have an email');
    }

    let account: AuthAccount | null = await accountService.findByEmail(email);

    if (!account) {
      account = await this._accountResolver.create(actor, {
        email: googleUser.email,
        name: googleUser.name,
        authMethod: AuthMethod.GOOGLE,
      });
    }

    const accessToken = this._jwtService.generateAccessToken({
      sub: account.id,
      role: actor,
    });

    const refreshToken = this._jwtService.generateRefreshToken({
      sub: account.id,
      role: actor,
    });

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    const payload = this._jwtService.verifyRefreshToken(refreshToken);
    const isAdmin = payload.role === Role.ADMIN.toString();

    const user = isAdmin
      ? await this._adminService.findById(payload.sub)
      : await this._userService.findById(payload.sub);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const newAccessToken = this._jwtService.generateAccessToken({
      sub: user.id,
      role: payload.role,
    });

    const newRefreshToken = this._jwtService.generateRefreshToken({
      sub: user.id,
      role: payload.role,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
