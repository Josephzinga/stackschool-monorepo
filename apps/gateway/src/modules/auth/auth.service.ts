import {
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterDto } from './dto/auth-dto';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import {
  AUTH_PATTERNS,
  CreateUserSessionResponse,
  createUserSessionResponse,
  type ForgotPasswordResponse,
  forgotPasswordResponse,
  RefreshTokenResponse,
  refreshTokenResponse,
  type ResetPasswordResponse,
  resetPasswordResponse,
  safeValidateSchema,
  type VerifyCodeResponse,
  verifyCodeResponse,
} from '@stackschool/messaging';
import { UserWithRelationsContract } from '@stackschool/contracts';
import type { Request, Response } from 'express';
import { mapAuthError } from '../../errors/auth.error-maper';
import { ConfigService } from '@nestjs/config';
import { RESET_TOKEN_EXP_MINUTES } from '../../constant/config';
import { validateWith } from '../../utils/validate.operator';
import { DoneCallback } from 'passport';
import { Profile as GoogleProfile } from 'passport-google-oauth20';
import { Profile as FacebookProfile } from 'passport-facebook';

interface ValidateOAuthUserParams {
  accessToken: string;
  refreshToken: string;
  profileOAuth: ProfileOAuth;
  done: DoneCallback;
}

type ProfileOAuth =
  | { provider: 'google'; profile: GoogleProfile }
  | { provider: 'facebook'; profile: FacebookProfile };

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    return await firstValueFrom<UserWithRelationsContract>(
      this.authClient
        .send(AUTH_PATTERNS.CREATE_USER, dto)
        .pipe(catchError((err) => throwError(() => mapAuthError(err)))),
    );
  }

  async login(
    user: Request['user'],
    res: Response,
    isRefresh: boolean = false,
  ) {
    if (!user) throw new UnauthorizedException('Utilisateur non authentifier.');

    const session = await this.createUserSession(user.id);
    this.setResponseCookies(
      res,
      session.sessionToken,
      'refresh_token',
      new Date(session.expires),
    );
    return res.status(HttpStatus.OK).json({
      ok: true,
      ...(!isRefresh && {
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
            firstName: user?.profile?.firstName,
            lastName: user?.profile?.lastName,
            avatarUrl: user?.profile?.avatarUrl,
          },
        },
      }),
    });
  }

  async forgotPassword(identifier: string, res: Response) {
    const result = await firstValueFrom<ForgotPasswordResponse>(
      this.authClient.send(AUTH_PATTERNS.FORGOT_PASSWORD, { identifier }).pipe(
        timeout(3000),
        catchError((err) => throwError(() => mapAuthError(err))),
      ),
    );

    const { success, data, errors } = safeValidateSchema(
      forgotPasswordResponse,
      result,
    );

    if (!success || !data) {
      console.log('Erreur de validation', errors);
      return;
    }
    const expires = data.expires
      ? new Date(data.expires)
      : new Date(Date.now() + 1000 * 60 * RESET_TOKEN_EXP_MINUTES);

    this.setResponseCookies(res, data.tempToken!, 'tempToken', expires);

    return res.status(200).json({
      ok: true,
      message: data?.message,
      method: data.method,
    });
  }

  async handleSocialCallback(user: UserWithRelationsContract, res: Response) {
    if (!user || !user.id) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=1`);
    }
    const { sessionToken, expires } = await this.createUserSession(user.id);
    this.setResponseCookies(
      res,
      sessionToken,
      'refresh_token',
      new Date(expires),
    );
    if (!user.profileCompleted) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/complete-profile`);
    }

    return res.redirect(`${process.env.FRONTEND_URL}/auth/finish`);
  }

  async validateOAuthUser({
    accessToken,
    refreshToken,
    profileOAuth,
    done,
  }: ValidateOAuthUserParams) {
    const result = await firstValueFrom<UserWithRelationsContract>(
      this.authClient
        .send(AUTH_PATTERNS.VALIDATE_OAUTH_USER, {
          accessToken,
          refreshToken,
          profileOAuth,
        })
        .pipe(
          timeout(3000),
          catchError((err) => throwError(() => mapAuthError(err))),
        ),
    );
    done(null, result);
  }

  async validateLocalUser(identifier: string, password: string) {
    const result = await firstValueFrom(
      this.authClient
        .send(AUTH_PATTERNS.VALIDATE_CREDENTIALS, { identifier, password })
        .pipe(
          timeout(3000),
          validateWith(UserWithRelationsContract),
          catchError((err: any) => throwError(() => mapAuthError(err))),
        ),
    );
    return result;
  }
  async verifyCode(res: Response, code: string, tempToken: string) {
    const result = await firstValueFrom<VerifyCodeResponse>(
      this.authClient
        .send(AUTH_PATTERNS.VERIFY_CODE, {
          code,
          tempToken,
        })
        .pipe(catchError((err) => throwError(() => mapAuthError(err)))),
    );

    const { success, errors, data } = safeValidateSchema(
      verifyCodeResponse,
      result,
    );

    if (!success || !data) {
      console.error('Erreur de validation', errors);
      return;
    }

    res.clearCookie('tempToken');

    this.setResponseCookies(
      res,
      data.resetAccessToken,
      'reset_access_token',
      new Date(Date.now() + 1000 * 60 * RESET_TOKEN_EXP_MINUTES),
    );

    return {
      ok: data.ok,
      message: data.message,
    };
  }
  async resetPassword({
    res,
    password,
    token,
    resetToken,
  }: {
    res: Response;
    password: string;
    token?: string;
    resetToken?: string;
  }) {
    const result = await firstValueFrom<ResetPasswordResponse>(
      this.authClient
        .send(AUTH_PATTERNS.RESET_PASSWORD, {
          token: token ?? null,
          password,
          resetToken,
        })
        .pipe(
          timeout(3000),
          catchError((err) => throwError(() => mapAuthError(err))),
        ),
    );
    const { success, errors, data } = safeValidateSchema(
      resetPasswordResponse,
      result,
    );

    if (!success || !data) {
      return;
    }
    return res.status(201).json({ ...data });
  }

  async refreshToken(req: Request, res: Response, refreshToken: string) {
    res.clearCookie('refresh_token');
    const result = await firstValueFrom<RefreshTokenResponse>(
      this.authClient
        .send(AUTH_PATTERNS.REFRESH_TOKEN, { refreshToken })
        .pipe(catchError((err) => throwError(() => mapAuthError(err)))),
    );

    const { success, errors, data } = safeValidateSchema(
      refreshTokenResponse,
      result,
    );
    if (!success || !data) {
      console.error('Erreur de validation', errors);
      return;
    }

    req.logIn(data.user, (err) => {
      if (err)
        throw new InternalServerErrorException(
          'Impossible de se connecter après rafraichisement.',
        );
      this.login(data.user, res, true).catch((err) => {
        throw new InternalServerErrorException(err);
      });
    });
  }

  async resendCode(tempToken: string) {
    const result = await firstValueFrom<{ ok: true; message: string }>(
      this.authClient.send(AUTH_PATTERNS.RESEND_CODE, { tempToken }).pipe(
        timeout(3000),
        catchError((err) => throwError(() => mapAuthError(err))),
      ),
    );

    return result;
  }

  private async createUserSession(userId: string) {
    const result = await firstValueFrom<CreateUserSessionResponse>(
      this.authClient.send(AUTH_PATTERNS.CREATE_USER_SESSION, { userId }).pipe(
        validateWith(createUserSessionResponse),
        catchError((err) => throwError(() => mapAuthError(err))),
      ),
    );
    return result;
  }

  private setResponseCookies(
    res: Response,
    sessionToken: string,
    name: string,
    expires: Date,
  ) {
    res.cookie(name, sessionToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: expires.getTime() - Date.now(),
    });
  }
}
