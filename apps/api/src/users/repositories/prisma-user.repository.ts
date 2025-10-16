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
      where: { id: user.id || '' },
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
    return {
      id: domainUser.id,
      name: domainUser.name,
      email: domainUser.email,
      cpf: domainUser.cpf,
      passwordHash: domainUser.passwordHash,
      commissionRate: domainUser.commissionRate,
      accountStatus: domainUser.accountStatus,
      referrerId: domainUser.referrerId || null,
      createdAt: domainUser.createdAt,
      updatedAt: domainUser.updatedAt,
    };
  }
}