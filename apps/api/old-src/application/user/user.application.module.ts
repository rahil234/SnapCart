import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserDomainModule } from '../../domain/user/user.domain.module';
import { UserInfrastructureModule } from '../../infrastructure/user/user.infrastructure.module';

// Command Handlers
import {
  CreateUserHandler,
  UpdateUserHandler,
  UpdateUserStatusHandler,
} from './commands/handlers';

// Query Handlers
import {
  GetUserByIdHandler,
  GetUserByEmailHandler,
  GetUsersHandler,
} from './queries/handlers';

const CommandHandlers = [CreateUserHandler, UpdateUserHandler, UpdateUserStatusHandler];
const QueryHandlers = [GetUserByIdHandler, GetUserByEmailHandler, GetUsersHandler];

@Module({
  imports: [CqrsModule, UserDomainModule, UserInfrastructureModule],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [...CommandHandlers, ...QueryHandlers],
})
export class UserApplicationModule {}
