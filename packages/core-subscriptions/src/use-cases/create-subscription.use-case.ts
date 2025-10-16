import { SubscriptionRepository } from '../repositories/subscription.repository.interface';
import { UserRepository } from '@bio-club/core-users/src/repositories/user.repository.interface';
import { Subscription } from '../domain/subscription.entity';
import { SubscriptionAlreadyExistsError } from '../errors/subscription-already-exists.error';

export interface CreateSubscriptionInput {
  userId: string;
  dueDate: number;
}

export class CreateSubscriptionUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: CreateSubscriptionInput): Promise<void> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new Error('User not found.');
    }

    const existingSubscription = await this.subscriptionRepository.findByUserId(input.userId);
    if (existingSubscription && existingSubscription.status === 'Ativa') {
      throw new SubscriptionAlreadyExistsError(input.userId);
    }

    const subscription = Subscription.create({
      userId: input.userId,
      dueDate: input.dueDate,
    });

    await this.subscriptionRepository.save(subscription);
  }
}