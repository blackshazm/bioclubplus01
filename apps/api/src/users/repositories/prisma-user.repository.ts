import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRepository } from '@bio-club/core-users/src/repositories/user.repository.interface';
import { User as DomainUser, UserProps } from '@bio-club/core-users/src/domain/user.entity';
import { Prisma, User as PrismaUser } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<DomainUser | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<DomainUser | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? this.toDomain(user) : null;
  }

  async findByCpf(cpf: string): Promise<DomainUser | null> {
    const user = await this.prisma.user.findUnique({ where: { cpf } });
    return user ? this.toDomain(user) : null;
  }

  async save(user: DomainUser): Promise<void> {
    const data = this.toPrisma(user);
    await this.prisma.user.upsert({
      where: { id: user.id || '' }, // Use an empty string for new users to ensure create is triggered
      create: data,
      update: data,
    });
  }

  private toDomain(prismaUser: PrismaUser): DomainUser {
    const props: UserProps = {
      ...prismaUser,
      accountStatus: prismaUser.accountStatus as 'Active' | 'Inactive' | 'Suspended',
    };
    return DomainUser.hydrate(props);
  }

  private toPrisma(domainUser: DomainUser): Prisma.UserCreateInput {
    // The id is omitted here because upsert handles it in the 'where' clause.
    // For create, Prisma will generate it. For update, it's identified by 'where'.
    return {
      name: domainUser.name,
      email: domainUser.email,
      cpf: domainUser.cpf,
      passwordHash: domainUser.passwordHash,
      commissionRate: domainUser.commissionRate,
      accountStatus: domainUser.accountStatus,
      referrerId: domainUser.referrerId || null,
    };
  }
}