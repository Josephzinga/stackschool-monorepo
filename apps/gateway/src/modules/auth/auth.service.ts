import {
  HttpStatus,
  Inject,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto, RegisterDto } from './dto/auth-dto';
import { catchError, firstValueFrom, pipe, throwError } from 'rxjs';
import { AUTH_PATTERNS, UserInMe } from '@stackschool/shared';
import { Request, Response } from 'express';
import { mapAuthError } from './errors/auth.error-maper';
import { ConfigService } from '@nestjs/config';

interface Session {
  id: string;
  userId: string;
  sessionToken: string;
  expires: Date;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await firstValueFrom<UserInMe | null>(
      this.authClient
        .send(AUTH_PATTERNS.CREATE_USER, dto)
        .pipe(catchError((err) => throwError(() => mapAuthError(err)))),
    );
    return user;
  }

  async login(
    user: Request['user'],
    res: Response,
    isRefresh: boolean = false,
  ) {
    if (!user) throw new UnauthorizedException('Utilisateur non authentifier.');
    const { sessionToken, expires } = await firstValueFrom<Session>(
      this.authClient
        .send(AUTH_PATTERNS.CREATE_USER_SESSION, user.id)
        .pipe(catchError((err) => throwError(() => mapAuthError(err)))),
    );

    this.setResponseCookies(res, sessionToken, new Date(expires));
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
            firstname: user?.profile?.firstname,
            lastname: user?.profile?.lastname,
            photo: user?.profile?.photo,
          },
        },
      }),
    });
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
