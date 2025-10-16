import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserUseCase } from '@bio-club/core-auth/src/use-cases/login-user.use-case';
import { CreateUserUseCase } from '@bio-club/core-users/src/use-cases/create-user.use-case';
import { CreateUserDto } from './dto/create-user.dto';
import { InvalidCredentialsError } from '@bio-club/core-auth/src/errors/invalid-credentials.error';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    await this.createUserUseCase.execute(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const result = await this.loginUserUseCase.execute(loginUserDto);
      return { accessToken: result.token };
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }
}