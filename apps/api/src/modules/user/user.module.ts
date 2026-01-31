import { Module } from '@nestjs/common';

import { UserHttpModule } from '@/modules/user/interfaces/http/user.http.module';

@Module({
  imports: [UserHttpModule],
  exports: [UserHttpModule],
})
export class UserModule {}
