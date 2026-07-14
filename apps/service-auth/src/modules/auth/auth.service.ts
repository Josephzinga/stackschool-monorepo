import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { TokenService } from './services/token.service';
import { AuthUserService } from './services/auth-user.service';
import type { Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { ForgotPasswordService } from './services/forgot-password.service';
import { ResendCodeService } from './services/resend-code.service';
import { ResetPasswordService } from './services/reset-password.service';
import { VerifyCodeService } from './services/verify-code.service';
import {
  AuthRpcException,
  ResetPasswordInput,
  CreateUserSessionResponse,
  CreateUserInput,
  ValidateCredentialsInput,
} from '@stackschool/messaging';
import { toUserWithRelationsContract } from '../../mappers/user.mapper';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authUserService: AuthUserService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly forgotPasswordService: ForgotPasswordService,
    private readonly resendCodeService: ResendCodeService,
    private readonly resetPasswordService: ResetPasswordService,
    private readonly verifyCodeService: VerifyCodeService,
  ) {}

  async register(registerDto: CreateUserInput) {
    console.log('Register service-auth', registerDto);
    const safeEmail = registerDto?.email?.trim();
    const safePhone = registerDto?.phoneNumber?.trim();

    const existing = await this.userService.findOne({
      where: {
        isActive: true,
        OR: [
          {
            username: {
              equals: registerDto.username?.trim(),
              mode: 'insensitive',
            },
          },
          { email: safeEmail },
          { phoneNumber: safePhone },
        ],
      },
    });

    if (existing) {
      if (safeEmail && existing?.email === safeEmail) {
        throw new AuthRpcException('EMAIL_TAKEN', 'Email déjà utilisé.');
      }
      if (existing?.username === registerDto.username) {
        throw new AuthRpcException(
          'USERNAME_TAKEN',
          "Nom d'utilisateur déjà utilisé.",
        );
      }
      if (safePhone && existing.phoneNumber === safePhone) {
        throw new AuthRpcException(
          'PHONE_TAKEN',
          'Numéro de téléphone déjà utilisé.',
        );
      }
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 12);

    const newUser = await this.userService.createArgs({
      data: {
        password: passwordHash,
        email: safeEmail,
        phoneNumber: safePhone,
        isActive: true,
        username: registerDto.username,
      },
      include: {
        profile: true,
        accounts: true,
      },
    });

    if (registerDto.phoneNumber) {
      const code = this.tokenService.generate6Code();
      const codeHash = this.tokenService.hashCode(code);
      const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15min
      await this.prisma.verificationCode.deleteMany({
        where: {
          userId: newUser?.id,
        },
      });
      await this.prisma.verificationCode.create({
        data: {
          codeHash,
          expiresAt,
          userId: newUser?.id as string,
        },
      });

      try {
        console.log('send');
      } catch (sendErr) {
        console.error('Erreur envoi WhatsApp:', sendErr);
      }
    }

    return newUser;
  }

  async findFullUser(userId: string) {
    return await this.userService.findOne({
      where: {
        id: userId,
      },
      include: {
        profile: true,
        accounts: true,
      },
    });
  }

  async login(user: Request['user'], res: Response) {
    if (!user?.id) {
      throw new UnauthorizedException('Utilisateur non authentifié.');
    }

    const { sessionToken, expires } = await this.tokenService.createUserSession(
      user.id,
    );

    return res.status(HttpStatus.OK).json({
      ok: true,
      message: 'Authentification réussi avec succès!',
      user: {
        id: user?.id,
        email: user?.email,
        username: user?.username,
        phoneNumber: user?.phoneNumber,
        profileCompleted: user?.profileCompleted,
        emailVerified: user.emailVerified,
        provider: user?.accounts?.map((acc) => acc.provider).join(',') || '',
        profile: {
          id: user?.profile?.id,
          firstname: user?.profile?.firstname,
          lastname: user?.profile?.lastname,
          avatarUrl: user?.profile?.avatarUrl,
        },
      },
    });
  }
  async validateLocalUser(data: ValidateCredentialsInput) {
    const user = await this.userService.findByIdentifierWithRelations(
      data.identifier,
    );

    if (!user)
      throw new AuthRpcException('USER_NOT_FOUND', 'Utilisateur non trouvé.');

    const hasLocalPassword =
      typeof user.password === 'string' && user.password.length > 0;
    const socialProviders = (user.accounts as Array<{ provider: string }>)
      .filter((acc) => acc.provider !== 'local')
      .map((acc) => acc.provider);

    if (!hasLocalPassword && socialProviders.length > 0) {
      throw new AuthRpcException(
        'SOCIAL_ONLY_ACCOUNT',
        `Ce compte utilise : ${socialProviders.join(', ')}. Veuillez vous connecter avec.`,
        { providers: socialProviders },
      );
    }

    if (!hasLocalPassword) {
      throw new AuthRpcException(
        'INVALID_CREDENTIALS',
        'Identifiant invalide.',
      );
    }

    const validPassword = await bcrypt.compare(
      data.password,
      user.password as string,
    );
    if (!validPassword) {
      throw new AuthRpcException(
        'INVALID_CREDENTIALS',
        'Identifiant invalide.',
      );
    }

    return toUserWithRelationsContract(user);
  }
  async validateOAuthUser({ accessToken, refreshToken, profileOAuth }: any) {
    try {
      console.log('Validate OAuthUser service auth', profileOAuth);
      const profile = profileOAuth.profile;
      const providerAccountId = profile?.id;
      const emailRaw = profile?.emails?.[0]?.value || null;
      const emailVerified =
        (profileOAuth.provider === 'google'
          ? profileOAuth.profile?.emails?.[0]?.verified
          : false) ?? false;
      const email = emailRaw ? emailRaw.toLowerCase() : null;
      const displayName = profile?.displayName ?? '';
      const avatar = profile?.photos?.[0]?.value || null;
      const parts = displayName.trim() ? displayName.trim().split(/\s+/) : [];
      const firstname = parts.shift() ?? '';
      const lastname = parts.join(' ') ?? '';

      const user = await this.authUserService.upsertOauthUser({
        provider: profileOAuth.provider,
        providerAccountId,
        email,
        emailVerified,
        displayName,
        firstname,
        lastname,
        avatar,
        accessToken,
        refreshToken,
      });

      return user;
    } catch (err) {
      throw new AuthRpcException(
        'INTERNAL_ERROR',
        "Erreur lors de la création de l'utilisateur",
      );
    }
  }

  // ─── Reset Password ───
  async resetPassword(dto: ResetPasswordInput) {
    return await this.resetPasswordService.execute(dto);
  }

  // ─── Verify Code ───
  async verifyCode(code: string, tempToken: string) {
    return await this.verifyCodeService.execute(code, tempToken);
  }

  // ─── Resend Code ───
  resendCode(tempToken: string) {
    return this.resendCodeService.execute(tempToken);
  }

  async forgotPassword(identifier: string) {
    return this.forgotPasswordService.execute(identifier);
  }

  async generateSession(userId: string): Promise<CreateUserSessionResponse> {
    return await this.tokenService.createUserSession(userId);
  }

  async refreshToken(refreshToken: string) {
    const hashToken = this.tokenService.hashToken(refreshToken);
    const dbSession = await this.prisma.session.findFirst({
      where: { sessionToken: hashToken },
    });

    if (!dbSession || dbSession.expires < new Date()) {
      // si token abssent ou expiré
      if (dbSession) {
        await this.prisma.session.delete({
          where: { id: dbSession.id },
        });
      }
      throw new AuthRpcException(
        'INVALID_CREDENTIALS',
        'Token de rafraîchissement invalide ou expiré.',
      );
    }
    const user = await this.userService.findUnique({
      where: { id: dbSession.userId as string },
    });

    if (!user) {
      await this.prisma.session.delete({
        where: { id: dbSession.id },
      });
      throw new AuthRpcException(
        'INVALID_CREDENTIALS',
        'Token de rafraîchissement invalide ou expiré.',
      );
    }

    await this.prisma.session.delete({
      where: {
        id: dbSession.id,
      },
    });
    return {
      ok: true,
      user: toUserWithRelationsContract({ ...user, accounts: [] }),
    };
  }
}
