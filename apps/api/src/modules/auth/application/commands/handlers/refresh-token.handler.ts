import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';

import { TokenService } from '@/modules/auth/domain/services';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenCommand } from '../refresh-token.command';
import { RefreshTokenIssuedEvent } from '@/shared/events/auth.events';

export interface RefreshTokenResult {
  accessToken: string;
  refreshToken: string;
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<
  RefreshTokenCommand,
  RefreshTokenResult
> {
  constructor(
    @Inject('TokenService')
    private readonly tokenService: TokenService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<RefreshTokenResult> {
    const { refreshToken } = command;

    try {
      // Verify refresh token
      const payload = this.tokenService.verifyRefreshToken(refreshToken);

      // Generate new tokens
      const newAccessToken = this.tokenService.generateAccessToken({
        sub: payload.sub,
        role: payload.role,
      });

      const newRefreshToken = this.tokenService.generateRefreshToken({
        sub: payload.sub,
        role: payload.role,
      });

      await this.eventBus.publish(new RefreshTokenIssuedEvent(payload.sub));

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
