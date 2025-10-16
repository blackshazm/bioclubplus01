import { Journey } from '../domain/journey.entity';
import { JourneyRepository } from '../repositories/journey.repository.interface';
import { IUserRepository } from '@bio-club/core-users/repositories/user.repository.interface';
import { User, UserProps } from '@bio-club/core-users/domain/user.entity';

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export class CompleteJourneyStepUseCase {
  constructor(
    private readonly journeyRepository: JourneyRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, stepNumber: Step): Promise<void> {
    let journey = await this.journeyRepository.findByUserId(userId);
    if (!journey) {
      journey = new Journey();
      journey.userId = userId;
    }

    const stepProperty = `step${stepNumber}Completed` as keyof Journey;

    if (journey[stepProperty] === true) {
      return; // Step already completed
    }

    (journey[stepProperty] as boolean) = true;
    journey.updateProgress();

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const newCommission = 0.20 + (journey.totalProgress * 0.01);
    const updatedCommission = Math.min(newCommission, 0.30);

    const userProps: UserProps = {
      id: user.id,
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      passwordHash: user.passwordHash,
      commissionRate: updatedCommission,
      accountStatus: user.accountStatus,
      referrerId: user.referrerId,
      createdAt: user.createdAt,
      updatedAt: new Date(),
    };

    const updatedUser = User.hydrate(userProps);

    await this.journeyRepository.save(journey);
    await this.userRepository.save(updatedUser);
  }
}