import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { CreateUserUseCase } from '@bio-club/core-users/src/use-cases/create-user.use-case';
import { UserRepository } from '@bio-club/core-users/src/repositories/user.repository.interface';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    // Provide the use case, NestJS will resolve its dependencies
    CreateUserUseCase,
    // Provide the concrete repository when the abstract repository is requested
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export class UsersModule {}