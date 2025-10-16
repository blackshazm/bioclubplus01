import { UserRepository } from '@bio-club/core-users/src/repositories/user.repository.interface';
import { CommissionRepository } from '../repositories/commission.repository.interface';
import { Commission } from '../domain/commission.entity';

export interface PaymentInput {
  payerId: string;
  paymentAmount: number;
  paymentId: string;
}

export class GenerateCommissionUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly commissionRepository: CommissionRepository,
  ) {}

  async execute(payment: PaymentInput): Promise<void> {
    const payer = await this.userRepository.findById(payment.payerId);

    if (!payer || !payer.referrerId) {
      return; // No referrer, no commission.
    }

    const beneficiary = await this.userRepository.findById(payer.referrerId);

    if (!beneficiary) {
      // This case should ideally not happen if data integrity is maintained.
      // Could log an error here.
      return;
    }

    const commissionAmount = payment.paymentAmount * beneficiary.commissionRate;

    const releaseDate = new Date();
    releaseDate.setDate(releaseDate.getDate() + 30);

    const commission = Commission.create({
      beneficiaryId: beneficiary.id,
      payerId: payer.id,
      paymentId: payment.paymentId,
      amount: commissionAmount,
      releaseDate,
    });

    await this.commissionRepository.save(commission);
  }
}