import { Request } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { toUserWithRelationsContract } from '../../../mappers/user.mapper';
import { AuthRpcException } from '@stackschool/messaging';

export interface UpsertOauthUserParams {
  provider: 'google' | 'facebook';
  providerAccountId: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string;
  firstName: string;
  lastName: string;
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
    firstName,
    lastName,
    avatar,
    accessToken,
    refreshToken,
  }: UpsertOauthUserParams) {
    try {
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
                firstName,
                lastName,
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

      const safeEmail =
        email || `${provider}:${providerAccountId}@local.invalid`;

      const newUser = await this.prisma.user.create({
        data: {
          email: safeEmail,
          emailVerified,
          username: displayName,
          profile: {
            create: {
              firstName,
              lastName,
              avatarUrl: avatar,
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
    } catch (err: any) {
      throw new AuthRpcException(
        'INTERNAL_ERROR',
        'Erreur lors de la création où mise à jours des données social',
        { error: err },
      );
    }
  }

  private excludePassword(user: Request['user']) {
    if (!user) return;
    return {
      ...user,
      password: null,
    };
  }
}
