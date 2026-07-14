import { Injectable, BadRequestException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { loginFormSchema } from '@stackschool/contracts';
import { safeValidateSchema } from '@stackschool/messaging';
import { AuthService } from '../auth.service';

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
    const dto = { identifier, password };
    const { success, errors, data } = safeValidateSchema(loginFormSchema, dto);

    if (!success || !data)
      throw new BadRequestException(
        errors?.[0]?.message ?? 'Erreur de validation',
      );

    return this.authService.validateLocalUser(identifier, password);
  }
}
