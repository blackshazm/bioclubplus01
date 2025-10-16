import { Controller, Post, Body, ConflictException, HttpStatus, HttpCode, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserUseCase, UserAlreadyExistsError } from '@bio-club/core-users/src/use-cases/create-user.use-case';

@Controller('auth')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      await this.createUserUseCase.execute(createUserDto);
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }
}