import { UserRepository } from '@bio-club/core-users/src/repositories/user.repository.interface';
import { PasswordService } from '../services/password.service.interface';
import { AuthTokenService } from '../services/token.service.interface';
import { InvalidCredentialsError } from '../errors/invalid-credentials.error';

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface LoginUserOutput {
  token: string;
}

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly authTokenService: AuthTokenService,
  ) {}

  async execute(input: LoginUserInput): Promise<LoginUserOutput> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await this.passwordService.compare(
      input.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    // Assuming the user entity has a 'roles' property or we assign a default one.
    const token = await this.authTokenService.generate({
      sub: user.id,
      // roles: user.roles,
    });

    return { token };
  }
}