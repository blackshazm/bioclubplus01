import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { CommissionRepository } from '@bio-club/core-referrals/src/repositories/commission.repository.interface';
import { PrismaCommissionRepository } from './repositories/prisma-commission.repository';
import { GenerateCommissionUseCase } from '@bio-club/core-referrals/src/use-cases/generate-commission.use-case';
import { UserRepository } from '@bio-club/core-users/src/repositories/user.repository.interface';

const commissionRepositoryProvider = {
  provide: CommissionRepository,
  useClass: PrismaCommissionRepository,
};

const generateCommissionUseCaseProvider = {
  provide: GenerateCommissionUseCase,
  useFactory: (
    userRepository: UserRepository,
    commissionRepository: CommissionRepository,
  ) => {
    return new GenerateCommissionUseCase(userRepository, commissionRepository);
  },
  inject: [UserRepository, CommissionRepository],
};

@Module({
  imports: [PrismaModule, UsersModule],
  providers: [commissionRepositoryProvider, generateCommissionUseCaseProvider],
  exports: [generateCommissionUseCaseProvider],
})
export class ReferralsModule {}