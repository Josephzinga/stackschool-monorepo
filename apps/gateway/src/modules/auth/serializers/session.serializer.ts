import { PassportSerializer } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { DoneCallback } from 'passport';

import { UserService } from '../../user/user.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { UserWithRelationsContract } from '@stackschool/messaging';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    super();
  }

  serializeUser(user: Record<string, any>, done: DoneCallback) {
    done(null, user.id);
  }

  async deserializeUser(payload: string, done: DoneCallback) {
    try {
      const userKey = `user-${payload}`;
      const userStr = await this.cacheManager.get<string>(userKey);

      const cachedUser = userStr
        ? (JSON.parse(userStr) as UserWithRelationsContract)
        : null;

      if (!cachedUser) {
        const user = await this.userService.findFullUser(payload);
        await this.cacheManager.set(userKey, JSON.stringify(user));
        return done(null, user);
      }
      return done(null, cachedUser);
    } catch (error) {
      return done(error);
    }
  }
}
