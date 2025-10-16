import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentWebhookDto } from './dto/payment-webhook.dto';
import { Payment, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async processWebhook(body: PaymentWebhookDto): Promise<{ userId: string; payment: Payment }> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: body.subscriptionId },
      select: { userId: true },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found.');
    }

    const payment = await this.prisma.payment.create({
      data: {
        subscriptionId: body.subscriptionId,
        amount: body.amount,
        gatewayPaymentId: body.gatewayPaymentId,
        status: PaymentStatus.Paid, // Using the correct enum value
      },
    });

    return { userId: subscription.userId, payment };
  }
}