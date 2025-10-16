import { Module } from '@nestjs/common';
import { ReferralsModule } from '../referrals/referrals.module';
import { PaymentController } from './payment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentService } from './payment.service';

@Module({
  imports: [PrismaModule, ReferralsModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}