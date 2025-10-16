import { User } from '../domain/user.entity';
import { UserRepository } from '../repositories/user.repository.interface';
import * as bcrypt from 'bcryptjs';

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export class UserAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserAlreadyExistsError';
  }
}

export interface CreateUserUseCaseInput {
  name: string;
  email: string;
  cpf: string;
  password: string;
  referrerId?: string | null;
}

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: CreateUserUseCaseInput): Promise<void> {
    const existingUserByEmail = await this.userRepository.findByEmail(input.email);
    if (existingUserByEmail) {
      throw new UserAlreadyExistsError(`User with email ${input.email} already exists.`);
    }

    const existingUserByCpf = await this.userRepository.findByCpf(input.cpf);
    if (existingUserByCpf) {
      throw new UserAlreadyExistsError(`User with CPF ${input.cpf} already exists.`);
    }

    const passwordHash = await hashPassword(input.password);

    const user = User.create({
      name: input.name,
      email: input.email,
      cpf: input.cpf,
      passwordHash,
      referrerId: input.referrerId,
      commissionRate: 0.20, // Default 20%
      accountStatus: 'Active',
    });

    await this.userRepository.save(user);
  }
}