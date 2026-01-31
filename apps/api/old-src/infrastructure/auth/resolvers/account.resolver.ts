import { Injectable } from '@nestjs/common';
import { AdminService } from '@/domain/admin/services/admin.service';
import { UserService } from '@/domain/user/services/user.service';
import { SellerService } from '@/domain/seller/services/seller.service';
import { ActorType } from '@/domain/auth/enums';

@Injectable()
export class AccountResolver {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
    private readonly sellerService: SellerService,
  ) {}

  resolve(actor: ActorType) {
    switch (actor) {
      case ActorType.USER:
        return this.userService;
      case ActorType.ADMIN:
        return this.adminService;
      case ActorType.SELLER:
        return this.sellerService;
      default:
        throw new Error(`Unknown actor type: ${actor}`);
    }
  }
}
