import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { HTTP_RESPONSE } from '@/common/types';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import {
  clearAuthCookies,
  setAuthCookies,
} from '@/infrastructure/auth/utils';
import { AuthService } from '@/domain/auth/services/auth.service';
import { Public } from '@/common/decorators/public.decorator';
import { HttpResponse } from '@/common/dto/http-response.dto';
import { LoginDto } from '@/application/auth/dtos/request/login.request.dto';
import { ApiResponseWithType } from '@/common/decorators/api-response.decorator';
import { RegisterDto } from '@/application/auth/dtos/request/register.request.dto';
import { GoogleLoginDto } from '@/application/auth/dtos/request/google-login.request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login user with email and password.' })
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginDto,
  ): Promise<HttpResponse> {
    const { accessToken, refreshToken } = await this._authService.login(dto);

    setAuthCookies(res, { accessToken, refreshToken });

    return {
      message: 'User logged in successfully',
      success: true,
    };
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user.' })
  async register(@Body() dto: RegisterDto): Promise<HttpResponse> {
    await this._authService.register(dto);

    return {
      message: 'User registered successfully',
      success: true,
    };
  }

  @Public()
  @Post('oauth/google')
  googleLogin(@Body() dto: GoogleLoginDto) {
    return this._authService.googleLogin(dto);
  }

  @Public()
  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access and refresh tokens.' })
  @ApiResponseWithType({
    status: 200,
    description: 'Tokens refreshed successfully',
  })
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<HTTP_RESPONSE> {
    const refreshToken = req.cookies['refresh_token'] as string;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this._authService.refreshTokens(refreshToken);

    setAuthCookies(res, {
      accessToken: accessToken,
      refreshToken: newRefreshToken,
    });

    return {
      success: true,
      message: 'Tokens refreshed successfully',
    };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user removes token from cookies.' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  logout(@Res({ passthrough: true }) res: Response): HTTP_RESPONSE {
    clearAuthCookies(res);

    return { success: true, message: 'User logged out successfully' };
  }
}
