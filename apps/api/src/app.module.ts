import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { ReferralsModule } from './referrals/referrals.module';
import { PaymentModule } from './payments/payments.module';
import { JourneyModule } from './journey/journey.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    SubscriptionsModule,
    ReferralsModule,
    PaymentModule,
    JourneyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}