import { CreateSubscriptionUseCase } from '../src/use-cases/create-subscription.use-case';
import { SubscriptionRepository } from '../src/repositories/subscription.repository.interface';
import { UserRepository } from '@bio-club/core-users/src/repositories/user.repository.interface';
import { User } from '@bio-club/core-users/src/domain/user.entity';
import { Subscription, SubscriptionStatus } from '../src/domain/subscription.entity';
import { SubscriptionAlreadyExistsError } from '../src/errors/subscription-already-exists.error';

// Mock implementations
const mockSubscriptionRepository: jest.Mocked<SubscriptionRepository> = {
  findByUserId: jest.fn(),
  save: jest.fn(),
};

const mockUserRepository: jest.Mocked<UserRepository> = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByCpf: jest.fn(),
  save: jest.fn(),
};

describe('CreateSubscriptionUseCase', () => {
  let createSubscriptionUseCase: CreateSubscriptionUseCase;

  const user = User.hydrate({
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
    cpf: '12345678900',
    passwordHash: 'hashed-password',
    commissionRate: 0.2,
    accountStatus: 'Active',
    createdAt: new Date(),
    updatedAt: new Date(),
    referrerId: null
  });

  beforeEach(() => {
    jest.clearAllMocks();
    createSubscriptionUseCase = new CreateSubscriptionUseCase(
      mockSubscriptionRepository,
      mockUserRepository,
    );
  });

  it('should create a subscription successfully for a new user', async () => {
    const input = { userId: 'user-123', dueDate: 10 };
    mockUserRepository.findById.mockResolvedValue(user);
    mockSubscriptionRepository.findByUserId.mockResolvedValue(null);
    mockSubscriptionRepository.save.mockResolvedValue(undefined);

    await expect(createSubscriptionUseCase.execute(input)).resolves.not.toThrow();

    expect(mockUserRepository.findById).toHaveBeenCalledWith(input.userId);
    expect(mockSubscriptionRepository.findByUserId).toHaveBeenCalledWith(input.userId);
    expect(mockSubscriptionRepository.save).toHaveBeenCalledWith(expect.any(Subscription));
  });

  it('should throw SubscriptionAlreadyExistsError if the user already has an active subscription', async () => {
    const input = { userId: 'user-123', dueDate: 10 };
    const existingSubscription = Subscription.hydrate({
      id: 'sub-123',
      userId: 'user-123',
      status: SubscriptionStatus.Active,
      startDate: new Date(),
      dueDate: 10,
    });
    mockUserRepository.findById.mockResolvedValue(user);
    mockSubscriptionRepository.findByUserId.mockResolvedValue(existingSubscription);

    await expect(createSubscriptionUseCase.execute(input)).rejects.toThrow(SubscriptionAlreadyExistsError);
    expect(mockSubscriptionRepository.save).not.toHaveBeenCalled();
  });

  it('should create a subscription if an old one was canceled', async () => {
    const input = { userId: 'user-123', dueDate: 10 };
    const existingSubscription = Subscription.hydrate({
      id: 'sub-123',
      userId: 'user-123',
      status: SubscriptionStatus.Canceled,
      startDate: new Date(),
      dueDate: 10,
    });
    mockUserRepository.findById.mockResolvedValue(user);
    mockSubscriptionRepository.findByUserId.mockResolvedValue(existingSubscription);

    await expect(createSubscriptionUseCase.execute(input)).resolves.not.toThrow();
    expect(mockSubscriptionRepository.save).toHaveBeenCalledWith(expect.any(Subscription));
  });

  it('should throw an error if the user is not found', async () => {
    const input = { userId: 'non-existent-user', dueDate: 10 };
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(createSubscriptionUseCase.execute(input)).rejects.toThrow('User not found.');
    expect(mockSubscriptionRepository.findByUserId).not.toHaveBeenCalled();
    expect(mockSubscriptionRepository.save).not.toHaveBeenCalled();
  });
});