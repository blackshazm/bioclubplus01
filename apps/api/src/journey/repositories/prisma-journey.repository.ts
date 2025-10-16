import { Injectable } from '@nestjs/common';
import { Journey as PrismaJourney } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { Journey } from '../../../../packages/core-journey/src/domain/journey.entity';
import { JourneyRepository } from '../../../../packages/core-journey/src/repositories/journey.repository.interface';

@Injectable()
export class PrismaJourneyRepository implements JourneyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<Journey | null> {
    const journey = await this.prisma.journey.findUnique({
      where: { userId },
    });

    if (!journey) {
      return null;
    }

    return this.toDomain(journey);
  }

  async save(journey: Journey): Promise<Journey> {
    const data = this.toPrisma(journey);

    const savedJourney = await this.prisma.journey.upsert({
      where: { userId: journey.userId },
      update: data,
      create: { ...data, userId: journey.userId },
    });

    return this.toDomain(savedJourney);
  }

  private toDomain(prismaJourney: PrismaJourney): Journey {
    const journey = new Journey();
    Object.assign(journey, prismaJourney);
    return journey;
  }

  private toPrisma(journey: Journey) {
    const { id, userId, ...data } = journey;
    return data;
  }
}