import { Command } from '@nestjs/cqrs';

export interface BannerOrderUpdate {
  id: string;
  order: number;
}

export class ReorderBannersCommand extends Command<void> {
  constructor(public readonly banners: BannerOrderUpdate[]) {
    super();
  }
}
