export class SubscriptionAlreadyExistsError extends Error {
  constructor(userId: string) {
    super(`User with ID ${userId} already has an active subscription.`);
    this.name = 'SubscriptionAlreadyExistsError';
  }
}