import { Injectable } from '@nestjs/common';
import { PasswordService } from '@bio-club/core-auth/src/services/password.service.interface';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class BcryptService implements PasswordService {
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}