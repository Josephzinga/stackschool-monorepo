import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AUTH_PATTERNS,
  AUTH_SERVICE,
  UserWithRelationsContract,
} from '@stackschool/messaging';

import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { mapAuthError } from '../../errors/auth.error-maper';

@Injectable()
export class UserService {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}
  async findFullUser(userId: string) {
    return await firstValueFrom<UserWithRelationsContract>(
      this.authClient.send(AUTH_PATTERNS.FIND_FULL_USER, { userId }).pipe(
        timeout(3000),
        catchError((err) => throwError(() => mapAuthError(err))),
      ),
    );
  }

  async validateField(phoneNumber: string | null, email: string | null) {
    const result = await firstValueFrom<{
      ok: boolean;
      valid?: boolean;
      field?: string;
      message: string;
    }>(
      this.authClient
        .send(AUTH_PATTERNS.VALIDATE_USER_FIELD, {
          phoneNumber,
          email,
        })
        .pipe(
          timeout(1500),
          catchError((err) => throwError(() => mapAuthError(err))),
        ),
    );

    return result;
  }
}
