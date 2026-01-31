import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleService {
  private readonly _oauth2Client: OAuth2Client;

  constructor(private readonly _configService: ConfigService) {
    this._oauth2Client = new OAuth2Client(
      this._configService.get('GOOGLE_CLIENT_ID'),
      this._configService.get('GOOGLE_CLIENT_SECRET'),
    );
  }

  async verifyIdToken(idToken: string) {
    const ticket = await this._oauth2Client.verifyIdToken({
      idToken,
      audience: this._configService.get('GOOGLE_CLIENT_ID'),
    });
    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid Google ID token');
    }
    return {
      email: payload.email,
      name: payload.name,
    };
  }
}
