import { GenerateCommissionUseCase } from '../src/use-cases/generate-commission.use-case';
import { CommissionRepository } from '../src/repositories/commission.repository.interface';
import { UserRepository } from '@bio-club/core-users/src/repositories/user.repository.interface';
import { User } from '@bio-club/core-users/src/domain/user.entity';
import { Commission } from '../src/domain/commission.entity';

// Mock implementations
const mockCommissionRepository: jest.Mocked<CommissionRepository> = {
  save: jest.fn(),
};

const mockUserRepository: jest.Mocked<UserRepository> = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByCpf: jest.fn(),
  save: jest.fn(),
};

describe('GenerateCommissionUseCase', () => {
  let generateCommissionUseCase: GenerateCommissionUseCase;

  const beneficiary = User.hydrate({
    id: 'beneficiary-123',
    name: 'Beneficiary User',
    email: 'beneficiary@example.com',
    cpf: '11122233344',
    passwordHash: 'hashed-password',
    commissionRate: 0.2, // 20%
    accountStatus: 'Active',
    createdAt: new Date(),
    updatedAt: new Date(),
    referrerId: null
  });

  const payer = User.hydrate({
    id: 'payer-456',
    name: 'Payer User',
    email: 'payer@example.com',
    cpf: '55566677788',
    passwordHash: 'hashed-password',
    commissionRate: 0.2,
    accountStatus: 'Active',
    createdAt: new Date(),
    updatedAt: new Date(),
    referrerId: 'beneficiary-123'
  });

  beforeEach(() => {
    jest.clearAllMocks();
    generateCommissionUseCase = new GenerateCommissionUseCase(
      mockUserRepository,
      mockCommissionRepository,
    );
  });

  it('should generate a commission for a user with a referrer', async () => {
    const payment = { payerId: 'payer-456', paymentAmount: 100, paymentId: 'payment-789' };
    mockUserRepository.findById.mockResolvedValueOnce(payer).mockResolvedValueOnce(beneficiary);
    mockCommissionRepository.save.mockResolvedValue(undefined);

    await generateCommissionUseCase.execute(payment);

    expect(mockUserRepository.findById).toHaveBeenCalledWith(payment.payerId);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(payer.referrerId);
    expect(mockCommissionRepository.save).toHaveBeenCalledWith(expect.any(Commission));

    const savedCommission = mockCommissionRepository.save.mock.calls[0][0] as Commission;
    expect(savedCommission.beneficiaryId).toBe(beneficiary.id);
    expect(savedCommission.payerId).toBe(payer.id);
    expect(savedCommission.amount).toBe(20); // 100 * 0.20
  });

  it('should not generate a commission for a user without a referrer', async () => {
    const payerWithoutReferrer = User.hydrate({ ...payer.props, referrerId: null });
    const payment = { payerId: 'payer-456', paymentAmount: 100, paymentId: 'payment-789' };

    mockUserRepository.findById.mockResolvedValue(payerWithoutReferrer);

    await generateCommissionUseCase.execute(payment);

    expect(mockUserRepository.findById).toHaveBeenCalledWith(payment.payerId);
    expect(mockCommissionRepository.save).not.toHaveBeenCalled();
  });
});