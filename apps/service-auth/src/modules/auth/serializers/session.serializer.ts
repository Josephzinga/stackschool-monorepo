import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { DoneCallback } from 'passport';
import { UserService } from '../../user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(user: any, done: DoneCallback) {
    done(null, user.id);
  }

  async deserializeUser(payload: string, done: DoneCallback) {
    try {
      const user = await this.userService.findOne({
        where: { id: payload },
        include: { profile: true, accounts: true },
      });
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
