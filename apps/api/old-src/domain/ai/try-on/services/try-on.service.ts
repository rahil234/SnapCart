import axios from 'axios';
import { BadRequestException, Injectable } from '@nestjs/common';

import { UserService } from '@/domain/user/services/user.service';
import { CreateTryOnDto } from '@/ai/try-on/dto/create-try-on.dto';
import { ProductService } from '@/domain/product/services/product.service';
import {
  TryOnRequest,
  TryOnResponse,
  VertexService,
} from '@/ai/vertex/vertex.service';
import { TryOnMediaService } from '@/domain/media/services/tryon-upload.service';
import { QueryBus } from '@nestjs/cqrs';

@Injectable()
export class TryOnService {
  constructor(
    private readonly _vertexService: VertexService,
    private readonly queryBus: QueryBus,
    private readonly _userService: UserService,
    private readonly _tryOnMediaService: TryOnMediaService,
  ) {}

  private async _urlToBase64(this: void, url: string): Promise<string> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data).toString('base64');
  }

  async generateTryOn(userId: string, dto: CreateTryOnDto): Promise<string[]> {
    const product = await this._productService.findById(dto.productId);

    const user = await this._userService.findById(userId);

    const success = await this._userService.consumeTryOnLimit(user.id);

    if (!success) {
      throw new BadRequestException('Try-On limit exceeded');
    }

    if (!product) {
      throw new BadRequestException('Product not found');
    } else if (!product.tryOn) {
      throw new BadRequestException('Try-On not available for this product');
    } else if (!user || !user.tryOnImage) {
      throw new BadRequestException('User profile image not found');
    }

    const personImageUrl = user.tryOnImage;

    const productImageUrls = [product.thumbnail];

    const [personImageBase64, ...productImagesBase64] = await Promise.all([
      this._urlToBase64(personImageUrl),
      ...productImageUrls.map(this._urlToBase64),
    ]);

    const req: TryOnRequest = {
      personImage: {
        base64: personImageBase64,
      },
      productImages: productImagesBase64.map((base64) => ({ base64 })),
    };

    let data: TryOnResponse;
    try {
      data = await this._vertexService.virtualTryOn(req);

      console.log(data);

      const result = await Promise.all(
        data.predictions.map(async (prediction) =>
          this._tryOnMediaService.uploadTryOnResultBase64(
            userId,
            product.id,
            prediction.bytesBase64Encoded,
          ),
        ),
      );

      console.log('Virtual Try-On Response:', result);

      return result;
    } catch (error) {
      console.error('Error during Virtual Try-On:', error);
      throw new BadRequestException('Failed to generate Try-On images');
    }
  }
}
