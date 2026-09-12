import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AUTH_PATTERNS,
  AUTH_SERVICE,
  UserWithRelationsContract,
  ValidateUserFieldInput,
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

  async validateField(
    userId: string | undefined,
    phoneNumber: string | undefined,
    email: string | undefined,
  ) {
    const result = await firstValueFrom<{
      ok: boolean;
      valid?: boolean;
      field?: string;
      message: string;
    }>(
      this.authClient
        .send(AUTH_PATTERNS.VALIDATE_USER_FIELD, {
          ...(phoneNumber && {
            phoneNumber,
          }),
          ...(email && {
            email,
          }),
          ...(userId && {
            userId,
          }),
          selfCheck: !!userId,
        } as ValidateUserFieldInput)
        .pipe(
          timeout(1500),
          catchError((err) => throwError(() => mapAuthError(err))),
        ),
    );

    return result;
  }
}
