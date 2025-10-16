import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { GenerateCommissionUseCase } from '@bio-club/core-referrals/src/use-cases/generate-commission.use-case';
import { PaymentWebhookDto } from './dto/payment-webhook.dto';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly generateCommissionUseCase: GenerateCommissionUseCase,
  ) {}

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handlePaymentWebhook(@Body() body: PaymentWebhookDto) {
    const { userId, payment } = await this.paymentService.processWebhook(body);

    await this.generateCommissionUseCase.execute({
      payerId: userId,
      paymentAmount: payment.amount,
      paymentId: payment.id,
    });

    return { received: true };
  }
}