import { Request } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { toUserWithRelationsContract } from '../../../mappers/user.mapper';

export interface UpsertOauthUserParams {
  provider: 'google' | 'facebook';
  providerAccountId: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string;
  firstname?: string;
  lastname?: string;
  avatar: string | null;
  accessToken?: string;
  refreshToken?: string;
}

@Injectable()
export class AuthUserService {
  constructor(private readonly prisma: PrismaService) {}
  async upsertOauthUser({
    provider,
    providerAccountId,
    email,
    emailVerified,
    displayName,
    firstname,
    lastname,
    avatar,
    accessToken,
    refreshToken,
  }: UpsertOauthUserParams) {
    const existingAccount = await this.prisma.account.findUnique({
      where: {
        provider_providerAccountId: { provider, providerAccountId },
      },
      include: { user: { include: { profile: true, accounts: true } } },
    });

    if (existingAccount) {
      await this.prisma.account.update({
        where: { id: existingAccount.id },
        data: {
          access_token: accessToken ?? existingAccount.access_token,
          refresh_token: refreshToken ?? existingAccount.refresh_token,
        },
      });

      return this.excludePassword(existingAccount.user);
    }

    if (email) {
      const user = await this.prisma.user.findUnique({
        where: { email },
        include: { profile: true, accounts: true },
      });

      if (user) {
        const accountExists = (
          user.accounts as Array<{ provider: string }>
        ).some((acc) => acc.provider === provider);

        if (!accountExists) {
          await this.prisma.account.create({
            data: {
              provider,
              providerAccountId,
              access_token: accessToken,
              refresh_token: refreshToken,
              user: { connect: { id: user.id } },
            },
          });
        }

        if (!user.profile && avatar) {
          await this.prisma.profile.create({
            data: {
              firstname,
              lastname,
              avatarUrl: avatar,
              user: { connect: { id: user.id } },
            },
          });
        } else if (!user.profile?.avatarUrl && avatar) {
          await this.prisma.profile.update({
            where: { id: user.profile?.id },
            data: { avatarUrl: avatar },
          });
        }

        const freshUser = await this.prisma.user.findUnique({
          where: { id: user.id },
          include: { profile: true, accounts: true },
        });
        return this.excludePassword(freshUser ?? user);
      }
    }

    const safeEmail = email || `${provider}:${providerAccountId}@local.invalid`;

    const newUser = await this.prisma.user.create({
      data: {
        email: safeEmail,
        emailVerified,
        username: displayName,
        profile: {
          create: {
            firstname,
            lastname,
            photo: avatar,
          },
        },
        accounts: {
          create: {
            provider,
            providerAccountId,
            access_token: accessToken,
            refresh_token: refreshToken,
          },
        },
      },
      include: { profile: true, accounts: true },
    });

    return toUserWithRelationsContract(newUser);
  }

  private excludePassword(user: Request['user']) {
    if (!user) return;
    return {
      ...user,
      password: null,
    };
  }
}
