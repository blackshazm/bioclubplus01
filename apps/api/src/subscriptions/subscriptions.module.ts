import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionRepository } from '@bio-club/core-subscriptions/src/repositories/subscription.repository.interface';
import { PrismaSubscriptionRepository } from './repositories/prisma-subscription.repository';
import { CreateSubscriptionUseCase } from '@bio-club/core-subscriptions/src/use-cases/create-subscription.use-case';
import { UserRepository } from '@bio-club/core-users/src/repositories/user.repository.interface';

const subscriptionRepositoryProvider = {
  provide: SubscriptionRepository,
  useClass: PrismaSubscriptionRepository,
};

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [SubscriptionsController],
  providers: [
    subscriptionRepositoryProvider,
    {
      provide: CreateSubscriptionUseCase,
      useFactory: (
        subscriptionRepository: SubscriptionRepository,
        userRepository: UserRepository,
      ) => {
        return new CreateSubscriptionUseCase(subscriptionRepository, userRepository);
      },
      inject: [SubscriptionRepository, UserRepository],
    },
  ],
})
export class SubscriptionsModule {}