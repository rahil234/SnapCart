import { GetUsersHandler } from './get-users.handler';
import { GetUserByIdHandler } from './get-user-by-id.handler';
import { GetUserByEmailHandler } from './get-user-by-email.handler';

import { GetMeHandler } from '@/modules/user/application/queries/get-me/get-me.handler';
import { GetAddressesHandler } from '@/modules/user/application/queries/get-addresses/get-addresses.handler';

export class QueryHandlers {
  static readonly handlers = [
    GetUserByIdHandler,
    GetUserByEmailHandler,
    GetUsersHandler,
    GetMeHandler,
    GetAddressesHandler,
  ];
}
