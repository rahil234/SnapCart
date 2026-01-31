import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleAuth } from 'google-auth-library';

interface Predictions {
  mimeType: 'image/png';
  bytesBase64Encoded: string;
}

export interface TryOnRequest {
  personImage: { base64: string };
  productImages: { base64: string }[];
}

export interface TryOnResponse {
  predictions: Predictions[];
}

@Injectable()
export class VertexService {
  private readonly PROJECT_ID: string;
  private readonly REGION: string;
  private readonly MODEL_ID: string;
  private readonly PRIVATE_KEY: string;
  private readonly CLIENT_EMAIL: string;

  constructor() {
    const configService = new ConfigService();

    this.REGION = configService.getOrThrow<string>('GCP_REGION');
    this.PROJECT_ID = configService.getOrThrow<string>('GCP_PROJECT_ID');
    this.MODEL_ID = configService.getOrThrow<string>('GCP_VERTEX_MODEL_ID');
    this.CLIENT_EMAIL = configService.getOrThrow<string>('GCP_CLIENT_EMAIL');
    this.PRIVATE_KEY = configService
      .getOrThrow<string>('GCP_PRIVATE_KEY')
      .replace(/\\n/g, '\n');
  }

  private async _getAccessToken(): Promise<string> {
    const auth = new GoogleAuth({
      credentials: {
        client_email: this.CLIENT_EMAIL,
        private_key: this.PRIVATE_KEY,
      },
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
    const client = await auth.getClient();
    const { token } = await client.getAccessToken();

    if (!token)
      throw new Error('Failed to obtain access token for Google Cloud.');

    return token;
  }

  async virtualTryOn(payload: TryOnRequest): Promise<TryOnResponse> {
    const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${this.PROJECT_ID}/locations/${this.REGION}/publishers/google/models/${this.MODEL_ID}:predict`;

    const payloadWrapper = {
      instances: [
        {
          personImage: {
            image: {
              bytesBase64Encoded: payload.personImage.base64,
            },
          },
          productImages: [
            ...payload.productImages.map((productImage) => ({
              image: {
                bytesBase64Encoded: productImage.base64,
              },
            })),
          ],
        },
      ],
      parameters: {
        sampleCount: 1,
        personGeneration: 'allow_all',
        safetySetting: 'block_only_high',
      },
    };

    const { data } = await axios.post<TryOnResponse>(url, payloadWrapper, {
      headers: {
        Authorization: `Bearer ${await this._getAccessToken()}`,
        'Content-Type': 'application/json',
      },
    });

    return data;
  }
}
