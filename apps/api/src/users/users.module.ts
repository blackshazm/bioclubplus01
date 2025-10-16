import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { CreateUserUseCase } from '@bio-club/core-users/src/use-cases/create-user.use-case';
import { UserRepository } from '@bio-club/core-users/src/repositories/user.repository.interface';

const userRepositoryProvider = {
  provide: UserRepository,
  useClass: PrismaUserRepository,
};

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [CreateUserUseCase, userRepositoryProvider],
  exports: [userRepositoryProvider], // Export the provider
})
export class UsersModule {}