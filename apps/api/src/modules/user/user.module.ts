import { Module } from '@nestjs/common';

import { UserHttpModule } from '@/modules/user/interfaces/http/user.http.module';
import { UserApplicationModule } from '@/modules/user/application/user-application.module';

@Module({
  imports: [UserApplicationModule, UserHttpModule],
  exports: [UserApplicationModule],
})
export class UserModule {}
