import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class PaymentWebhookDto {
  @IsString()
  @IsNotEmpty()
  subscriptionId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  gatewayPaymentId: string;
}