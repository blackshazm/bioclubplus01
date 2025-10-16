import { Journey } from '../domain/journey.entity';
import { JourneyRepository } from '../repositories/journey.repository.interface';
import { UserRepository } from '@bio-club/core-users/repositories/user.repository.interface';
import { User } from '@bio-club/core-users/domain/user.entity';

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export class CompleteJourneyStepUseCase {
  constructor(
    private readonly journeyRepository: JourneyRepository,
    private readonly userRepository: UserRepository,
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

    user.updateCommissionRate(updatedCommission);

    await this.journeyRepository.save(journey);
    await this.userRepository.save(user);
  }
}