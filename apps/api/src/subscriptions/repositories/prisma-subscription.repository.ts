import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubscriptionRepository } from '@bio-club/core-subscriptions/src/repositories/subscription.repository.interface';
import { Subscription as DomainSubscription, SubscriptionProps } from '@bio-club/core-subscriptions/src/domain/subscription.entity';
import { Prisma, Subscription as PrismaSubscription } from '@prisma/client';

@Injectable()
export class PrismaSubscriptionRepository implements SubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<DomainSubscription | null> {
    const subscription = await this.prisma.subscription.findUnique({ where: { userId } });
    return subscription ? this.toDomain(subscription) : null;
  }

  async save(subscription: DomainSubscription): Promise<void> {
    if (subscription.id) {
      const data = this.toPrismaUpdate(subscription);
      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data,
      });
    } else {
      const data = this.toPrismaCreate(subscription);
      await this.prisma.subscription.create({ data });
    }
  }

  private toDomain(prismaSubscription: PrismaSubscription): DomainSubscription {
    const props: SubscriptionProps = {
      ...prismaSubscription,
      status: prismaSubscription.status as any,
    };
    return DomainSubscription.hydrate(props);
  }

  private toPrismaCreate(domainSubscription: DomainSubscription): Prisma.SubscriptionCreateInput {
    return {
      user: { connect: { id: domainSubscription.userId } },
      status: domainSubscription.status,
      startDate: domainSubscription.startDate,
      dueDate: domainSubscription.dueDate,
      cancellationDate: domainSubscription.cancellationDate,
    };
  }

  private toPrismaUpdate(domainSubscription: DomainSubscription): Prisma.SubscriptionUpdateInput {
    return {
      status: domainSubscription.status,
      dueDate: domainSubscription.dueDate,
      cancellationDate: domainSubscription.cancellationDate,
      // userId is immutable and should not be updated
    };
  }
}