import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { LoginUserUseCase } from '@bio-club/core-auth/src/use-cases/login-user.use-case';
import { CreateUserUseCase } from '@bio-club/core-users/src/use-cases/create-user.use-case';
import { PasswordService } from '@bio-club/core-auth/src/services/password.service.interface';
import { AuthTokenService } from '@bio-club/core-auth/src/services/token.service.interface';
import { BcryptService } from './services/bcrypt.service';
import { JwtAuthService } from './services/jwt.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRepository } from '@bio-club/core-users/src/repositories/user.repository.interface';

import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    {
      provide: PasswordService,
      useClass: BcryptService,
    },
    {
      provide: AuthTokenService,
      useClass: JwtAuthService,
    },
    {
      provide: LoginUserUseCase,
      useFactory: (
        userRepository: UserRepository,
        passwordService: PasswordService,
        authTokenService: AuthTokenService,
      ) => {
        return new LoginUserUseCase(userRepository, passwordService, authTokenService);
      },
      inject: [UserRepository, PasswordService, AuthTokenService],
    },
    {
      provide: CreateUserUseCase,
      useFactory: (userRepository: UserRepository, passwordService: PasswordService) => {
        return new CreateUserUseCase(userRepository, passwordService);
      },
      inject: [UserRepository, PasswordService],
    },
  ],
})
export class AuthModule {}