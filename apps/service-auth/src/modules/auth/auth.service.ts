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
import { VerifyCallback } from 'passport-google-oauth20';
import { PrismaService } from '../../prisma/prisma.service';
import { TokenService } from './services/token.service';
import { AuthUserService } from './services/auth-user.service';
import { Profile as GoogleProfile } from 'passport-google-oauth20';
import { Profile as FacebookProfile } from 'passport-facebook';
import { LoginDto, RegisterDto } from './dto/auth-dto';
import type { Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@stackschool/db-auth';
import { ForgotPasswordService } from './services/forgot-password/forgot-password.service';
import { ResendCodeService } from './services/resend-code/resend-code.service';
import { ResetPasswordService } from './services/reset-password/reset-password.service';
import { VerifyCodeService } from './services/verify-code/verify-code.service';
import { AppRpcException } from '@stackschool/shared';

interface ValidateOAuthUserParams {
  accessToken: string;
  refreshToken: string;
  profileOAuth: ProfileOAuth;
  done: VerifyCallback;
}

type AuthenticatedUser = Prisma.UserGetPayload<{
  include: { accounts: true; profile: true };
}>;

type ProfileOAuth =
  | { provider: 'google'; profile: GoogleProfile }
  | { provider: 'facebook'; profile: FacebookProfile };

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

  async register(registerDto: RegisterDto) {
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
        throw new AppRpcException('EMAIL_TAKEN', 'Email déjà utilisé.');
      }
      if (existing?.username === registerDto.username) {
        throw new AppRpcException(
          'USERNAME_TAKEN',
          "Nom d'utilisateur déjà utilisé.",
        );
      }
      if (safePhone && existing.phoneNumber === safePhone) {
        throw new AppRpcException(
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

  async login(user: AuthenticatedUser | Request['user'], res: Response) {
    if (!user?.id) {
      throw new UnauthorizedException('Utilisateur non authentifié.');
    }

    const { sessionToken, expires } = await this.tokenService.createUserSession(
      user.id,
    );
    this.setResponseCookies(res, sessionToken, expires);

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
          photo: user?.profile?.photo,
        },
      },
    });
  }
  async validateLocalUser(loginDto: LoginDto) {
    const user = await this.userService.findOne({
      where: {
        isActive: true,
        OR: [
          { email: { equals: loginDto.identifier, mode: 'insensitive' } },
          { phoneNumber: loginDto.identifier },
          { username: { equals: loginDto.identifier, mode: 'insensitive' } },
        ],
      },
      include: { accounts: true, profile: true },
    });

    if (!user) {
      throw new AppRpcException('USER_NOT_FOUND', 'Utilisateur non trouvé.');
    }

    const hasLocalPassword =
      typeof user.password === 'string' && user.password.length > 0;
    const socialProviders = (user.accounts as Array<{ provider: string }>)
      .filter((acc) => acc.provider !== 'local')
      .map((acc) => acc.provider);

    if (!hasLocalPassword && socialProviders.length > 0) {
      throw new AppRpcException(
        'SOCIAL_ONLY_ACCOUNT',
        `Ce compte utilise : ${socialProviders.join(', ')}. Veuillez vous connecter avec.`,
        { providers: socialProviders },
      );
    }

    if (!hasLocalPassword) {
      throw new AppRpcException('INVALID_CREDENTIALS', 'Identifiant invalide.');
    }

    const validPassword = await bcrypt.compare(
      loginDto.password,
      user.password as string,
    );
    if (!validPassword) {
      throw new AppRpcException('INVALID_CREDENTIALS', 'Identifiant invalide.');
    }

    return user;
  }

  async validateOAuthUser({
    accessToken,
    refreshToken,
    profileOAuth,
    done,
  }: ValidateOAuthUserParams) {
    try {
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

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }

  async handleSocialCallback(req: Request, res: Response) {
    const user = req.user;
    if (!user || !user.id) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=1`);
    }

    const { sessionToken, expires } = await this.tokenService.createUserSession(
      user.id,
    );
    this.setResponseCookies(res, sessionToken, expires);

    if (!user.profileCompleted) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/complete-profile`);
    }

    return res.redirect(`${process.env.FRONTEND_URL}/auth/finish`);
  }
  // ─── Reset Password ───
  async resetPassword(
    token: string | undefined,
    password: string,
    req: Request,
    res: Response,
  ) {
    return await this.resetPasswordService.execute(token, password, req, res);
  }

  // ─── Verify Code ───
  async verifyCode(code: string, req: Request, res: Response) {
    return await this.verifyCodeService.execute(code, req, res);
  }

  // ─── Resend Code ───
  resendCode(req: Request) {
    return this.resendCodeService.execute(req);
  }

  async forgotPassword(identifier: string, res: Response) {
    return this.forgotPasswordService.forgotPassword(identifier, res);
  }

  async generateSession(userId: string) {
    return this.tokenService.createUserSession(userId);
  }

  async refreshToken(req: Request, res: Response, refreshToken: string) {
    try {
      const dbSession = await this.prisma.session.findFirst({
        where: { sessionToken: refreshToken },
      });

      if (!dbSession || dbSession.expires < new Date()) {
        // si token abssent ou expiré
        if (dbSession) {
          await this.prisma.session.delete({
            where: { id: dbSession.id },
          });
        }
        res.clearCookie('refresh_token');
        throw new UnauthorizedException(
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
        res.clearCookie('refresh_token');
        throw new NotFoundException('Utilisateur non trouvé.');
      }

      await this.prisma.session.delete({
        where: {
          id: dbSession.id,
        },
      });

      req.logIn(user, (err) => {
        if (err)
          throw new InternalServerErrorException(
            'Impossible de se connecter après rafraichisement.',
          );
        this.login(user, res).catch((err) => {
          throw new InternalServerErrorException(err);
        });
      });
    } catch (err: any) {
      throw new InternalServerErrorException(
        'Erreur lors du rafréchisement du token.',
        err,
      );
    }
  }

  private setResponseCookies(
    res: Response,
    sessionToken: string,
    expires: Date,
  ) {
    res.cookie('refresh_token', sessionToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: expires.getTime() - Date.now(),
    });
  }
}
