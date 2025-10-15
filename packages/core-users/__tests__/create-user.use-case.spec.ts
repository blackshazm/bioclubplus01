import { CreateUserUseCase, UserAlreadyExistsError } from '../src/use-cases/create-user.use-case';
import { User } from '../src/domain/user.entity';
import { UserRepository } from '../src/repositories/user.repository.interface';

const mockUserRepository: jest.Mocked<UserRepository> = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByCpf: jest.fn(),
  save: jest.fn(),
};

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    createUserUseCase = new CreateUserUseCase(mockUserRepository);
  });

  it('should create a new user successfully', async () => {
    const input = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      cpf: '12345678901', // Using a valid-looking CPF for the test
      password: 'password123',
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.findByCpf.mockResolvedValue(null);
    mockUserRepository.save.mockResolvedValue(undefined);

    // Mock the static create method of User to avoid real CPF validation logic in this test
    const userInstance = { id: 'some-id', ...input, passwordHash: 'hashed-password' } as unknown as User;
    jest.spyOn(User, 'create').mockReturnValue(userInstance);
    jest.spyOn(User, 'isCpfValid').mockReturnValue(true);


    await expect(createUserUseCase.execute(input)).resolves.not.toThrow();

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(mockUserRepository.findByCpf).toHaveBeenCalledWith(input.cpf);
    expect(User.create).toHaveBeenCalled();
    expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(User));
  });

  it('should throw UserAlreadyExistsError if email is already in use', async () => {
    const input = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      cpf: '10987654321',
      password: 'password123',
    };

    const existingUser = User.create({
        name: 'Existing User',
        email: input.email,
        cpf: '00000000000',
        passwordHash: 'old-hash',
        commissionRate: 0.2,
        accountStatus: 'Active'
    });

    mockUserRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(createUserUseCase.execute(input)).rejects.toThrow(UserAlreadyExistsError);
    expect(mockUserRepository.findByCpf).not.toHaveBeenCalled();
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('should throw UserAlreadyExistsError if CPF is already in use', async () => {
    const input = {
      name: 'Jim Doe',
      email: 'jim.doe@example.com',
      cpf: '11223344556',
      password: 'password123',
    };

    const existingUser = User.create({
        name: 'Existing User',
        email: 'another@email.com',
        cpf: input.cpf,
        passwordHash: 'old-hash',
        commissionRate: 0.2,
        accountStatus: 'Active'
    });

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.findByCpf.mockResolvedValue(existingUser);

    await expect(createUserUseCase.execute(input)).rejects.toThrow(UserAlreadyExistsError);
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });
});