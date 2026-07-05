import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { DoneCallback } from 'passport';
import { loginFormSchema } from '@stackschool/shared';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'identifier',
      passwordField: 'password',
      session: true,
    });
  }

  async validate(identifier: string, password: string) {
    const result = loginFormSchema.safeParse({ identifier, password });

    if (!result.success) {
      throw new BadRequestException(
        result.error.issues.map((issue) => issue.message).join(', '),
      );
    }

    const user = await this.authService.validateLocalUser({
      identifier: result.data.identifier,
      password: result.data.password,
    });
    return user;
  }
}
