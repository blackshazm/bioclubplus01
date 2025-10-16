import { Journey } from '../domain/journey.entity';

export interface JourneyRepository {
  findByUserId(userId: string): Promise<Journey | null>;
  save(journey: Journey): Promise<Journey>;
}