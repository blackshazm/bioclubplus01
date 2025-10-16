import { Controller, Post, UseGuards, Request, ConflictException, HttpStatus, HttpCode } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSubscriptionUseCase } from '@bio-club/core-subscriptions/src/use-cases/create-subscription.use-case';
import { SubscriptionAlreadyExistsError } from '@bio-club/core-subscriptions/src/errors/subscription-already-exists.error';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly createSubscriptionUseCase: CreateSubscriptionUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req) {
    try {
      const userId = req.user.userId;
      const dueDate = new Date().getDate(); // Use the current day of the month as the due date

      await this.createSubscriptionUseCase.execute({ userId, dueDate });

      return { message: 'Subscription created successfully.' };
    } catch (error) {
      if (error instanceof SubscriptionAlreadyExistsError) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }
}