import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { loginFormSchema } from '@stackschool/contracts';
import { safeValidateSchema, USER_CACHE_TTL } from '@stackschool/messaging';
import { AuthService } from '../auth.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
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

    const user = await this.authService.validateLocalUser(identifier, password);
    if (user) {
      await this.cacheManager.set(
        `user:${user.id}`,
        JSON.stringify(user),
        USER_CACHE_TTL,
      );
    }
    return user;
  }
}
