import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { CompleteJourneyStepUseCase } from '../../../packages/core-journey/src/use-cases/complete-journey-step.use-case';
import { PrismaJourneyRepository } from './repositories/prisma-journey.repository';
import { JourneyRepository } from '../../../packages/core-journey/src/repositories/journey.repository.interface';
import { JourneyController } from './journey.controller';
import { UserRepository } from '@bio-club/core-users/src/repositories/user.repository.interface';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [JourneyController],
  providers: [
    {
      provide: 'JourneyRepository',
      useClass: PrismaJourneyRepository,
    },
    {
      provide: CompleteJourneyStepUseCase,
      useFactory: (
        journeyRepository: JourneyRepository,
        userRepository: UserRepository,
      ) => {
        return new CompleteJourneyStepUseCase(journeyRepository, userRepository);
      },
      inject: ['JourneyRepository', UserRepository],
    },
  ],
})
export class JourneyModule {}