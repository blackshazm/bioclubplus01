import { User } from '../domain/user.entity';

// Using an abstract class allows it to be used as a DI token in NestJS
export abstract class UserRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByCpf(cpf: string): Promise<User | null>;
  abstract save(user: User): Promise<void>;
}