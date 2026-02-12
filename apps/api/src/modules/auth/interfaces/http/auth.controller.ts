import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Req,
  Res,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Request, Response } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { Role } from '@/shared/enums/role.enum';
import {
  ApiCommonErrorResponses,
  ApiConflictResponse,
} from '@/shared/decorators/api-error-responses.decorator';
import { Roles } from '@/shared/decorators/roles.decorator';
import { Public } from '@/shared/decorators/public.decorator';
import { UserId } from '@/shared/decorators/user-id.decorator';
import { HttpResponse } from '@/shared/dto/common/http-response.dto';
import { ApiResponseWithType } from '@/shared/decorators/api-response.decorator';

// DTOs
import { LoginDto } from '@/modules/auth/application/dtos/request/login.dto';
import { RegisterDto } from '@/modules/auth/application/dtos/request/register.dto';
import { VerifyOTPDto } from '@/modules/auth/application/dtos/request/verify-otp.dto';
import { RequestOTPDto } from '@/modules/auth/application/dtos/request/request-otp.dto';
import { ResetPasswordDto } from '@/modules/auth/application/dtos/request/reset-password.dto';
import { ChangePasswordDto } from '@/modules/auth/application/dtos/request/change-password.dto';
import { ForgotPasswordDto } from '@/modules/auth/application/dtos/request/forgot-password.dto';
import { LoginWithGoogleDto } from '@/modules/auth/application/dtos/request/login-with-google.dto';

// Commands
import {
  RegisterCommand,
  LoginCommand,
  LoginWithGoogleCommand,
  RequestOTPCommand,
  VerifyOTPCommand,
  RefreshTokenCommand,
  ForgotPasswordCommand,
  ResetPasswordCommand,
  ChangePasswordCommand,
} from '@/modules/auth/application/commands';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new customer account with email/phone and password',
  })
  @ApiResponseWithType({
    status: HttpStatus.CREATED,
    description: 'User registered successfully',
  })
  @ApiConflictResponse('User already exists')
  @ApiCommonErrorResponses()
  async register(@Body() dto: RegisterDto): Promise<HttpResponse> {
    const command = new RegisterCommand(
      dto.email ?? null,
      dto.phone ?? null,
      dto.password,
    );

    await this.commandBus.execute(command);

    return {
      message: 'User registered successfully',
    };
  }

  @Post('login')
  @Public()
  @ApiOperation({
    summary: 'Login with password or OTP',
    description: 'Authenticate user with password or OTP',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'User logged in successfully',
  })
  @ApiCommonErrorResponses()
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<HttpResponse> {
    const command = new LoginCommand(
      dto.identifier,
      dto.method,
      dto.password,
      dto.otp,
    );

    const result = await this.commandBus.execute(command);

    // Set tokens in cookies
    this.setAuthCookies(res, result.accessToken, result.refreshToken);

    return {
      message: 'User logged in successfully',
    };
  }

  @Post('login/google')
  @Public()
  @ApiOperation({
    summary: 'Login with Google',
    description: 'Authenticate user with Google OAuth',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'User logged in successfully',
  })
  @ApiCommonErrorResponses()
  async loginWithGoogle(
    @Body() dto: LoginWithGoogleDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<HttpResponse> {
    const command = new LoginWithGoogleCommand(dto.idToken);

    const result = await this.commandBus.execute(command);

    // Set tokens in cookies
    this.setAuthCookies(res, result.accessToken, result.refreshToken);

    return {
      message: result.isNewUser
        ? 'User registered and logged in successfully'
        : 'User logged in successfully',
    };
  }

  @Post('otp/request')
  @Public()
  @ApiOperation({
    summary: 'Request OTP',
    description: 'Send OTP to email or phone number',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'OTP sent successfully',
  })
  @ApiCommonErrorResponses()
  async requestOTP(@Body() dto: RequestOTPDto): Promise<HttpResponse> {
    const command = new RequestOTPCommand(dto.identifier);

    await this.commandBus.execute(command);

    return {
      message: 'OTP sent successfully',
    };
  }

  @Post('otp/verify')
  @Public()
  @ApiOperation({
    summary: 'Verify OTP',
    description: 'Verify OTP code',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'OTP verified successfully',
  })
  @ApiCommonErrorResponses()
  async verifyOTP(@Body() dto: VerifyOTPDto): Promise<HttpResponse> {
    const command = new VerifyOTPCommand(dto.identifier, dto.otp);

    await this.commandBus.execute(command);

    return {
      message: 'OTP verified successfully',
    };
  }

  @Post('refresh')
  @Public()
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Get new access token using refresh token',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Token refreshed successfully',
  })
  @ApiCommonErrorResponses()
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<HttpResponse> {
    const refreshToken = req.cookies['refresh_token'] as string;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const command = new RefreshTokenCommand(refreshToken);

    const result = await this.commandBus.execute(command);

    // Set new tokens in cookies
    this.setAuthCookies(res, result.accessToken, result.refreshToken);

    return {
      message: 'Token refreshed successfully',
    };
  }

  @Post('password/forgot')
  @Public()
  @ApiOperation({
    summary: 'Forgot password',
    description: 'Request OTP for password reset',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Password reset OTP sent successfully',
  })
  @ApiCommonErrorResponses()
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<HttpResponse> {
    const command = new ForgotPasswordCommand(dto.identifier);

    await this.commandBus.execute(command);

    return {
      message: 'Password reset OTP sent successfully',
    };
  }

  @Post('password/reset')
  @Public()
  @ApiOperation({
    summary: 'Reset password',
    description: 'Reset password using OTP',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Password reset successfully',
  })
  @ApiCommonErrorResponses()
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<HttpResponse> {
    const command = new ResetPasswordCommand(
      dto.identifier,
      dto.otp,
      dto.newPassword,
    );

    await this.commandBus.execute(command);

    return {
      message: 'Password reset successfully',
    };
  }

  @Post('password/change')
  @Roles(Role.CUSTOMER, Role.SELLER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Change password',
    description: 'Change password for authenticated user',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Password changed successfully',
  })
  @ApiCommonErrorResponses()
  async changePassword(
    @UserId() userId: string,
    @Body() dto: ChangePasswordDto,
  ): Promise<HttpResponse> {
    const command = new ChangePasswordCommand(
      userId,
      dto.currentPassword,
      dto.newPassword,
    );

    await this.commandBus.execute(command);

    return {
      message: 'Password changed successfully',
    };
  }

  @Post('logout')
  @Public()
  @ApiOperation({
    summary: 'Logout',
    description: 'Clear authentication cookies',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'User logged out successfully',
  })
  logout(@Res({ passthrough: true }) res: Response): HttpResponse {
    this.clearAuthCookies(res);

    return {
      message: 'User logged out successfully',
    };
  }

  // Helper methods
  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private clearAuthCookies(res: Response): void {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }
}
