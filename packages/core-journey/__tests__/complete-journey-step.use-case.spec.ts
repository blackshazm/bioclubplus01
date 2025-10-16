import { CompleteJourneyStepUseCase } from '../src/use-cases/complete-journey-step.use-case';
import { JourneyRepository } from '../src/repositories/journey.repository.interface';
import { IUserRepository } from '@bio-club/core-users/repositories/user.repository.interface';
import { Journey } from '../src/domain/journey.entity';
import { User } from '@bio-club/core-users/domain/user.entity';

describe('CompleteJourneyStepUseCase', () => {
  let journeyRepository: JourneyRepository;
  let userRepository: IUserRepository;
  let useCase: CompleteJourneyStepUseCase;

  beforeEach(() => {
    journeyRepository = {
      findByUserId: jest.fn(),
      save: jest.fn().mockImplementation(journey => Promise.resolve(journey)),
    };
    userRepository = {
      findById: jest.fn(),
      save: jest.fn().mockImplementation(user => Promise.resolve(user)),
    };
    useCase = new CompleteJourneyStepUseCase(journeyRepository, userRepository);
  });

  it('should complete a step for the first time and increase commission by 1%', async () => {
    const userId = 'user-1';
    const user = User.hydrate({ id: userId, commissionRate: 0.20, name: 'Test', email: 'test@test.com', cpf: '11144477735', passwordHash: 'hash', accountStatus: 'Active', createdAt: new Date(), updatedAt: new Date() });
    const journey = new Journey();
    journey.userId = userId;

    (journeyRepository.findByUserId as jest.Mock).mockResolvedValue(journey);
    (userRepository.findById as jest.Mock).mockResolvedValue(user);

    await useCase.execute(userId, 1);

    expect(journey.step1Completed).toBe(true);
    expect(journey.totalProgress).toBe(1);

    const savedUser = (userRepository.save as jest.Mock).mock.calls[0][0] as User;
    expect(savedUser.commissionRate).toBeCloseTo(0.21);

    expect(journeyRepository.save).toHaveBeenCalledWith(journey);
    expect(userRepository.save).toHaveBeenCalledWith(savedUser);
  });

  it('should not change progress or commission if the step is already completed', async () => {
    const userId = 'user-1';
    const user = User.hydrate({ id: userId, commissionRate: 0.21, name: 'Test', email: 'test@test.com', cpf: '11144477735', passwordHash: 'hash', accountStatus: 'Active', createdAt: new Date(), updatedAt: new Date() });
    const journey = new Journey();
    journey.userId = userId;
    journey.step1Completed = true;
    journey.updateProgress();

    (journeyRepository.findByUserId as jest.Mock).mockResolvedValue(journey);
    (userRepository.findById as jest.Mock).mockResolvedValue(user);

    await useCase.execute(userId, 1);

    expect(journeyRepository.save).not.toHaveBeenCalled();
    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('should limit the commission rate to 30%', async () => {
    const userId = 'user-1';
    const user = User.hydrate({ id: userId, commissionRate: 0.29, name: 'Test', email: 'test@test.com', cpf: '11144477735', passwordHash: 'hash', accountStatus: 'Active', createdAt: new Date(), updatedAt: new Date() });
    const journey = new Journey();
    journey.userId = userId;
    journey.step1Completed = true;
    journey.step2Completed = true;
    journey.step3Completed = true;
    journey.step4Completed = true;
    journey.step5Completed = true;
    journey.step6Completed = true;
    journey.step7Completed = true;
    journey.step8Completed = true;
    journey.step9Completed = true;
    journey.updateProgress();

    (journeyRepository.findByUserId as jest.Mock).mockResolvedValue(journey);
    (userRepository.findById as jest.Mock).mockResolvedValue(user);

    await useCase.execute(userId, 10);

    const savedUser = (userRepository.save as jest.Mock).mock.calls[0][0] as User;
    expect(savedUser.commissionRate).toBeCloseTo(0.30);
  });
});