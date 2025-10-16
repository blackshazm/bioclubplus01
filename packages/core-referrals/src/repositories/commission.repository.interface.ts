import { Commission } from '../domain/commission.entity';

export abstract class CommissionRepository {
  abstract save(commission: Commission): Promise<void>;
}