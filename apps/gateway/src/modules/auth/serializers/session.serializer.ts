import { PassportSerializer } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { DoneCallback } from 'passport';
import { UserService } from '../../user/user.service';
import { ClientProxy, ClientRMQ } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { AUTH_PATTERNS } from '@stackschool/shared';
import { mapAuthError } from '../errors/auth.error-maper';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {
    super();
  }

  serializeUser(user: any, done: DoneCallback) {
    done(null, user.id);
  }

  async deserializeUser(payload: string, done: DoneCallback) {
    try {
      const user = await firstValueFrom<Record<string, any>>(
        this.authClient
          .send(AUTH_PATTERNS.FIND_FULL_USER, payload)
          .pipe(catchError((err) => throwError(() => mapAuthError(err)))),
      );
      if (!user) {
        return done(null, false);
      }
      return done(null, {
        ...user,
        password: null,
      });
    } catch (error) {
      return done(error);
    }
  }
}
