import { Subscription } from '../domain/subscription.entity';

export abstract class SubscriptionRepository {
  abstract findByUserId(userId: string): Promise<Subscription | null>;
  abstract save(subscription: Subscription): Promise<void>;
}