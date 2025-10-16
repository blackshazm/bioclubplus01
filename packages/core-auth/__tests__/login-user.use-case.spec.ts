import { LoginUserUseCase } from '../src/use-cases/login-user.use-case';
import { InvalidCredentialsError } from '../src/errors/invalid-credentials.error';
import { UserRepository } from '@bio-club/core-users/src/repositories/user.repository.interface';
import { User } from '@bio-club/core-users/src/domain/user.entity';
import { PasswordService } from '../src/services/password.service.interface';
import { AuthTokenService } from '../src/services/token.service.interface';

// Mock implementations
const mockUserRepository: jest.Mocked<UserRepository> = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByCpf: jest.fn(),
  save: jest.fn(),
};

const mockPasswordService: jest.Mocked<PasswordService> = {
  hash: jest.fn(),
  compare: jest.fn(),
};

const mockAuthTokenService: jest.Mocked<AuthTokenService> = {
  generate: jest.fn(),
};

describe('LoginUserUseCase', () => {
  let loginUserUseCase: LoginUserUseCase;

  // A mock user for testing purposes
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
    loginUserUseCase = new LoginUserUseCase(
      mockUserRepository,
      mockPasswordService,
      mockAuthTokenService,
    );
  });

  it('should return a token on successful login', async () => {
    const input = { email: 'test@example.com', password: 'password123' };
    const expectedToken = 'jwt-token-string';

    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockPasswordService.compare.mockResolvedValue(true);
    mockAuthTokenService.generate.mockResolvedValue(expectedToken);

    const result = await loginUserUseCase.execute(input);

    expect(result.token).toBe(expectedToken);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(mockPasswordService.compare).toHaveBeenCalledWith(input.password, user.passwordHash);
    expect(mockAuthTokenService.generate).toHaveBeenCalledWith({ sub: user.id });
  });

  it('should throw InvalidCredentialsError for a non-existent email', async () => {
    const input = { email: 'wrong@example.com', password: 'password123' };
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(loginUserUseCase.execute(input)).rejects.toThrow(InvalidCredentialsError);
    expect(mockPasswordService.compare).not.toHaveBeenCalled();
    expect(mockAuthTokenService.generate).not.toHaveBeenCalled();
  });

  it('should throw InvalidCredentialsError for an incorrect password', async () => {
    const input = { email: 'test@example.com', password: 'wrong-password' };
    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockPasswordService.compare.mockResolvedValue(false);

    await expect(loginUserUseCase.execute(input)).rejects.toThrow(InvalidCredentialsError);
    expect(mockAuthTokenService.generate).not.toHaveBeenCalled();
  });
});