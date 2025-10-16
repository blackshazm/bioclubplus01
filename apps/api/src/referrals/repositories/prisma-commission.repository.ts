import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CommissionRepository } from '@bio-club/core-referrals/src/repositories/commission.repository.interface';
import { Commission as DomainCommission } from '@bio-club/core-referrals/src/domain/commission.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaCommissionRepository implements CommissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(commission: DomainCommission): Promise<void> {
    const data = this.toPrismaCreate(commission);
    await this.prisma.commission.create({ data });
  }

  private toPrismaCreate(domainCommission: DomainCommission): Prisma.CommissionCreateInput {
    return {
      beneficiary: { connect: { id: domainCommission.beneficiaryId } },
      payer: { connect: { id: domainCommission.payerId } },
      payment: { connect: { id: domainCommission.paymentId } },
      amount: domainCommission.amount,
      status: domainCommission.status as any, // Assuming enums are compatible
      generationDate: domainCommission.generationDate,
      releaseDate: domainCommission.releaseDate,
    };
  }
}