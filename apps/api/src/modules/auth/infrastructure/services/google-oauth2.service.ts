import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GoogleAuthService } from '@/modules/auth/domain/services/google-auth.service';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleOAuth2Service implements GoogleAuthService {
  private client: OAuth2Client;

  constructor(private readonly configService: ConfigService) {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    this.client = new OAuth2Client(clientId);
  }

  async verifyIdToken(idToken: string): Promise<{
    email: string;
    name?: string;
    picture?: string;
  }> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();

      if (!payload || !payload.email) {
        throw new UnauthorizedException('Invalid Google token');
      }

      return {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };
    } catch (error) {
      throw new UnauthorizedException('Failed to verify Google token');
    }
  }
}
