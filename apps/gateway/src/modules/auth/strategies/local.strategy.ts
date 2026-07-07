import {
  BadRequestException,
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AUTH_PATTERNS, loginFormSchema, UserInMe } from '@stackschool/shared';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { mapAuthError } from '../errors/auth.error-maper';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {
    super({
      usernameField: 'identifier',
      passwordField: 'password',
      session: true,
    });
  }

  async validate(identifier: string, password: string) {
    const safeData = loginFormSchema.safeParse({ identifier, password });
    console.log('Data', safeData.data);
    if (!safeData.success) {
      throw new BadRequestException(
        safeData.error.issues.map((issue) => issue.message).join(', '),
      );
    }

    const result = await firstValueFrom<UserInMe>(
      this.authClient
        .send(AUTH_PATTERNS.VALIDATE_CREDENTIALS, { identifier, password })
        .pipe(
          timeout(3000),
          catchError((err: any) => throwError(() => mapAuthError(err))),
        ),
    );
    console.log('Result', result);
    return result;
  }
}
