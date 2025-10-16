import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenService } from '@bio-club/core-auth/src/services/token.service.interface';

@Injectable()
export class JwtAuthService implements AuthTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generate(payload: object): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}